const { redis } = require('../../services');

exports.set = async (job) => {
  const { key, value, ex } = job.data;

  if (key && value && ex) {
    await redis.set(key, value, ex);
  }
};

exports.del = async (job) => {
  const { key } = job.data;

  if (key) {
    await redis.del(key);
  }
};
