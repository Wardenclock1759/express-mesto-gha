const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const BadRequestError = require('../errors/bad-request-error');
const {
  getCurrentUser, getUser, getUsers, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

const userError = new BadRequestError('Переданы некорректные данные при обновлении профиля');
const avatarError = new BadRequestError('Переданы некорректные данные при обновлении аватара');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().length(24).alphanum().required()
      .error(new BadRequestError('Недопустимое значение идентификатора')),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().error(userError),
    name: Joi.string().min(2).max(30).error(new BadRequestError(userError))
      .optional(),
    about: Joi.string().min(2).max(30).error(new BadRequestError(userError))
      .optional(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().error(avatarError),
    avatar: Joi.string().uri().error(new BadRequestError(avatarError)).optional(),
  }),
}), updateUserAvatar);

module.exports = router;
