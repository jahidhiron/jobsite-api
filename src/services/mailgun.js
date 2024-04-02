const formData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config/global');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: config.MAILGUN_API_KEY,
});

const sendEmail = async ({
  from = config.MAIL_FROM,
  to,
  subject,
  text = '',
  html = '',
  attachment = [],
} = {}) => {
  if (to && subject && (text || html)) {
    await mg.messages.create(config.MAILGUN_DOMAIN, {
      from: from || config.MAIL_FROM,
      to,
      subject,
      text,
      html,
      attachment,
    });
  } else {
    throw new Error(
      "To send an email 'to', 'subject', 'text' or 'html' parameters are required",
    );
  }
};

module.exports = { mg, sendEmail };
