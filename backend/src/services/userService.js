const UserModel = require("../models/userModel");
const { AppError } = require("../utils/appError");
const { signupSchema, loginSchema } = require("../utils/validation");
const { hashPassword, verifyPassword } = require("./authService");

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

const UserService = {
  normalizeEmail,

  toSafeUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  },

  async getUserByEmail(email) {
    return UserModel.findByEmail(email);
  },
  async getUserByIdAndThrow(id) {
    if (!id) {
      throw new AppError("User not found", 404);
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },

  async getUserById(id) {
    return UserModel.findById(id);
  },

  async createUser(body) {
    const data = await signupSchema.parseAsync(body);
    const email = normalizeEmail(data.email);
    const passwordHash = await hashPassword(data.password);
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      const error = new Error("Invalid credentials");
      error.status = 409;
      throw error;
    }

    return UserModel.addUser({
      ...data,
      email,
      password: passwordHash,
    });
  },

  async loginUser(body) {
    const data = await loginSchema.parseAsync(body);
    const email = normalizeEmail(data.email);
    const existingUser = await UserModel.findByEmail(email);

    if (!existingUser) {
      const error = new Error("Invalid credentials");
      error.status = 409;
      throw error;
    }

    const passwordValid = await verifyPassword(
      data.password,
      existingUser.password,
    );

    if (!passwordValid) {
      const error = new Error("Invalid credentials");
      error.status = 409;
      throw error;
    }

    return existingUser;
  },
};

module.exports = UserService;
