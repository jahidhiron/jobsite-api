const { Queue } = require('bullmq');
const { redis } = require('../../services');

module.exports = async (name) => {
  const queue = new Queue(name, { connection: redis.bullMqClient });
  return queue;
};
