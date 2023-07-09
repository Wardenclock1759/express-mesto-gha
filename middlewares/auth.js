const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return handleAuthError(res);
  }

  const secret = process.env.JWT_SECRET || 'super-strong-secret';
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
