class AppError extends Error {
  constructor({ status = 500, code = "INTERNAL_ERROR", message, suggestion, details } = {}) {
    super(message || "Something went wrong");
    this.name = "AppError";
    this.status = status;
    this.code = code;
    if (suggestion) this.suggestion = suggestion;
    if (details) this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

module.exports = { AppError };

