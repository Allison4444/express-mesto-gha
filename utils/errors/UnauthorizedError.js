const { UNAUTHORIZED_ERROR } = require('../errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = { UnauthorizedError };
