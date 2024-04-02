const IORedis = require('ioredis');
const config = require('../../../config/global');
const constant = require('../constants');
const logger = require('../../../config/logger');

const { RETRY_STRATEGY } = constant.REDIS;

class Redis {
  constructor() {
    this.config = {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      maxRetriesPerRequest: 1,
      lazyConnect: false,
      retryStrategy: (times) => {
        const initialDelay = RETRY_STRATEGY.INITIAL_DELY;
        const maxDelay = RETRY_STRATEGY.MAX_DELY;
        const delay = Math.min(initialDelay * 2 ** times, maxDelay);
        const jitter =
          Math.random() * RETRY_STRATEGY.MAX_JITTER_RANDOM_VALUE +
          RETRY_STRATEGY.MIN_JITTER;
        return delay * jitter;
      },
    };
  }

  get client() {
    const redis = new IORedis(this.config);

    redis.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redis.on('error', (error) => {
      logger.info('Redis connection error:', error);
    });

    redis.on('close', () => {
      logger.info('Connection to Redis closed');
    });

    process.setMaxListeners(process.getMaxListeners() + 1);

    process.on('SIGINT', async () => {
      try {
        await redis.quit();
        logger.info('Redis client disconnected and app terminated');
        process.exit(0);
      } catch (error) {
        logger.error('Error during app termination:', error);
        process.exit(1);
      }
    });

    return redis;
  }

  get bullMqClient() {
    return new IORedis(this.url, {
      ...this.config,
      maxRetriesPerRequest: null,
    });
  }

  async set(key, data, EX = constant.REDIS.DEFAULT_CACHING_TIME_IN_SEC) {
    const stringify = JSON.stringify(data);
    await this.client.set(key, stringify, 'EX', EX);
  }

  async get(key) {
    const cached = await this.client.get(key);

    let data = null;
    if (cached) {
      data = JSON.parse(cached);
    }

    return data;
  }

  async del(key = []) {
    await this.client.del(key);
  }
}

module.exports = new Redis();
