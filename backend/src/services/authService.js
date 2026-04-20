const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "secret";
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "8h";
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

function issueJwtForUser(user) {
  return jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
}

function verifyJwt(token) {
  return jwt.verify(token, getJwtSecret());
}

const AuthService = {
  getJwtSecret,
  getJwtExpiresIn,
  hashPassword,
  verifyPassword,
  issueJwtForUser,
  verifyJwt,
};

module.exports = AuthService;
