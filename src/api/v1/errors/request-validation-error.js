const CustomError = require('./custom-error');

class RequestValidationError extends CustomError {
  constructor(errors, message = 'Invalid request parameters') {
    super(message);
    this.name = 'InvalidRequestParameters';
    this.response = false;
    this.statusCode = 400;
    this.errors = errors;
    this.message = message;
  }

  serializeErrors() {
    return {
      name: this.name,
      response: this.response,
      statusCode: this.statusCode,
      errors: this.errors
        .map((error) => {
          return {
            message: error.msg,
            field: error.path,
            location: error.location,
          };
        })
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.field === value.field),
        ),
    };
  }
}

module.exports = RequestValidationError;
