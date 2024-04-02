const { successResponse } = require('../../helpers');
const authService = require('./service');
const errors = require('../../errors');
const utils = require('../../utils');
const config = require('../../../../config/global');
const constants = require('../../constants');
const queue = require('../../tasks/queue');
const { redis } = require('../../services');

class AuthController {
  async signup(req, res, next) {
    try {
      const { email } = req.body;

      const { data: userExist } = await authService.findOneUser({ email });
      if (userExist) {
        errors.badRequestError(req.__('error-email-already-use'));
      }

      const { data: user } = await authService.createUser({
        payload: req.body,
      });

      const template = utils.emailTemplate.signup({
        user,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-signup',
        statusCode: 201,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const limit = req[constants.RATE_LIMIT.KEY_VERIFY_EMAIL];

      const { data: userExist, instance } = await authService.findOneUser({
        email,
      });
      if (!userExist) {
        await authService.authLimiter(req);
        errors.unauthorizedError(req.__('error-invalid-credentials'));
      }

      const matchPassword = await utils.comparePassword(
        userExist.password,
        password,
      );
      if (!matchPassword) {
        await authService.authLimiter(req);
        errors.unauthorizedError(req.__('error-invalid-credentials'));
      }

      if (!userExist.verification.email.status) {
        await authService.resendEmailVerificationCodeLimiter(req);
        const { code } = await authService.generateVerifyEmailCode({
          instance,
          data: userExist,
          ip: req.ip,
          limit,
        });

        const template = utils.emailTemplate.emailVerification({
          user: userExist,
          code,
        });
        queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });
      }

      const { accessToken, refreshToken } = await utils.jwtToken(userExist);
      await redis.set(refreshToken, true, config.JWT_REFRESH_TOKEN_EXPIRED_IN);
      utils.saveCookie({ res, accessToken, refreshToken });
      const { data: user } = await authService.lastLogin({ instance });
      const verified = authService.userVerificationStatus(userExist);

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-signin',
        user: { ...user, verified },
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async currentUser(req, res) {
    successResponse({
      res,
      msg: 'succ-current-user',
      user: req.user,
    });
  }

  async generaterefreshToken(req, res, next) {
    try {
      const { accessToken, refreshToken } = await utils.jwtToken(req.user);
      await redis.del(req.cookies.refreshToken);
      await redis.set(refreshToken, true, config.JWT_REFRESH_TOKEN_EXPIRED_IN);
      utils.saveCookie({ res, accessToken, refreshToken });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-generate-refresh-token',
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async resendEmailVerificationCode(req, res, next) {
    try {
      const { email } = req.body;
      const limit = req[constants.RATE_LIMIT.KEY_VERIFY_EMAIL];

      const { data: userExist, instance } = await authService.findOneUser({
        email,
      });
      if (!userExist) {
        errors.badRequestError(req.__('error-user-not-found'));
      }

      if (userExist.verification.email.status) {
        errors.badRequestError(req.__('error-email-verified'));
      }

      await authService.resendEmailVerificationCodeLimiter(req);
      const { code } = await authService.generateVerifyEmailCode({
        instance,
        data: userExist,
        ip: req.ip,
        limit,
      });

      const template = utils.emailTemplate.emailVerification({
        user: userExist,
        code,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-resend-email-verification-code',
      });
    } catch (error) {
      next(error);
    }
  }

  async emailVerification(req, res, next) {
    try {
      const { email, code } = req.body;

      const { data: userExist, instance } = await authService.findOneUser({
        email,
      });
      if (!userExist) {
        errors.badRequestError(req.__('error-user-not-found'));
      }

      if (userExist.verification.email.status) {
        errors.badRequestError(req.__('error-email-verified'));
      }

      const { key } = await authService.verifyEmail({
        instance,
        data: userExist,
        code,
      });
      if (key) {
        errors.badRequestError(req.__(key));
      }

      const template = utils.emailTemplate.emailVerificationConfirmation({
        user: userExist,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-verify-email',
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const limit = req[constants.RATE_LIMIT.KEY_FORGOT_PASSWORD_EMAIL];

      const { data: userExist, instance } = await authService.findOneUser({
        email,
      });
      if (!userExist) {
        errors.badRequestError(req.__('error-user-not-found'));
      }

      await authService.forgotPasswordEmailLimiter(req);
      const { code } = await authService.forgotPassword({
        instance,
        data: userExist,
        ip: req.ip,
        limit,
      });

      const template = utils.emailTemplate.forgotPassword({
        user: userExist,
        code,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-send-forgot-password-code',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, code, password } = req.body;

      const { data: userExist, instance } = await authService.findOneUser({
        email,
      });
      if (!userExist) {
        errors.badRequestError(req.__('error-user-not-found'));
      }

      const { key } = await authService.verifyPasswordResetCode({
        instance,
        data: userExist,
        code,
      });
      if (key) {
        errors.badRequestError(req.__(key));
      }

      await authService.resetPassword({ instance, password });

      const template = utils.emailTemplate.resetPassword({
        user: userExist,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-password-reset',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      const { data: userExist, instance } = await authService.findOneUser({
        email: req.user.email,
      });
      if (!userExist) {
        errors.badRequestError(req.__('error-user-not-found'));
      }

      const oldMatchPassword = await utils.comparePassword(
        userExist.password,
        oldPassword,
      );
      if (!oldMatchPassword) {
        errors.badRequestError(req.__('error-old-password-not-match'));
      }

      await authService.changePassword({
        instance,
        password: newPassword,
      });

      const template = utils.emailTemplate.changePassword({
        user: userExist,
      });
      queue.sendEmail(constants.TASK.JOB.SEND_EMAIL, { template });

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-change-password',
      });
    } catch (error) {
      next(error);
    }
  }

  async signout(req, res, next) {
    try {
      await redis.del(req.cookies.refreshToken);
      await redis.set(
        req.cookies.accessToken,
        'true',
        parseInt(config.JWT_ACCESS_TOKEN_EXPIRED_IN, 10),
      );

      utils.clearCookie({ res });
      res.clearCookie('undefined');

      /**
       * @todo
       * activity log
       */

      successResponse({
        res,
        msg: 'succ-signout',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
