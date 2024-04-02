const { sendEmail } = require('../../../services');

module.exports = async (parameters) => {
  await sendEmail({ ...parameters });
};
