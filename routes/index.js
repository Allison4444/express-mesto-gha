const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Тут пусто' });
});

module.exports = router;
