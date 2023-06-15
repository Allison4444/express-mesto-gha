const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR } = require('../utils/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация', err: err.name });
  }

  req.user = payload;

  next();
};