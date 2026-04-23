const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "secret";
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "8h";
}

function getRefreshJwtSecret() {
  return process.env.REFRESH_JWT_SECRET || getJwtSecret();
}

function getRefreshJwtExpiresIn() {
  return process.env.REFRESH_JWT_EXPIRES_IN || "2d";
}

function expiresInToMs(expiresIn) {
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn)) {
    return Math.max(0, Math.round(expiresIn * 1000));
  }

  const raw = String(expiresIn || "").trim();
  if (!raw) return 0;

  const asNumber = Number(raw);
  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
    return Math.max(0, Math.round(asNumber * 1000));
  }

  const match = raw.match(/^(\d+(?:\.\d+)?)\s*([smhd])$/i);
  if (!match) return 0;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
  if (!unitMs) return 0;

  return Math.max(0, Math.round(value * unitMs));
}

async function hashPassword(password) {
  if (!password) {
    const error = new Error("Password is required");
    error.status = 400;
    throw error;
  }
  return argon2.hash(password, { type: argon2.argon2id });
}

async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) return false;
  return argon2.verify(passwordHash, password);
}

function issueAccessTokenForUser(user) {
  return jwt.sign({ id: user.id, role: user.role, token_type: "access" }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
}

function issueRefreshTokenForUser(user) {
  return jwt.sign(
    { id: user.id, role: user.role, token_type: "refresh" },
    getRefreshJwtSecret(),
    {
      expiresIn: getRefreshJwtExpiresIn(),
    },
  );
}

function verifyAccessToken(token) {
  const payload = jwt.verify(token, getJwtSecret());
  if (!payload || typeof payload !== "object") {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    throw error;
  }

  if ("token_type" in payload && payload.token_type !== "access") {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    throw error;
  }

  return payload;
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, getRefreshJwtSecret());
  if (!payload || typeof payload !== "object" || payload.token_type !== "refresh") {
    const error = new Error("Invalid refresh token");
    error.status = 401;
    throw error;
  }
  return payload;
}

function issueJwtForUser(user) {
  return issueAccessTokenForUser(user);
}

function verifyJwt(token) {
  return verifyAccessToken(token);
}

const AuthService = {
  getJwtSecret,
  getJwtExpiresIn,
  getAccessJwtExpiresIn: getJwtExpiresIn,
  getRefreshJwtSecret,
  getRefreshJwtExpiresIn,
  expiresInToMs,
  hashPassword,
  verifyPassword,
  issueAccessTokenForUser,
  issueRefreshTokenForUser,
  issueJwtForUser,
  verifyAccessToken,
  verifyRefreshToken,
  verifyJwt,
};

module.exports = AuthService;
