const errors = require('../errors');
const rateLimiterPostgres = require('../utils/rate-limiter-postgres');

module.exports = (keys = []) => {
  return async (req, res, next) => {
    try {
      const responses = await Promise.all(
        rateLimiterPostgres.getLimitter(req, keys).promises,
      );
      const { limiters } = rateLimiterPostgres.getLimitter(req, keys);

      const appliedLimiiter = [];
      for (const [index, response] of responses.entries()) {
        if (response) {
          // eslint-disable-next-line security/detect-object-injection
          appliedLimiiter.push({ ...limiters[index], res: response });
          // eslint-disable-next-line security/detect-object-injection
          req[limiters[index].KEY_PREFIX] = limiters[index].POINTS;
        }
      }

      let retrySeconds = 0;
      for (const limiter of appliedLimiiter) {
        if (
          limiter &&
          limiter.res &&
          limiter.res.consumedPoints >= limiter.POINTS
        ) {
          retrySeconds = Math.floor(limiter.res.msBeforeNext / 1000) || 1;
        }
      }

      if (retrySeconds > 0) {
        res.set('Retry-After', String(retrySeconds));
        errors.rateLimitError();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
