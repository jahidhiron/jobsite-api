const http = require('http');
require('dotenv').config();
const initServer = require('./api/v1');
const config = require('./config/global');
const logger = require('./config/logger');

const exitHandler = (server) => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server) =>
  function (error) {
    logger.error(error);
    exitHandler(server);
  };

const startServer = async () => {
  const app = await initServer();

  const httpServer = http.createServer(app);

  const server = httpServer.listen(config.PORT, () => {
    logger.info(`server listening on port ${config.PORT}`);
  });

  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM recieved');
    if (server) {
      server.close();
    }
  });
};

startServer();
