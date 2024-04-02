const config = require('../../../config/global');
const {
  APP: { TOKEN },
} = require('../constants');

module.exports = ({ res, accessToken = true, refreshToken = true }) => {
  if (accessToken) {
    res.clearCookie(TOKEN.ACCESS, {
      secure: config.ENV === 'production',
    });
  }
  if (refreshToken) {
    res.clearCookie(TOKEN.REFRESH, {
      secure: config.ENV === 'production',
    });
  }
};
