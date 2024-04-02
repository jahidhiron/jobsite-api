const router = require('express').Router();
const controller = require('./controller');
const validator = require('./validator');
const middlewares = require('../../middlewares');
const { RATE_LIMIT } = require('../../constants');

router.post(
  '/signup',
  validator.signupValidator,
  middlewares.validate,
  controller.signup,
);

router.post(
  '/signin',
  validator.signinValidator,
  middlewares.validate,
  middlewares.rateLimit([
    RATE_LIMIT.KEY_LOGIN_IP,
    RATE_LIMIT.KEY_LOGIN_EMAIL,
    RATE_LIMIT.KEY_LOGIN_EMAIL_IP,
    RATE_LIMIT.KEY_VERIFY_EMAIL,
  ]),
  controller.signin,
);

router.get('/current-user', middlewares.isAuth, controller.currentUser);

router.post(
  '/refresh-token',
  middlewares.verifyRefreshToken,
  controller.generaterefreshToken,
);

router.post(
  '/resend-email-verification-code',
  validator.emailValidator,
  middlewares.validate,
  middlewares.rateLimit([RATE_LIMIT.KEY_VERIFY_EMAIL]),
  controller.resendEmailVerificationCode,
);

router.post(
  '/email-verification',
  validator.emailValidator,
  validator.codeValidator,
  middlewares.validate,
  controller.emailVerification,
);

router.post(
  '/forgot-password',
  validator.emailValidator,
  middlewares.validate,
  middlewares.rateLimit([RATE_LIMIT.KEY_FORGOT_PASSWORD_EMAIL]),
  controller.forgotPassword,
);

router.post(
  '/reset-password',
  validator.emailValidator,
  validator.codeValidator,
  validator.passwordValidator,
  middlewares.validate,
  controller.resetPassword,
);

router.put(
  '/change-password',
  middlewares.isAuth,
  validator.changePasswordValidator,
  middlewares.validate,
  controller.changePassword,
);

router.get('/signout', middlewares.verifyRefreshToken, controller.signout);

module.exports = router;
