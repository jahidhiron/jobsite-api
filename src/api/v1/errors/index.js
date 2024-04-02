const CustomError = require('./custom-error');
const BadRequestError = require('./bad-request-error');
const UnauthorizedError = require('./unauthorized-error');
const ForbiddenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const InternalServerError = require('./internal-server-error');
const RequestValidationError = require('./request-validation-error');
const RateLimitError = require('./rate-limit-error');

module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  RequestValidationError,
  RateLimitError,
  newError(message) {
    throw new Error(message);
  },
  customeError(message) {
    throw new CustomError(message);
  },
  badRequestError(message) {
    throw new BadRequestError(message);
  },
  unauthorizedError(message) {
    throw new UnauthorizedError(message);
  },
  forbiddenError(message) {
    throw new ForbiddenError(message);
  },
  notFoundError(message) {
    throw new NotFoundError(message);
  },
  internalServerError(message) {
    throw new InternalServerError(message);
  },
  requestValidationError(errors) {
    throw new RequestValidationError(errors);
  },
  rateLimitError(message) {
    throw new RateLimitError(message);
  },
};
