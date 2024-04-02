const logger = require('../../../config/logger');
const db = require('../models');
const createRateLimiter = require('../utils/create-rate-limiter');

module.exports = async () => {
  try {
    await db.sequelize.authenticate();
    await createRateLimiter();
    logger.info('Database connection successful');
  } catch (error) {
    db.sequelize.close();
    logger.error('Error to connect database');
    logger.error(error);
  }

  return db;
};
