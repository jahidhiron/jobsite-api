const fs = require('fs');
const path = require('path');
const { APP } = require('../constants');

const root = path.join(__dirname, '..', APP.MODULE_ROOT_DIR);

module.exports = () => {
  const modules = [];

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readdirSync(root).forEach((_module) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.readdirSync(path.join(root, _module)).forEach((file) => {
      if (file === APP.ROUTING_FILE) {
        // eslint-disable-next-line import/no-dynamic-require, global-require, security/detect-non-literal-require
        const route = require(path.join(root, _module, file));
        const router = route.router || route;
        const base = route.base || _module;
        modules.push({ router, base });
      }
    });
  });

  return modules;
};
