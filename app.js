const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const { NOT_FOUND_CODE, NOT_FOUND_MESSAGE } = require('./constants');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '649ff6c9ed1c11edbbc845c3',
  };

  next();
});

app.use('/', routes);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
});

app.listen(3000);
