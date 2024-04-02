const { notFoundError } = require('../errors');

module.exports = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const notfound = notFoundError(res.__('error-api-not-found'));

  const response = {
    correlationId: res.get('x-correlation-id'),
    ...notfound.serializeErrors(),
  };

  return res.status(response.statusCode).json(response);
};
