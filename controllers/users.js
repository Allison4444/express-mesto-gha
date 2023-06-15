const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED_ERROR,
} = require('../utils/errors');

const CREATED = 201;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('WrongId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (!req.user._id) {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError') {
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
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (!req.user._id) {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError') {
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

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: 'Неправильные почта или пароль', error: err.message });
    });
};

const getCurrentUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserAvatar,
  login,
  getCurrentUserInfo,
};
