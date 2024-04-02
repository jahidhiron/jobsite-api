const helpers = require('../../helpers');
const errors = require('../../errors');

module.exports = async (job) => {
  const { template } = job.data;
  try {
    // throw new Error('test');

    if (template) {
      await helpers.sendEmail(template);
    }
  } catch (error) {}
};
