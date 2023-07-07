const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
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
