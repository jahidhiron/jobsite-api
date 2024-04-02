module.exports = {
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || 'api',
  ROUTING_FILE: process.env.ROUTING_FILE || 'index.js',
  MODULE_ROOT_DIR: process.env.MODULE_ROOT_DIR || 'modules',
  CONTENT_SECURITY_POLICY: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
  },
  TOKEN: {
    ACCESS: 'accessToken',
    REFRESH: 'refreshToken',
  },
};
