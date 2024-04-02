const { CustomError } = require('../errors');
const config = require('../../../config/global');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, _next) => {
  let response = {
    correlationId: res.get('x-correlation-id') || Date.now(),
  };

  if (error instanceof CustomError) {
    response = { ...response, ...error.serializeErrors() };
  } else {
    response = {
      ...response,
      response: false,
      statusCode: 500,
      errors: [
        { name: error.name || 'InternalServerError', message: error.message },
      ],
    };
  }

  if (config.ENV === 'development') {
    response.stack = error.stack;
  }

  if (response.statusCode === 500) {
    /**
     * @TODO
     * invoke send email function to notify system administrator
     */
  }

  res.locals.errorMessage = response.errors[0].message;

  return res.status(response.statusCode).json(response);
};
