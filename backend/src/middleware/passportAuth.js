const passport = require("passport");
const { AppError } = require("../utils/appError");

function authenticate(strategy, options = {}) {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false, ...options },
      (error, user, info, status) => {
        if (error) return next(error);
        if (!user) {
          const httpStatus = status || 401;
          const message = info?.message || "Unauthorized";
          const suggestion =
            httpStatus === 401
              ? "Log in required to access this resource"
              : undefined;
          return next(
            new AppError({
              status: httpStatus,
              code: httpStatus === 401 ? "UNAUTHORIZED" : "BAD_REQUEST",
              message,
              suggestion,
            }),
          );
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  };
}

module.exports = { authenticate };
