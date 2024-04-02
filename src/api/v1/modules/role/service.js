const { PostgresDbOperation } = require('../../services');
const { EXCLUDE } = require('../../constants');

const modulePermission = (payload, permission) => ({
  name: payload.updatedName || payload.name,
  permission: {
    read: permission.read || false,
    write: permission.write || false,
    update: permission.update || false,
    delete: permission.delete || false,
  },
});

class RoleService extends PostgresDbOperation {
  async findOneRole(queryKeys, options) {
    const role = await this.findOne(this.Role, queryKeys, options);
    return role;
  }

  async findAllRole(query) {
    const data = await this.findAndCountAll(this.Role, {
      ...query,
      searchItems: ['title'],
    });
    // eslint-disable-next-line security/detect-object-injection
    delete Object.assign(data, { roles: data.collection }).collection;

    return data;
  }

  findOnePermission({ data, name }) {
    const { modules } = data;
    const index = modules.findIndex((_module) => _module.name === name);
    if (index === -1) {
      return { permission: null };
    }

    // eslint-disable-next-line security/detect-object-injection
    return { ...modules[index], index };
  }

  async roleTitleExist({ id, title }) {
    const { data } = await this.findOneRole({
      title,
      id: { [this.Sequelize.Op.ne]: id },
    });

    return data;
  }

  async permissionExist({ id, name }) {
    const { data } = await this.findOneRole({
      id,
      modules: {
        [this.Sequelize.Op.contains]: [{ name }],
      },
    });

    return data;
  }

  async createRole({ payload }) {
    const newRole = await this.create(this.Role, payload, {
      exclude: EXCLUDE,
    });
    return newRole;
  }

  async updateRole({ instance, payload }) {
    const udpatedRole = await this.save(instance, payload, {
      exclude: EXCLUDE,
    });

    return udpatedRole;
  }

  async deleteRole({ id, force }) {
    const deletedUser = await this.destroy(this.Role, { id }, force);
    return deletedUser;
  }

  async restoreRole({ id }) {
    const restoredRole = await this.restore(this.Role, { id });
    return restoredRole;
  }

  async addPermission({ instance, data, payload }) {
    const permission = payload.permission || {};
    const { modules } = data;
    const _module = modulePermission(payload, permission);
    modules.push(_module);
    const updatedRole = await this.save(
      instance,
      { modules },
      { exclude: EXCLUDE },
    );

    return updatedRole;
  }

  async updatePermission({ instance, data, payload }) {
    const permission = payload.permission || {};
    const { modules } = data;
    const _module = modulePermission(payload, permission);
    const { index } = this.findOnePermission({ data, name: payload.name });
    // eslint-disable-next-line security/detect-object-injection
    modules[index] = _module;
    const updatedRole = await this.save(
      instance,
      { modules },
      { exclude: EXCLUDE },
    );

    return updatedRole;
  }

  async deletePermission({ instance, data, payload }) {
    const { modules } = data;
    const updatedModules = modules.filter(
      (_module) => _module.name !== payload.name,
    );
    const updatedRole = await this.save(
      instance,
      { modules: updatedModules },
      { exclude: EXCLUDE },
    );

    return updatedRole;
  }
}

module.exports = new RoleService();
