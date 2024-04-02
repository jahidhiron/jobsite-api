const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const config = require('./global');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIPFormat = () =>
  config.ENV === 'production' ? ':remote-addr - ' : '';

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' },
);

const successResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
const successHandler = morgan(successResponseFormat, {
  stream: accessLogStream,
  skip: (_req, res) => res.statusCode >= 400,
});

const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date - error-message: :message`;
const errorHandler = morgan(errorResponseFormat, {
  stream: accessLogStream,
  skip: (_req, res) => res.statusCode < 400,
});

module.exports = { successHandler, errorHandler };
