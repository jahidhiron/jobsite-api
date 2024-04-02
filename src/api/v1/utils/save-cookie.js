const config = require('../../../config/global');
const {
  APP: { TOKEN },
} = require('../constants');

module.exports = ({ res, accessToken, refreshToken }) => {
  res.cookie(TOKEN.ACCESS, accessToken, {
    httpOnly: true,
    secure: config.ENV === 'production',
  });
  res.cookie(TOKEN.REFRESH, refreshToken, {
    httpOnly: true,
    secure: config.ENV === 'production',
  });
};
