const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'jp'],
  directory: __dirname,
  defaultLocale: 'en',
});

module.exports = i18n;
