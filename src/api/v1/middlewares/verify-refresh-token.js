const config = require('../../../config/global');
const errors = require('../errors');
const { redis } = require('../services');
const utils = require('../utils');

module.exports = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      errors.unauthorizedError(req.__('error-unauthorized'));
    }

    const user = await utils.verifyToken(
      req,
      refreshToken,
      config.JWT_REFRESH_TOKEN_SECRET,
    );

    const token = await redis.get(refreshToken);
    if (!token) {
      errors.unauthorizedError(req.__('error-unauthorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'Forbidden') {
      utils.clearCookie({ res });
    }

    next(error);
  }
};
