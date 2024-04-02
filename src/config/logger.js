// eslint-disable-next-line import/no-extraneous-dependencies
const winston = require('winston');
const config = require('./global');

const { format, createLogger, transports } = winston;

const winstonFormat = format.printf(
  ({ timestamp, level, message, stack }) =>
    `${timestamp}: ${level}: ${stack || message}`,
);

const level = config.ENV === 'development' ? 'debug' : 'info';
const colorize =
  config.ENV === 'development' ? format.colorize() : format.uncolorize();

const logger = createLogger({
  level,
  format: format.combine(format.timestamp(), winstonFormat, colorize),
  transports: [new transports.Console()],
});

module.exports = logger;
