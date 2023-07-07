const router = require('express').Router();
const {
  getCurrentUser, getUser, getUsers, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
