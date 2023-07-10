const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser, getUser, getUsers, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().optional(),
  }),
}), updateUserAvatar);

module.exports = router;
