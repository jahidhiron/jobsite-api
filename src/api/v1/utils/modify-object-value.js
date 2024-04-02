module.exports = (source, destination) => {
  const copy = source || {};

  if (
    typeof destination === 'object' &&
    !Array.isArray(destination) &&
    destination !== null
  ) {
    for (const [key, value] of Object.entries(destination)) {
      // eslint-disable-next-line security/detect-object-injection
      copy[key] = value;
      copy.changed(key, true);
    }
  }

  return copy;
};
