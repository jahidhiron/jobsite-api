const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Role.belongsTo(models.User, {
      //   foreignKey: 'updatedBy',
      // });
      // Role.belongsTo(models.User, {
      //   foreignKey: 'deletedBy',
      // });
      Role.hasOne(models.User, { foreignKey: 'roleId' });
    }
  }
  Role.init(
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
        unique: { args: true, msg: 'Role already created' },
        validate: {
          notNull: { msg: 'Title is required' },
          notEmpty: { msg: 'Title is required' },
        },
      },
      desc: {
        type: DataTypes.TEXT,
        get() {
          const desc = this.getDataValue('desc');
          if (!desc) return;
          return desc;
        },
      },
      modules: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      // updatedBy: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: 'Users',
      //     key: 'id',
      //     as: 'updatedBy',
      //   },
      // },
      // deletedBy: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: 'Users',
      //     key: 'id',
      //     as: 'deletedBy',
      //   },
      //   get() {
      //     const deletedBy = this.getDataValue('deletedBy');
      //     if (!deletedBy) return;
      //     return deletedBy;
      //   },
      // },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          const deletedAt = this.getDataValue('deletedAt');
          if (!deletedAt) return;
          return deletedAt;
        },
      },
    },
    {
      sequelize,
      modelName: 'Role',
      timestamps: true,
      paranoid: true,

      hooks: {
        afterCreate: (record) => {
          const role = record;

          delete role.dataValues.createdAt;
          delete role.dataValues.updatedAt;
          delete role.dataValues.deletedAt;
          delete role.dataValues.updatedBy;
          delete role.dataValues.deletedBy;
        },
        afterUpdate: (record) => {
          const role = record;

          delete role.dataValues.createdAt;
          delete role.dataValues.updatedAt;
          delete role.dataValues.deletedAt;
          delete role.dataValues.updatedBy;
          delete role.dataValues.deletedBy;
        },
      },
    },
  );
  return Role;
};
