const mongoose = require('mongoose');
const User = require('../models/user');

const {
  BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_CODE, INTERNAL_MESSAGE,
} = require('../constants');

const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные при создании пользователя.';
const NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден.';
const PROFILE_UPDATE_MESSAGE = 'Переданы некорректные данные при обновлении профиля';
const AVATAR_UPDATE_MESSAGE = 'Переданы некорректные данные при обновлении аватара';

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
  const { name, about, avatar } = req.body;

  // if (!name || !about || !avatar) {
  //   res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
  // }

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  // if (!name || !about) {
  //   res.status(BAD_REQUEST_CODE).send({ message: PROFILE_UPDATE_MESSAGE });
  // }

  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: PROFILE_UPDATE_MESSAGE });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;

  // if (!avatar) {
  //   res.status(BAD_REQUEST_CODE).send({ message: AVATAR_UPDATE_MESSAGE });
  // }

  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: AVATAR_UPDATE_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};
