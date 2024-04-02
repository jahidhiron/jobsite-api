const { RateLimiterPostgres } = require('rate-limiter-flexible');
const db = require('../models');
const { RATE_LIMIT } = require('../constants');

const options = {
  storeClient: db.sequelize,
  tableName: RATE_LIMIT.TABLE_NAME,
  keyPrefix: RATE_LIMIT.KEY_PREFIX,
  tableCreated: true,
};

const rateLimiterPostgres = (rest) => {
  return new RateLimiterPostgres({
    ...options,
    ...rest,
  });
};

const processLimit = (req, keys = []) => {
  const limiterConstants = Object.entries(RATE_LIMIT.LIMITS);

  const limits = [];
  // eslint-disable-next-line no-unused-vars
  for (const [_TYPE, { ITEMS }] of limiterConstants) {
    for (const item of ITEMS) {
      if (keys.length === 0 || keys.includes(item.KEY_PREFIX)) {
        let key = '';
        for (const field of item.FIELDS) {
          if (field.nested) {
            let prefix = '';
            if (key) {
              prefix = '_';
            }

            key += `${prefix}${req[field.nested][field.location]}`;
          } else {
            let prefix = '';
            if (key) {
              prefix = '_';
            }

            key += `${prefix}${req[field.location]}`;
          }
        }

        limits.push({
          rateLimiter: rateLimiterPostgres({
            keyPrefix: item.KEY_PREFIX,
            points: item.POINTS,
            duration: item.DURATION_IN_SEC,
            blockDuration: item.BLOCK_DURATION_IN_SEC,
          }),
          key,
          limitConstant: item,
        });
      }
    }
  }

  return limits;
};

exports.consumeLimitter = (req, keys) => {
  const limits = processLimit(req, keys);
  const promises = [];
  const limiters = [];

  for (const limit of limits) {
    limiters.push(limit.limitConstant);
    promises.push(limit.rateLimiter.consume(limit.key));
  }

  return { promises, limiters };
};

exports.getLimitter = (req, keys) => {
  const limits = processLimit(req, keys);
  const promises = [];
  const limiters = [];

  for (const limit of limits) {
    limiters.push(limit.limitConstant);
    promises.push(limit.rateLimiter.get(limit.key));
  }

  return { promises, limiters };
};
