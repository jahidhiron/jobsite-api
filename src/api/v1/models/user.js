const { Model } = require('sequelize');
const { hashPassword } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Log, {
        foreignKey: 'userId',
      });
      // User.hasOne(models.Role, { foreignKey: 'updatedBy' });
      // User.hasOne(models.Role, { foreignKey: 'deletedBy' });
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
      User.belongsTo(models.User, { foreignKey: 'deletedBy' });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uniqueId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'First name is required' },
          notEmpty: { msg: 'First name is required' },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Last name is required' },
          notEmpty: { msg: 'Last name is required' },
        },
      },
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
      // userType: {
      //   type: DataTypes.VIRTUAL,
      //   get() {
      //     // eslint-disable-next-line no-nested-ternary
      //     return this.role === 1
      //       ? roleName.ADMIN
      //       : this.role === 2
      //         ? roleName.EMPLOYER
      //         : roleName.CANDIDATE;
      //   },
      // },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: 'Email already in use' },
        validate: {
          notNull: { msg: 'Email is required' },
          notEmpty: { msg: 'Email is required' },
          isEmail: { msg: 'Invalid email' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Password is required' },
          notEmpty: { msg: 'Password is required' },
          len: {
            args: [6, 64],
            msg: 'Password should be between 6 and 64 characters long',
          },
        },
      },
      verification: {
        type: DataTypes.JSONB,
      },
      resetPassword: {
        type: DataTypes.JSONB,
      },
      lastLogin: {
        type: DataTypes.DATE,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'deletedBy',
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      paranoid: true,
      hooks: {
        afterValidate: async (record) => {
          const user = record;
          const password = user.getDataValue('password');
          const changed = user.changed('password');

          if (password && changed && !user.hashedPassword) {
            const hashedPassword = await hashPassword(password);
            user.setDataValue('password', hashedPassword);
            user.hashedPassword = true;
          }
        },
      },
    },
  );

  return User;
};
