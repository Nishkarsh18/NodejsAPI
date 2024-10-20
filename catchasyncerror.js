// code to handle global async error

module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
