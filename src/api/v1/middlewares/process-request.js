const { generateCode } = require('../utils');

module.exports = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  let correlationId = req.headers['x-correlation-id'];
  if (!correlationId) {
    correlationId = `${Date.now().toString()}_${generateCode(8)}`;
  }

  req.headers['x-correlation-id'] = correlationId;
  req.ip = ip;
  res.set('x-correlation-id', correlationId);

  return next();
};
