const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('WrongId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('Cast to ObjectId failed for value')) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при запросе пользователя.',
          });
      } else if (err.message === 'WrongId') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь по указанному _id не найден.',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'На сервере произошла ошибка',
          });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message.includes('user validation failed')) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'На сервере произошла ошибка',
          });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (!req.user._id) {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.message.includes('Validation failed')) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'На сервере произошла ошибка',
          });
      }
    });
};

const changeUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (!req.user._id) {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.message.includes('Validation failed')) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'На сервере произошла ошибка',
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserAvatar,
};
