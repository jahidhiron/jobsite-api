const { Worker } = require('bullmq');
const { redis } = require('../../services');

module.exports = (
  name,
  fn,
  options = { removeOnComplete: true, concurrency: 50 },
) => {
  const worker = new Worker(name, fn, {
    connection: redis.bullMqClient,
    ...options,
  });

  return worker;
};
