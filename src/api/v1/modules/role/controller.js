const errors = require('../../errors');
const roleService = require('./service');
const helpers = require('../../helpers');

class RoleController {
  async getRoles(req, res, next) {
    try {
      const data = await roleService.findAllRole({ ...req.body });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-get-role-list',
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRole(req, res, next) {
    try {
      const { data } = await roleService.findOneRole({ id: req.params.id });
      if (!data) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-get-role-by-id',
        role: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createRole(req, res, next) {
    try {
      const { title } = req.body;

      const { data: roleExist } = await roleService.findOneRole({ title });
      if (roleExist) {
        errors.badRequestError(req.__('error-role-exist'));
      }

      /**
       *@TODO
       add updatedBy user reference when create a role 
       */
      const { data: role } = await roleService.createRole({
        payload: req.body,
      });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-role-create',
        statusCode: 201,
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const { data: userRole, instance } = await roleService.findOneRole({
        id,
      });
      if (!userRole) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      const titleExist = await roleService.roleTitleExist({ id, title });
      if (titleExist) {
        errors.badRequestError(req.__('error-role-exist'));
      }

      /**
       *@TODO
       add updatedBy user reference when create a role 
       */
      const { data: role } = await roleService.updateRole({
        instance,
        payload: req.body,
      });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-role-update',
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async softDeleteRole(req, res, next) {
    try {
      const { id } = req.params;

      /**
       *@TODO
       add updatedBy user reference when create a role 
       */
      const userExist = await roleService.deleteRole({
        id,
      });
      if (!userExist) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      /**
       *@TODO
       *save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-role-delete',
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreRole(req, res, next) {
    try {
      const { id } = req.params;

      /**
       *@TODO
       add updatedBy user reference when create a role 
       */
      const { data: role } = await roleService.restoreRole({
        id,
      });
      if (!role) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-role-restore',
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async hardDeleteRole(req, res, next) {
    try {
      const { id } = req.params;

      /**
       *@TODO
       add updatedBy user reference when create a role 
       */
      const userExist = await roleService.deleteRole({
        id,
        force: true,
      });
      if (!userExist) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-permanent-role-delete',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPermission(req, res, next) {
    try {
      const { data } = await roleService.findOneRole({ id: req.params.id });
      if (!data) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      const { permission } = roleService.findOnePermission({
        data,
        name: req.query.name,
      });
      if (!permission) {
        errors.notFoundError(req.__('error-permission-not-found'));
      }

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-get-permission',
        permission,
      });
    } catch (error) {
      next(error);
    }
  }

  async addPermission(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const { data, instance } = await roleService.findOneRole({ id });
      if (!data) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      const { permission } = roleService.findOnePermission({ data, name });
      if (permission) {
        errors.badRequestError(req.__('error-permission-exist'));
      }

      const { data: role } = await roleService.addPermission({
        instance,
        data,
        payload: req.body,
      });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-role-create',
        statusCode: 201,
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req, res, next) {
    try {
      const { id } = req.params;
      const { name, updatedName } = req.body;

      const { data, instance } = await roleService.findOneRole({ id });
      if (!data) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      const { permission } = roleService.findOnePermission({
        data,
        name,
      });
      if (!permission) {
        errors.notFoundError(req.__('error-permission-not-found'));
      }

      if (updatedName) {
        const permissionExist = await roleService.permissionExist({
          id,
          name: updatedName,
        });
        if (permissionExist) {
          errors.badRequestError(req.__('error-permission-exist'));
        }
      }

      const { data: role } = await roleService.updatePermission({
        instance,
        data,
        payload: req.body,
      });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-permission-update',
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const { data, instance } = await roleService.findOneRole({ id });
      if (!data) {
        errors.notFoundError(req.__('error-role-not-found'));
      }

      const { permission } = roleService.findOnePermission({ data, name });
      if (!permission) {
        errors.notFoundError(req.__('error-permission-not-found'));
      }

      await roleService.deletePermission({
        instance,
        data,
        payload: req.body,
      });

      /**
       *@TODO
       save activity log
       */

      helpers.successResponse({
        res,
        msg: 'succ-permission-delete',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();
