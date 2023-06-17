const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).options({ allowUnknown: true }),
}), getCurrentUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http:\/\/|https:\/\/)(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), changeUserAvatar);

module.exports = router;
