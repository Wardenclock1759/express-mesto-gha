const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const auth = require('../middlewares/auth');
const {
  login, createUser,
} = require('../controllers/users');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => {
      if (!isURL(value)) {
        return helper.message('Неправильная ссылка на картинку');
      }
      return value;
    }),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
