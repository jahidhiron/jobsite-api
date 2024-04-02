// Environment variables imported from .env.* file
module.exports = {
  // app
  ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8003,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  APP_NAME: process.env.APP_NAME,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,

  // password
  PASSWORD_SALT: process.env.PASSWORD_SALT || 12,

  // jwt
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRED_IN:
    parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRED_IN, 10) || 3600,
  JWT_REFRESH_TOKEN_EXPIRED_IN:
    parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN, 10) || 31536000,

  // redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  REDIS_URL: process.env.REDIS_URL,

  // aws
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_API_VERSION: process.env.AWS_API_VERSION,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_BASE_URL: process.env.AWS_S3_BASE_URL,

  // mailgun
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
