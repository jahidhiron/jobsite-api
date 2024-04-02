const CustomError = require('./custom-error');

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'Forbidden';
    this.response = false;
    this.statusCode = 403;
    this.message = message;
  }
}

module.exports = ForbiddenError;
