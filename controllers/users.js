const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CREATED,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  NOT_FOUND_CODE,
  INTERNAL_CODE,
  INTERNAL_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  AUTHENTICATED,
} = require('../constants');

const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные при создании пользователя.';
const NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден.';
const PROFILE_UPDATE_MESSAGE = 'Переданы некорректные данные при обновлении профиля';
const AVATAR_UPDATE_MESSAGE = 'Переданы некорректные данные при обновлении аватара';

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      const secret = process.env.JWT_SECRET || 'super-strong-secret';
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: AUTHENTICATED });
    })
    .catch(() => {
      res.status(UNAUTHORIZED_CODE).send({ message: UNAUTHORIZED_MESSAGE });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE }));
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      data: user,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

function updateUser(toUpdate, errorMessage) {
  return (req, res) => {
    const userId = req.user._id;
    const updated = toUpdate(req.body);

    User.findByIdAndUpdate(userId, updated, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
        }
        return res.status(INTERNAL_CODE).send({ message: errorMessage });
      });
  };
}

module.exports.updateUserInfo = updateUser(
  ({ name, about }) => ({ name, about }),
  PROFILE_UPDATE_MESSAGE,
);

module.exports.updateUserAvatar = updateUser(({ avatar }) => ({ avatar }), AVATAR_UPDATE_MESSAGE);
