const generateToken = require('./generate-jwt-token');
const config = require('../../../config/global');

module.exports = async (user) => {
  const { name, email, id, uniqueId, aud, verified, verification } = user;
  let userVerfied = false;

  if (verification && verification.email) {
    userVerfied = verification.email.status;
  } else {
    userVerfied = verified || false;
  }

  const payload = {
    name,
    email,
    id,
    verified: userVerfied,
    aud: aud || uniqueId,
  };

  const accessToken = await generateToken({
    payload,
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRED_IN,
    secret: config.JWT_ACCESS_TOKEN_SECRET,
  });
  const refreshToken = await generateToken({
    payload,
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRED_IN,
    secret: config.JWT_REFRESH_TOKEN_SECRET,
  });

  return { accessToken, refreshToken };
};
