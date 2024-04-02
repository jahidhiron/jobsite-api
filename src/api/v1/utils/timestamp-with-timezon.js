module.exports = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const timezoneOffsetHours = String(
    Math.abs(date.getTimezoneOffset() / 60),
  ).padStart(2, '0');
  const timezoneOffsetMinutes = String(
    Math.abs(date.getTimezoneOffset() % 60),
  ).padStart(2, '0');
  const timezoneSign = date.getTimezoneOffset() >= 0 ? '-' : '+';

  const timestampWithTimezone = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  return timestampWithTimezone;
};
