class CustomError extends Error {
  constructor(message = 'Bad request') {
    super(message);
    this.name = 'BadRequest';
    this.response = false;
    this.statusCode = 400;
    this.message = message;
  }

  serializeErrors() {
    return {
      response: this.response,
      statusCode: this.statusCode,
      errors: [{ name: this.name, message: this.message }],
    };
  }
}

module.exports = CustomError;
