const express = require('express');
const controller = require('./controller');
const { validate } = require('../../middlewares');
const validator = require('./validator');

const router = express.Router();

/**
 * @todo
 * bellow all routes  require auth
 */
router.post(
  '/list',
  validator.getRolesValidator,
  validate,
  controller.getRoles,
);

router.get('/:id', validator.paramIdValidator, validate, controller.getRole);

router.post('/', validator.titleValidator, validate, controller.createRole);

router.put(
  '/:id',
  validator.paramIdValidator,
  validator.titleValidator,
  validate,
  controller.updateRole,
);

router.delete(
  '/soft/:id',
  validator.paramIdValidator,
  validate,
  controller.softDeleteRole,
);

router.put(
  '/restore/:id',
  validator.paramIdValidator,
  validate,
  controller.restoreRole,
);

router.delete(
  '/hard/:id',
  validator.paramIdValidator,
  validate,
  controller.hardDeleteRole,
);

router.get(
  '/permission/:id',
  validator.paramIdValidator,
  validator.queryNameValidator,
  validate,
  controller.getPermission,
);

router.post(
  '/permission/:id',
  validator.addPermissionValidator,
  validator.paramIdValidator,
  validate,
  controller.addPermission,
);

router.put(
  '/permission/:id',
  validator.updatePermissionValidator,
  validator.paramIdValidator,
  validate,
  controller.updatePermission,
);

router.delete(
  '/permission/:id',
  validator.deletePermissionValidator,
  validator.paramIdValidator,
  validate,
  controller.deletePermission,
);

module.exports = { base: 'roles', router };
