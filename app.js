const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');
const NotFoundError = require('./errors/not-found-error');
const { NOT_FOUND_MESSAGE } = require('./constants');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', routes);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(NOT_FOUND_MESSAGE);
  next(error);
});

app.use(errors());

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Пользователь уже существует';
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000);
