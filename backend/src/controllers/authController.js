const {
  issueAccessTokenForUser,
  issueRefreshTokenForUser,
  verifyRefreshToken,
} = require("../services/authService");
const {
  createUser,
  toSafeUser,
  getUserById,
} = require("../services/userService");
const { AppError } = require("../utils/appError");
const { clearAuthCookies, getAuthCookies, setAuthCookies } = require("../utils/auth");

async function signup(req, res, next) {
  const user = await createUser(req.body);
  const accessToken = issueAccessTokenForUser(user);
  const refreshToken = issueRefreshTokenForUser(user);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ data: toSafeUser(user) });
}

async function login(req, res, next) {
  const user = req.user;
  const accessToken = issueAccessTokenForUser(user);
  const refreshToken = issueRefreshTokenForUser(user);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ data: toSafeUser(user) });
}

async function me(req, res, next) {
  res.json({ data: toSafeUser(req.user) });
}

async function refresh(req, res, next) {
  const { refreshToken } = getAuthCookies(req);
  if (!refreshToken) {
    return next(
      new AppError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Refresh token missing",
        suggestion: "Log in again to continue",
      }),
    );
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return next(
      new AppError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
        suggestion: "Log in again to continue",
      }),
    );
  }

  const userId = payload?.id;
  if (!userId) {
    return next(
      new AppError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
        suggestion: "Log in again to continue",
      }),
    );
  }

  const user = await getUserById(userId);
  if (!user) {
    return next(
      new AppError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "User not found",
        suggestion: "Log in again to continue",
      }),
    );
  }

  const newAccessToken = issueAccessTokenForUser(user);
  const newRefreshToken = issueRefreshTokenForUser(user);
  setAuthCookies(res, newAccessToken, newRefreshToken);

  res.json({ data: toSafeUser(user) });
}

async function logout(req, res, next) {
  clearAuthCookies(res);
  res.status(204).send();
}

module.exports = { signup, login, me, refresh, logout };
