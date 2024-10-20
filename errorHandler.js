class ErrorHandler extends Error {
  // error is parent
  // create constructor
  constructor(message, statusCode) {
    super(message); // constructor of parent class
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // capture stack trace
  }
}
module.exports = ErrorHandler;
