const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const BadRequestError = require('../errors/bad-request-error');
const {
  login, createUser,
} = require('../controllers/users');

const error = new BadRequestError('Переданы некорректные данные при создании пользователя.');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(error),
    password: Joi.string().required().min(8).error(error),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(error),
    password: Joi.string().required().min(8).error(error),
    name: Joi.string().min(2).max(30).error(error),
    about: Joi.string().min(2).max(30).error(error),
    avatar: Joi.string().uri().error(error),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
