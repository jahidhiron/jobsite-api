module.exports = (index) => {
  if (!index && index !== 0) return '';

  let prefix = '';
  const i = index + 1;

  if (i === 1) prefix = '1st';
  else if (i === 2) prefix = '2nd';
  else if (i === 3) prefix = '3rd';
  else prefix = `${i + 1}th`;

  return prefix;
};
