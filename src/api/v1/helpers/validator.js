const validator = require('express-validator');
const utils = require('../utils');

const { body, param, query, header, cookie } = validator;

exports.required = (field, msgKey = null, location = body) => {
  let msg = '';
  if (typeof msgKey === 'object' && !Array.isArray(msgKey) && msgKey !== null) {
    msg = msgKey.key;
  } else {
    msg = {
      key: 'val-field-required',
      name: msgKey || utils.capitalize(field),
    };
  }

  return location(field).notEmpty().withMessage(msg);
};

exports.checkEmail = (field = 'email', name = 'Email') =>
  this.required(field, name).isEmail().withMessage('val-invalid-email');

exports.checkPassword = (
  field = 'password',
  name = 'Password',
  length = { min: 6, max: 64 },
) =>
  this.required(field, name)
    .trim()
    .isLength(length)
    .withMessage('val-password-requirement');

exports.body = body;
exports.param = param;
exports.query = query;
exports.header = header;
exports.cookie = cookie;
exports.core = validator;
