const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  STATUS_CREATED,
  BAD_REQUEST_CODE,
  FORBITTEN_CODE,
  NOT_FOUND_CODE,
  INTERNAL_CODE,
  FORBITTEN_MESSAGE,
  INTERNAL_MESSAGE,
} = require('../constants');

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
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(BAD_REQUEST_CODE).send({ message: LIKE_ERROR_MESSAGE });
  }

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      if (card.owner._id !== currentUserId) {
        return res.status(FORBITTEN_CODE).send({ message: FORBITTEN_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

const updateCard = (updateFunction) => (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(BAD_REQUEST_CODE).send({ message: LIKE_ERROR_MESSAGE });
  }

  return Card.findByIdAndUpdate(
    cardId,
    updateFunction(userId),
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE }));
};

module.exports.likeCard = updateCard(
  (userId) => ({ $addToSet: { likes: userId } }),
);

module.exports.dislikeCard = updateCard(
  (userId) => ({ $pull: { likes: userId } }),
);
