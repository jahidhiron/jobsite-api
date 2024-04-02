const removeBlankAttributes = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      // eslint-disable-next-line security/detect-object-injection
      acc[key] = Object.keys(value) > 0 ? removeBlankAttributes(value) : value;
    }
    return acc;
  }, {});
};

module.exports = removeBlankAttributes;
