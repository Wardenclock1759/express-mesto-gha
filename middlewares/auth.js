const jwt = require('jsonwebtoken');
require('dotenv').config();
const NotAuthenticated = require('../errors/not-authenticated');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      const err = new NotAuthenticated('Необходима авторизация');
      return next(err);
    }

    const secret = process.env.JWT_SECRET || 'super-strong-secret';

    const payload = jwt.verify(token, secret);
    req.user = payload;
  } catch (e) {
    const err = new NotAuthenticated('Необходима авторизация');
    next(err);
  }
  return next();
};
