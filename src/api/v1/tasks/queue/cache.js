const { TASK } = require('../../constants');
const workers = require('../workers');
const bullmq = require('../bullmq');

exports.set = async (name, data) => {
  await bullmq.addQueue(TASK.QUEUE.CACHE, name, data);
  bullmq.createWorker(TASK.QUEUE.CACHE, workers.cache.set);
};

exports.del = async (name, data) => {
  await bullmq.addQueue(TASK.QUEUE.CACHE, name, data);
  bullmq.createWorker(TASK.QUEUE.CACHE, workers.cache.del);
};
