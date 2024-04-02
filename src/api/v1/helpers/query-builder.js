module.exports = (queryKeys = {}, options = {}) => {
  const query = { where: queryKeys };

  for (const [key, value] of Object.entries(options)) {
    // eslint-disable-next-line security/detect-object-injection
    query[key] = value;
  }

  return query;
};
