const isProduction = process.env.NODE_ENV === "production";

function normalizeSameSite(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "lax" || raw === "strict" || raw === "none") return raw;
  return null;
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return null;
}

const sameSite =
  normalizeSameSite(process.env.COOKIE_SAMESITE) ?? (isProduction ? "none" : "lax");

const secure =
  normalizeBoolean(process.env.COOKIE_SECURE) ?? (isProduction || sameSite === "none");

const baseCookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
};

function parseCookieHeader(headerValue) {
  const header = typeof headerValue === "string" ? headerValue : "";
  if (!header.trim()) return {};

  const cookies = {};

  header.split(";").forEach((pair) => {
    const trimmed = String(pair || "").trim();
    if (!trimmed) return;

    const index = trimmed.indexOf("=");
    if (index <= 0) return;

    const name = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }
  });

  return cookies;
}

function cookieParser(req, res, next) {
  req.cookies = parseCookieHeader(req?.headers?.cookie);
  next();
}

module.exports = { baseCookieOptions, parseCookieHeader, cookieParser };
