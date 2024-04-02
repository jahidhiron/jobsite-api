const { RateLimiterPostgres } = require('rate-limiter-flexible');
const db = require('../models');
const { RATE_LIMIT } = require('../constants');

const options = {
  storeClient: db.sequelize,
  tableName: RATE_LIMIT.TABLE_NAME,
};

module.exports = async () => {
  return new Promise((resolve, reject) => {
    let rateLimiter;
    const ready = (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(rateLimiter);
      }
    };

    rateLimiter = new RateLimiterPostgres(options, ready);
  });
};
