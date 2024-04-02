const CustomError = require('./custom-error');

class BadRequestError extends CustomError {}

module.exports = BadRequestError;
