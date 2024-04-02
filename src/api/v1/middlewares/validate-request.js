const { validationResult } = require('express-validator');
const { requestValidationError } = require('../errors');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    for (const error of errors.array()) {
      if (
        typeof error.msg === 'object' &&
        !Array.isArray(error.msg) &&
        error.msg.key &&
        error.msg !== null
      ) {
        const { key, name } = error.msg;
        error.msg = req.__(key, { name });
      } else if (error.msg.split(' ').length === 1) {
        error.msg = req.__(error.msg);
      }
    }

    requestValidationError(errors.array());
  }
  next();
};
