const { required, checkEmail, checkPassword } = require('../../helpers');
const { newError } = require('../../errors');
const commonService = require('../../services/common-service');
const errors = require('../../errors');

exports.signupValidator = [
  required('firstName', 'First name'),
  required('lastName', 'Last name'),
  required('role').custom(async (role, metadata) => {
    try {
      if (role) {
        const { roleArr } = await commonService.getRoles();

        if (roleArr.length === 0) {
          newError('val-role-not-exist');
        }

        if (!roleArr.includes(role)) {
          const roles = roleArr.join(', ');
          newError(
            `${metadata.req.__('val-role-not-exist-available-role', { roles })}`,
          );
        }
      }
    } catch (error) {
      return errors.internalServerError(error.message);
    }
  }),
  checkEmail(),
  checkPassword(),
];

exports.signinValidator = [checkEmail(), required('password')];

exports.emailValidator = [checkEmail()];

exports.codeValidator = [required('code')];

exports.passwordValidator = [checkPassword()];

exports.changePasswordValidator = [
  required('oldPassword', 'Old password'),

  checkPassword('newPassword', 'New password').custom(
    async (newPassword, metadata) => {
      const { oldPassword } = metadata.req.body;

      if (oldPassword === newPassword) {
        newError('val-old-and-new-password-not-same');
      }
    },
  ),
];
