const { issueJwtForUser } = require("../services/authService");
const {
  createUser,
  toSafeUser,
  loginUser,
} = require("../services/userService");

async function signup(req, res, next) {
  const user = await createUser(req.body);
  const token = issueJwtForUser(user);
  res.status(201).json({ token, data: toSafeUser(user) });
}

async function login(req, res, next) {
  const user = await loginUser(req.body);
  const token = issueJwtForUser(user);
  res.json({ token, data: toSafeUser(req.user) });
}

async function me(req, res, next) {
  res.json({ data: toSafeUser(req.user) });
}

module.exports = { signup, login, me };
