const createQueue = require('./create-queue');

module.exports = async (queueName, jobName, data) => {
  const queue = await createQueue(queueName);
  queue.add(jobName, data, { removeOnComplete: true });
  return data;
};
