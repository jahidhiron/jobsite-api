const { required, body, param, query } = require('../../helpers');
const { newError } = require('../../errors');
const { getModules } = require('../../utils');
const utils = require('../../utils');

const validatePermissionName = (name, req) => {
  if (!name) return;

  const allModules = getModules();
  const modules = allModules.map((item) => item.base);
  const index = modules.findIndex((_module) => _module === name);

  if (index === -1) {
    newError(
      req.__('val-module-not-exist-available-module', {
        modules: modules.join(', '),
      }),
    );
  }
};

const validatePermission = (permission, req) => {
  if (
    typeof permission === 'object' &&
    !Array.isArray(permission) &&
    permission !== null
  ) {
    if (permission.read && typeof permission.read !== 'boolean') {
      newError(req.__('val-permission-value-type', { permission: 'Read' }));
    } else if (permission.write && typeof permission.write !== 'boolean') {
      newError(req.__('val-permission-value-type', { permission: 'Write' }));
    } else if (permission.update && typeof permission.update !== 'boolean') {
      newError(req.__('val-permission-value-type', { permission: 'Update' }));
    } else if (permission.delete && typeof permission.delete !== 'boolean') {
      newError(req.__('val-permission-value-type', { permission: 'Delete' }));
    }
  } else if (typeof permission === 'string') {
    newError('val-permission-is-object');
  }
};

exports.getRolesValidator = [
  body('page').custom(async (page, metadata) => {
    if (page && isNaN(page)) {
      newError(metadata.req.__('val-numeric-value', { field: 'Page' }));
    }
  }),

  body('size').custom(async (size, metadata) => {
    if (size && isNaN(size)) {
      newError(metadata.req.__('val-numeric-value', { field: 'Size' }));
    }
  }),

  body('sort').custom(async (sort, metadata) => {
    if (sort) {
      if (typeof sort === 'string' || !Array.isArray(sort)) {
        newError('val-sort-array-of-object');
      } else if (Array.isArray(sort)) {
        const { req } = metadata;
        const suppliedWhom = [];

        sort.forEach((element, index) => {
          if (!element.whom) {
            newError(
              req.__('val-key-required', {
                indexPrefix: utils.indexPrefix(index),
                key: 'whom',
              }),
            );
          }

          if (suppliedWhom.includes(element.whom)) {
            newError(
              req.__('val-value-already-supplied', {
                indexPrefix: utils.indexPrefix(index),
                key: 'whom',
              }),
            );
          }

          if (!element.order) {
            newError(
              req.__('val-key-required', {
                indexPrefix: utils.indexPrefix(index),
                key: 'order',
              }),
            );
          } else if (
            element.order.toLowerCase() !== 'asc' &&
            element.order.toLowerCase() !== 'desc'
          ) {
            newError(
              req.__('val-key-order-value-asc-or-desc', {
                indexPrefix: utils.indexPrefix(index),
              }),
            );
          }

          suppliedWhom.push(element.whom);
        });
      }
    }
  }),
];

exports.titleValidator = [required('title')];

exports.paramIdValidator = [
  param('id').custom(async (id) => {
    if (id && isNaN(id)) {
      newError('Role id is a numeric value');
    }
  }),
];

exports.addPermissionValidator = [
  required('name', 'Module name').custom(async (name, metadata) => {
    validatePermissionName(name, metadata.req);
  }),

  body('permission').custom(async (permission, metadata) => {
    validatePermission(permission, metadata.req);
  }),
];

exports.updatePermissionValidator = [
  required('name', 'Module name'),

  body('updatedName').custom(async (updatedName, metadata) => {
    validatePermissionName(updatedName, metadata.req);
  }),

  body('permission').custom(async (permission, metadata) => {
    validatePermission(permission, metadata.req);
  }),
];

exports.deletePermissionValidator = [required('name', 'Module name')];

exports.queryNameValidator = [required('name', 'Module name', query)];
