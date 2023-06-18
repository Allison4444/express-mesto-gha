const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const signinRoute = require('./signin');
const signupRoute = require('./signup');
const auth = require('../middlewares/auth');

const { NotFoundError } = require('../utils/errors/NotFoundError');

router.use('/signin', signinRoute);
router.use('/signup', signupRoute);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Тут пусто'));
});

module.exports = router;
