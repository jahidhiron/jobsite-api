const config = require('../../../config/global');

exports.signup = ({ user }) => ({
  to: user.email,
  subject: `Welcome to ${config.APP_NAME}`,
  html: `<p>Dear ${user.name},</p><p>Congratulations and welcome to ${config.APP_NAME}! 🎉</p><p>We&#x27;re 
        thrilled to have you join us and become part of our community. With ${config.APP_NAME}, 
        you&#x27;re now on your way to unlocking a world of opportunities and possibilities.</p>
        <p>Your account has been successfully created, and you&#x27;re all set to get started. 
        Feel free to log in using your credentials and explore everything ${config.APP_NAME} has to offer.</p>
        <p>If you have any questions or need assistance along the way, don&#x27;t hesitate to reach out to us. 
        Our team is here to help and ensure you have a smooth and enjoyable experience.</p>
        <p>Once again, welcome aboard! We&#x27;re excited to have you with us.</p>
        <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});

exports.emailVerification = ({ user, code }) => ({
  to: user.email,
  subject: `Email Verification Code for ${config.APP_NAME}`,
  html: `<p>Dear ${user.name},</p><p>Thank you for signing up with 
            ${config.APP_NAME}. To complete the registration process 
            and verify your email address, please use the following six-digit 
            verification code:</p><h3>Verification Code: ${code}</h3>
            <p>Please enter this code on the verification page to confirm your 
            email address. This ensures that we have accurate contact information 
            for you and helps to secure your account.</p><p>If you didn&#x27;t 
            attempt to sign up with ${config.APP_NAME}, 
            please disregard this email. Your security is important to us, 
            and we apologize for any inconvenience.</p><p>If you need any assistance 
            or have questions, feel free to reach out to our support team 
            at ${config.SUPPORT_EMAIL}.</p><p>Thank you for choosing ${config.APP_NAME}. 
            We look forward to having you as a valued member of our community.</p>
            <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});

exports.emailVerificationConfirmation = ({ user }) => ({
  to: user.email,
  subject: `Email Verification Confirmation - Welcome to ${config.APP_NAME}!`,
  html: `<p>Dear ${user.name},</p><p>We are delighted to welcome you 
            to ${config.APP_NAME}! Your email address has been successfully 
            verified, confirming your registration with us.</p><p>Your verification ensures 
            that we can communicate with you effectively and securely, providing you 
            with access to all the features and benefits our platform offers.</p>
            <p>Thank you for taking this important step to confirm your email address. 
            We&#x27;re excited to have you as part of our community!</p><p>If you have 
            any questions or require assistance, please feel free to contact our support 
            team at ${config.SUPPORT_EMAIL}.</p>
            <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});

exports.forgotPassword = ({ user, code }) => ({
  to: user.email,
  subject: `Password Reset Code for Your ${config.APP_NAME} Account`,
  html: `<p>Dear ${user.name},</p><p>It appears you&#x27;ve requested a password reset 
            for your ${config.APP_NAME} account. To proceed, please use the following 
            six-digit code:</p><h3>Reset Code: ${code}</h3><p>Please enter this code on the 
            password reset page to verify your identity and create a new password. 
            This code is valid for a limited time only, so please use it promptly.</p>
            <p>If you did not request this password reset, please disregard this email. 
            Your account security remains our utmost priority.</p>
            <p>If you require any assistance or have further questions, 
            please feel free to reach out to our support team at ${config.SUPPORT_EMAIL}.</p>
            <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});

exports.resetPassword = ({ user }) => ({
  to: user.email,
  subject: `Password Reset Confirmation`,
  html: `<p>Dear ${user.name},</p><p>This is to confirm that the password for your 
        account at ${config.APP_NAME} has been successfully reset.</p>
        <p>If you initiated this password reset, you can now log in to your 
        account using your new password.</p><p>If you did not request this password reset, 
        or if you have any concerns about the security of your account, please contact 
        our support team immediately at ${config.SUPPORT_EMAIL}.</p><p>Thank you for 
        choosing ${config.APP_NAME}.</p>
        <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});

exports.changePassword = ({ user }) => ({
  to: user.email,
  subject: `Your Password Has Been Successfully Changed - ${config.APP_NAME}`,
  html: `<p>Dear ${user.name},</p><p>This email is to confirm that the password 
        for your ${config.APP_NAME} account has been successfully changed.</p>
        <p>If you did not initiate this change, please contact our support team 
        immediately at ${config.SUPPORT_EMAIL}.</p><p>Thank you for choosing ${config.APP_NAME}.</p>
        <p>Best regards, </p> <p>${config.APP_NAME} Team</p>`,
});
