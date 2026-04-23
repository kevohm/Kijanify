const UserModel = require("../models/userModel");
const { AppError } = require("../utils/appError");

async function listUsers(req, res, next) {

  const users = await UserModel.findMany(req.query);
  res.json(users);
}

async function getUser(req, res, next) {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(user);
}

module.exports = { listUsers, getUser };
