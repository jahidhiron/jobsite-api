const CustomError = require('./custom-error');

class RateLimitError extends CustomError {
  constructor(message = 'Too many requests') {
    super(message);
    this.name = 'TooManyRequests';
    this.response = false;
    this.statusCode = 429;
    this.message = message;
  }
}

module.exports = RateLimitError;
