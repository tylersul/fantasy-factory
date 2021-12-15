// From Express docs: default status code on res.statusCode is set from err.status (or err.statusCode)
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;

// Every error in JS automatically has stack (long detailed error info), but wouldn't want to present this to user in production