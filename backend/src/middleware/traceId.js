const crypto = require("crypto");

function generateTraceId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function traceId(req, res, next) {
  const incoming =
    req.get("x-trace-id") || req.get("x-request-id") || req.get("x-correlation-id");

  const id =
    typeof incoming === "string" && incoming.trim() ? incoming.trim() : generateTraceId();

  req.traceId = id;
  res.setHeader("x-trace-id", id);

  next();
}

module.exports = traceId;

