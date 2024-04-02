const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFound';
    this.response = false;
    this.statusCode = 404;
    this.message = message;
  }
}

module.exports = NotFoundError;
