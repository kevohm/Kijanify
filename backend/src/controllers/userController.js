const UserModel = require("../models/userModel");
const { getAllUsers } = require("../models/userModel");

async function listUsers(req, res, next) {

  const users = await UserModel.findMany(req.query);
  res.json(users);
}

module.exports = { listUsers };
