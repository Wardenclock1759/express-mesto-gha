const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routes = require('./routes/index');
const { NOT_FOUND_CODE, NOT_FOUND_MESSAGE } = require('./constants');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', routes);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
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
});

app.listen(3000);
