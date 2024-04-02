const express = require('express');
const { getModules } = require('./utils');
const { APP } = require('./constants');

module.exports = (app) => {
  if (
    Object.prototype.hasOwnProperty.call(app, 'listen') &&
    typeof app.listen === 'function'
  ) {
    const modules = getModules();

    // eslint-disable-next-line no-restricted-syntax
    for (const { router, base } of modules) {
      if (Object.getPrototypeOf(router) === express.Router) {
        app.use(`/${APP.API_PREFIX}/${APP.API_VERSION}/${base}`, router);
      }
    }
  }
};
