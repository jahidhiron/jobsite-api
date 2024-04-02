const jwt = require('jsonwebtoken');
const errors = require('../errors');

module.exports = (req, token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, async (error, payload) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new errors.ForbiddenError(req.__('error-forbidden')));
        }

        const message =
          error.name === 'JsonWebTokenError'
            ? req.__('error-unauthorized')
            : error.message;

        return reject(new errors.UnauthorizedError(message));
      }

      const user = payload;
      const { id, name, aud, email, verified } = user;
      delete user.aud;

      resolve({ id, name, uniqueId: aud, email, verified });
    });
  });
};
