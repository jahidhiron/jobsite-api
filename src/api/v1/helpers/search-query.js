module.exports = (sequelize, q, attrs) => {
  const query = {};

  if (Array.isArray) {
    attrs.forEach((attr) => {
      // eslint-disable-next-line security/detect-object-injection
      query[attr] = sequelize.where(
        sequelize.fn('LOWER', sequelize.col(attr)),
        'LIKE',
        `%${q.trim().toLocaleLowerCase()}%`,
      );
    });
  }

  return query;
};
