const { TASK } = require('../../constants');
const logger = require('../../../../config/logger');
const workers = require('../workers');
const bullmq = require('../bullmq');

module.exports = async (name, data) => {
  const queue = await bullmq.addQueue(TASK.QUEUE.SEND_EMAIL, name, data);
  const worker = bullmq.createWorker(TASK.QUEUE.SEND_EMAIL, workers.sendEmail);

  /**
   * @description
   * this is about hint purpose
   */
  worker.on('completed', (job) => {
    logger.info(`job ${job.id} completed`);
  });

  process.once('SIGTERM', async () => {
    await worker.close();
    await queue.close();
    process.exit(0);
  });
};
