const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden');

const {
  STATUS_CREATED,
  BAD_REQUEST_CODE,
  INTERNAL_CODE,
  FORBITTEN_MESSAGE,
  INTERNAL_MESSAGE,
} = require('../constants');

const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные при создании карточки.';
const NOT_FOUND_MESSAGE = 'Карточка с указанным _id не найдена.';
const LIKE_ERROR_MESSAGE = 'Переданы некорректные данные для постановки/снятии лайка.';

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      if (card.owner !== currentUserId) {
        throw new ForbiddenError(FORBITTEN_MESSAGE);
      }
      return res.send({ card });
    })
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_CODE).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res.status(INTERNAL_CODE).send({ message: INTERNAL_MESSAGE });
    });
};

const updateCard = (updateFunction) => (req, res, next) => {
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
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      return res.send({ card });
    })
    .catch(next);
};

module.exports.likeCard = updateCard(
  (userId) => ({ $addToSet: { likes: userId } }),
);

module.exports.dislikeCard = updateCard(
  (userId) => ({ $pull: { likes: userId } }),
);
