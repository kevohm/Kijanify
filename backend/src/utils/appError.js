class AppError extends Error {
  constructor(arg = {}, legacyStatus) {
    if (typeof arg === "string") {
      const message = arg;
      const status = Number.isFinite(legacyStatus) ? legacyStatus : 500;
      super(message || "Something went wrong");
      this.name = "AppError";
      this.status = status;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AppError);
      }

      return;
    }

    const { status = 500, code, message, suggestion, details } = arg || {};

    super(message || "Something went wrong");
    this.name = "AppError";
    this.status = status;
    if (code) this.code = code;
    if (suggestion) this.suggestion = suggestion;
    if (details) this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

module.exports = { AppError };
