const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const morgan = require('../../config/morgan');
const loaders = require('./loaders');
const middlewares = require('./middlewares');
const config = require('../../config/global');
const i18n = require('./locales/i18n');
const setupRoute = require('./routes');
const { APP } = require('./constants');

const initServer = async () => {
  const app = express();

  await loaders.loadPostgres();

  app.use(
    cors({
      credentials: true,
      origin: [config.CLIENT_ORIGIN],
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
  app.use(xss());
  app.use(
    helmet.contentSecurityPolicy({
      ...APP.CONTENT_SECURITY_POLICY,
      reportOnly: true,
    }),
  );

  app.use(i18n.init);
  app.use(middlewares.processRequest);
  setupRoute(app);
  app.use('*', middlewares.notFoundRequest);
  app.use(middlewares.handleError);

  return app;
};

module.exports = initServer;
