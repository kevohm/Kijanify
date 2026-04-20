const Strategy = require("passport-strategy");

function defaultGetToken(req) {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || typeof authHeader !== "string") return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length);
}

class JwtStrategy extends Strategy {
  constructor(options, verify) {
    super();
    this.name = options?.name || "jwt";
    this._getToken = options?.getToken || defaultGetToken;
    this._verifyToken = options?.verifyToken;
    this._verify = verify;
  }

  async authenticate(req) {
    try {
      const token = this._getToken(req);
      if (!token) {
        return this.fail({ message: "Authorization header missing" }, 401);
      }

      let payload;
      try {
        payload = this._verifyToken(token);
      } catch {
        return this.fail({ message: "Invalid or expired token" }, 401);
      }

      const user = await this._verify(payload, req);
      if (!user) {
        return this.fail({ message: "Invalid or expired token" }, 401);
      }

      return this.success(user);
    } catch (error) {
      return this.error(error);
    }
  }
}

module.exports = JwtStrategy;

