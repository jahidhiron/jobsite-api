const CustomError = require('./custom-error');

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'Unauthorized';
    this.response = false;
    this.statusCode = 401;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
