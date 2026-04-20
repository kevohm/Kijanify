const Strategy = require("passport-strategy");

class UsernamePasswordStrategy extends Strategy {
  constructor(options, verify) {
    super();
    this.name = options?.name || "local";
    this._usernameField = options?.usernameField || "username";
    this._passwordField = options?.passwordField || "password";
    this._verify = verify;
  }

  async authenticate(req) {
    try {
      const username =
        req?.body?.[this._usernameField] ??
        (this._usernameField === "email" ? req?.body?.username : undefined);
      const password = req?.body?.[this._passwordField];

      if (!username || !password) {
        return this.fail({ message: "Missing credentials" }, 400);
      }

      const user = await this._verify(String(username), String(password), req);

      if (!user) {
        return this.fail({ message: "Invalid credentials" }, 401);
      }

      return this.success(user);
    } catch (error) {
      return this.error(error);
    }
  }
}

module.exports = UsernamePasswordStrategy;

