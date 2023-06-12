const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

const CREATED = 201;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('WrongId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при удалении карточки.',
          });
      } else if (err.message === 'WrongId') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Передан несуществующий _id карточки.',
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('WrongId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'WrongId') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Передан несуществующий _id карточки.',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('WrongId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'WrongId') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Передан несуществующий _id карточки.',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для снятия лайка.',
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
