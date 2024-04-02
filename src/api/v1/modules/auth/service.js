const { PostgresDbOperation } = require('../../services');
const roleService = require('../role/service');
const utils = require('../../utils');
const constant = require('../../constants');
const rateLimiterPostgres = require('../../utils/rate-limiter-postgres');

const exclude = [
  ...constant.EXCLUDE,
  'roleId',
  'password',
  'firstName',
  'lastName',
  'lastLogin',
  'verification',
  'resetPassword',
];

const verifyCode = (codes, code) => {
  const currentTime = new Date().getTime();

  const { length } = codes;
  const lastCode = codes[length - 1];

  if (
    lastCode.code === code &&
    currentTime < new Date(lastCode.expiredAt).getTime()
  ) {
    return { key: '', index: length - 1 };
  }

  let index = -1;
  let key = 'error-invalid-code';
  for (const [i, value] of codes.entries()) {
    const expiredAt = new Date(value.expiredAt).getTime();
    if (value.code === code) {
      if (value.used) {
        key = 'error-code-used';
      } else if (currentTime > expiredAt) {
        key = 'error-time-expired';
      } else if (currentTime < expiredAt) {
        index = i;
        key = '';
      }

      if (key) break;
      if (index) break;
    }
  }

  return { key, index };
};

const createSingleCode = (codes, ip) => {
  const code = utils.generateCode(6);
  const createdAt = new Date();
  const expiredAt = new Date(
    createdAt.getTime() + constant.EXPIRATION.EMAIL_VERIFICATION_WITHIN_MS,
  );

  codes.push({
    code,
    createdAt: utils.timestampWithTimezone(),
    expiredAt: utils.timestampWithTimezone(expiredAt),
    ip,
    used: false,
  });

  return { codes, code };
};

class AuthService extends PostgresDbOperation {
  async findOneUser(queryKeys, options) {
    const user = await this.findOne(this.User, queryKeys, {
      ...options,
    });
    return user;
  }

  async authLimiter(req) {
    const { promises } = rateLimiterPostgres.consumeLimitter(req, [
      constant.RATE_LIMIT.KEY_LOGIN_IP,
      constant.RATE_LIMIT.KEY_LOGIN_EMAIL,
      constant.RATE_LIMIT.KEY_LOGIN_EMAIL_IP,
    ]);
    await Promise.all(promises);
  }

  async createUser({ payload }) {
    const userInput = payload;
    const { role } = userInput;

    const { data: roleData } = await roleService.findOneRole({ title: role });
    if (roleData) {
      userInput.roleId = roleData.id;
    }

    userInput.verification = { email: { status: false, codes: [] } };
    userInput.resetPassword = { email: { codes: [] } };

    const newUser = await this.create(this.User, userInput, {
      exclude,
    });

    return newUser;
  }

  async lastLogin({ instance }) {
    const updatedUser = await this.save(
      instance,
      { lastLogin: utils.timestampWithTimezone() },
      { exclude },
    );
    return updatedUser;
  }

  userVerificationStatus(data) {
    return data.verification.email.status || false;
  }

  async resendEmailVerificationCodeLimiter(req) {
    const { promises } = rateLimiterPostgres.consumeLimitter(req, [
      constant.RATE_LIMIT.KEY_VERIFY_EMAIL,
    ]);
    await Promise.all(promises);
  }

  async generateVerifyEmailCode({ instance, data, ip, limit = 10 }) {
    const verificationType = data.verification.email;
    const { codes } = verificationType || [];

    const { codes: modifiedCodes, code } = createSingleCode(codes, ip);

    if (modifiedCodes.length > limit) {
      modifiedCodes.shift();
    }

    const verification = {
      email: {
        ...verificationType,
        codes: modifiedCodes,
      },
    };

    await this.save(
      instance,
      { verification },
      { exclude: ['password', 'verification', 'resetPassword'] },
    );

    return { code };
  }

  async verifyEmail({ instance, data, code }) {
    const verificationType = data.verification.email;
    const { codes } = verificationType || [];

    const { key, index } = verifyCode(codes, code);
    if (key) {
      return { key };
    }

    // eslint-disable-next-line security/detect-object-injection
    const matchCode = codes[index];
    matchCode.verifiedAt = utils.timestampWithTimezone();
    matchCode.used = true;
    // eslint-disable-next-line security/detect-object-injection
    codes[index] = matchCode;
    const verification = {
      email: {
        ...verificationType,
        status: true,
        codes,
        verifiedAt: utils.timestampWithTimezone(),
      },
    };

    await this.save(instance, { verification });
    return { key: '' };
  }

  async forgotPassword({ instance, data, ip, limit = 10 }) {
    const resetPasswordType = data.resetPassword.email;
    const { codes } = resetPasswordType || [];
    const { codes: modifiedCodes, code } = createSingleCode(codes, ip);

    if (modifiedCodes.length > limit) {
      modifiedCodes.shift();
    }

    const resetPassword = {
      email: {
        ...resetPasswordType,
        codes: modifiedCodes,
      },
    };

    await this.save(instance, { resetPassword });

    return { code };
  }

  async forgotPasswordEmailLimiter(req) {
    const { promises } = rateLimiterPostgres.consumeLimitter(req, [
      constant.RATE_LIMIT.KEY_FORGOT_PASSWORD_EMAIL,
    ]);
    await Promise.all(promises);
  }

  async verifyPasswordResetCode({ instance, data, code }) {
    const resetPasswordType = data.resetPassword.email;
    const { codes } = resetPasswordType || [];

    const { key, index } = verifyCode(codes, code);
    if (key) {
      return { key };
    }

    // eslint-disable-next-line security/detect-object-injection
    const matchCode = codes[index];
    matchCode.verifiedAt = utils.timestampWithTimezone();
    matchCode.used = true;
    // eslint-disable-next-line security/detect-object-injection
    codes[index] = matchCode;
    const resetPassword = {
      email: {
        ...resetPasswordType,
        codes,
      },
    };

    await this.save(instance, { resetPassword });
    return { key: '' };
  }

  async resetPassword({ instance, password }) {
    const updatedUser = await this.save(instance, { password }, { exclude });
    return updatedUser;
  }

  async changePassword({ instance, password }) {
    await this.save(instance, { password });
  }
}

module.exports = new AuthService();
