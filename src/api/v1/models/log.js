const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  Log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Title is required' },
          notEmpty: { msg: 'Title is required' },
        },
      },
      desc: DataTypes.STRING,
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'IP address is required' },
          notEmpty: { msg: 'IP address is required' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Log',
      timestamps: true,
      updatedAt: false,
      paranoid: true,
    },
  );
  return Log;
};
