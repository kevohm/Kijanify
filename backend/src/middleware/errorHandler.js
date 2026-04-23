const { ZodError } = require("zod");
const { AppError } = require("../utils/appError");

function formatZodErrors(issues) {
  const errors = {};

  issues.forEach((issue) => {
    const field = issue.path.join(".") || "form";

    if (!errors[field]) {
      errors[field] = [];
    }

    errors[field].push(issue.message);
  });

  return errors;
}

function statusToCode(status) {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return status >= 500 ? "INTERNAL_ERROR" : "ERROR";
  }
}

function getTraceId(req, res) {
  const fromReq = req?.traceId;
  if (typeof fromReq === "string" && fromReq.trim()) return fromReq.trim();

  const fromHeader = res?.getHeader?.("x-trace-id");
  if (typeof fromHeader === "string" && fromHeader.trim()) return fromHeader.trim();

  return undefined;
}

function errorHandler(err, req, res, next) {
  const traceId = getTraceId(req, res);
  console.error(traceId ? `[traceId=${traceId}]` : "", err);

  if (err instanceof ZodError) {
    const formattedErrors = formatZodErrors(err.issues);

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Please check your input and try again.",
      traceId,
      errors: formattedErrors,
    });
  }

  const status =
    err?.status || err?.statusCode || (err?.name === "UnauthorizedError" ? 401 : 500);

  const isAppError = err instanceof AppError;
  const isLikelyPrismaCode = typeof err?.code === "string" && /^P\\d{4}$/.test(err.code);
  const code =
    (isAppError && err.code) ||
    (typeof err?.code === "string" && !isLikelyPrismaCode ? err.code : undefined) ||
    statusToCode(status);

  const suggestion =
    typeof err?.suggestion === "string" && err.suggestion.trim()
      ? err.suggestion.trim()
      : undefined;

  const isProd = process.env.NODE_ENV === "production";
  const message =
    status >= 500 && !isAppError && isProd
      ? "Something went wrong"
      : err?.message || "Something went wrong";

  const payload = { code, message, traceId };
  if (suggestion) payload.suggestion = suggestion;

  if (!isProd && err) {
    payload.details = {
      name: err.name,
      prismaCode: isLikelyPrismaCode ? err.code : undefined,
      stack: err.stack,
    };
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;
