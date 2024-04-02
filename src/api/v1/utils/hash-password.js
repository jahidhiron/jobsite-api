const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

module.exports = async (password) => {
  const salt = randomBytes(8).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  const hashedPassword = `${buf.toString('hex')}.${salt}`;

  return hashedPassword;
};
