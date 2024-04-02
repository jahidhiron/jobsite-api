module.exports = ({ res, msg, statusCode = 200, ...rest }) => {
  const response = {
    statusCode,
    response: true,
    // eslint-disable-next-line no-underscore-dangle
    message: res.__(msg),
  };

  if (Object.keys(rest).length > 0) {
    response.data = { ...rest };
  }

  return res.status(statusCode).json(response);
};
