const db = require('../models');
const helpers = require('../helpers');
const utils = require('../utils');

class PostgresDbOperation {
  constructor() {
    this.Sequelize = db.Sequelize;
    this.sequelize = db.sequelize;
    this.Role = db.Role;
    this.Log = db.Log;
    this.User = db.User;
  }

  async findOne(Model, queryKeys = {}, options = {}) {
    const query = helpers.queryBuilder(queryKeys, options);
    const instance = await Model.findOne(query);
    if (!instance) return { instance: null, data: null };
    const data = utils.deleteObjectPropery(instance.get(), options.exclude);
    return { instance, data };
  }

  async findAndCountAll(
    Model,
    { page, size, q = '', searchItems = [], sort = [], all = false } = {},
  ) {
    const fetchAll = Boolean(all);
    const queryKeys = {};
    const options = {};

    if (!fetchAll) {
      const p = parseInt(page, 10) || 1;
      const limit = parseInt(size, 10) || 10;
      const offset = (p - 1) * limit;

      options.offset = offset;
      options.limit = limit;
    }

    if (q) {
      queryKeys[this.Sequelize.Op.or] = helpers.searchQuery(
        this.sequelize,
        q,
        searchItems,
      );
    }

    if (sort.length > 0) {
      const order = [];
      for (const element of sort) {
        order.push([element.whom, element.order.toUpperCase()]);
      }

      options.order = order;
    }

    const query = helpers.queryBuilder(queryKeys, options);
    const { count, rows } = await Model.findAndCountAll(query);

    const data = {};
    if (!fetchAll) {
      data.pages = Math.ceil(count / options.limit);
    }
    data.total = count;
    data.collection = rows;

    return data;
  }

  async create(Model, payload, options = {}) {
    const instance = await Model.create(payload);
    const data = utils.deleteObjectPropery(instance.get(), options.exclude);
    return { instance, data };
  }

  async save(source, destination, options = {}) {
    const instance = utils.modifyObjectValue(source, destination);
    await instance.save();
    const data = utils.deleteObjectPropery(instance.get(), options.exclude);
    return { instance, data };
  }

  async destroy(Model, queryKeys, force = false) {
    const query = helpers.queryBuilder(queryKeys, { force });
    const instance = Model.destroy(query);
    return instance;
  }

  async restore(Model, query = {}) {
    const { instance, data } = await this.findOne(
      Model,
      {
        ...query,
        deletedAt: { [this.Sequelize.Op.ne]: null },
      },
      { paranoid: false },
    );

    if (!data) return { data: null, instance: null };

    instance.setDataValue('deletedAt', null);
    instance.setDataValue('deletedBy', null);
    await instance.save();

    return { instance, data: instance.get() };
  }
}

module.exports = PostgresDbOperation;
