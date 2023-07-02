const Card = require('../models/card');

const {
  BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_CODE, INTERNAL_MESSAGE,
} = require('./constants');

const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные при создании карточки.';
const NOT_FOUND_MESSAGE = 'Карточка с указанным _id не найдена.';
const LIKE_ERROR_MESSAGE = 'Переданы некорректные данные для постановки/снятии лайка.';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  const { userId } = req.user._id;

  if (!cardId || !userId) {
    res.status(BAD_REQUEST_CODE).send({ message: LIKE_ERROR_MESSAGE });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
    (err, card) => {
      if (err) {
        return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
      }
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: card });
    },
  );
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params.cardId;
  const { userId } = req.user._id;

  if (!cardId || !userId) {
    res.status(BAD_REQUEST_CODE).send({ message: LIKE_ERROR_MESSAGE });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
    (err, card) => {
      if (err) {
        return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
      }
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: card });
    },
  );
};
