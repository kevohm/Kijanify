const { authenticate: passportAuthenticate } = require("./passportAuth");
const { AppError } = require("../utils/appError");

const authenticate = passportAuthenticate("jwt");

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError({
          status: 401,
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          suggestion: "Log in required to access this resource",
        }),
      );
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new AppError({ status: 403, code: "FORBIDDEN", message: "Forbidden" }));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
