const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { NOT_FOUND } = require('./errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6485955e8e59c8f24576b12a',
  };

  next();
});

app.use(router);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Тут пусто' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
