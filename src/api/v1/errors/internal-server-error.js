const CustomError = require('./custom-error');

class InternalServerError extends CustomError {
  constructor(message = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
    this.response = false;
    this.statusCode = 500;
    this.message = message;
  }
}

module.exports = InternalServerError;
