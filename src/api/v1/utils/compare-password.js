const { scrypt } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

module.exports = async (storedPassword, suppliedPassword) => {
  const [hashedPassword, salt] = storedPassword.split('.');
  const buf = await scryptAsync(suppliedPassword, salt, 64);

  return buf.toString('hex') === hashedPassword;
};
