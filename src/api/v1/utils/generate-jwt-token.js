const jwt = require('jsonwebtoken');
const errors = require('../errors');
const config = require('../../../config/global');

module.exports = ({ payload, expiresIn, secret }) => {
  return new Promise((resolve, reject) => {
    const copy = { ...payload };
    const options = {
      expiresIn,
      issuer: config.APP_NAME,
      audience: copy.aud,
    };

    delete copy.aud;

    jwt.sign(copy, secret, options, (error, token) => {
      if (error) return reject(errors.internalServerError(error.message));
      resolve(token);
    });
  });
};
