const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  changeUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get('/:userId', getUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
