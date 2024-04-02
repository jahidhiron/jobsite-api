const { redis } = require('../services');
const utils = require('../utils');
const errors = require('../errors');
const config = require('../../../config/global');

module.exports = async (req, res, next) => {
  const { accessToken } = req.cookies;

  try {
    if (!accessToken) {
      errors.unauthorizedError(req.__('error-unauthorized'));
    }

    const backlist = await redis.get(accessToken);
    if (backlist) {
      errors.unauthorizedError(req.__('error-unauthorized'));
    }

    const user = await utils.verifyToken(
      req,
      accessToken,
      config.JWT_ACCESS_TOKEN_SECRET,
    );

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'Forbidden') {
      utils.clearCookie({ res, refreshToken: false });
    }
    next(error);
  }
};
