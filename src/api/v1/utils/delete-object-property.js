module.exports = (source, property = []) => {
  const copy = source || {};

  if (Array.isArray(property)) {
    for (const key of property) {
      // eslint-disable-next-line security/detect-object-injection
      delete copy[key];
    }
  }

  return copy;
};
