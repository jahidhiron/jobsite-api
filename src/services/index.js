const aws = require('./aws');
const mailgun = require('./mailgun');

module.exports = { ...aws, ...mailgun };
