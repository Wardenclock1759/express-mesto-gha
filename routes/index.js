const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  login, createUser,
} = require('../controllers/users');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
