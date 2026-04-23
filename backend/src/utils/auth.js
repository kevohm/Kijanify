const { baseCookieOptions } = require("./cookies");
const AuthService = require("../services/authService");

const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME || "_at";
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || "_rt";
const REFRESH_TOKEN_COOKIE_PATH = process.env.REFRESH_TOKEN_COOKIE_PATH || "/v1/api/auth/refresh";

function getAccessCookieOptions() {
  return {
    ...baseCookieOptions,
    maxAge: AuthService.expiresInToMs(AuthService.getAccessJwtExpiresIn()),
  };
}

function getRefreshCookieOptions() {
  return {
    ...baseCookieOptions,
    path: REFRESH_TOKEN_COOKIE_PATH,
    maxAge: AuthService.expiresInToMs(AuthService.getRefreshJwtExpiresIn()),
  };
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getAccessCookieOptions());
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
}

function getAuthCookies(req) {
  const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  return {
    accessToken: typeof accessToken === "string" ? accessToken : null,
    refreshToken: typeof refreshToken === "string" ? refreshToken : null,
  };
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { ...baseCookieOptions });
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...baseCookieOptions,
    path: REFRESH_TOKEN_COOKIE_PATH,
  });
}

function updateRefreshToken(res, newRefreshToken) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());
}

module.exports = {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_PATH,
  setAuthCookies,
  getAuthCookies,
  clearAuthCookies,
  updateRefreshToken,
};
