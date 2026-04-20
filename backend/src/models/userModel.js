const prisma = require("../utils/prisma");

function serializer(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    // passwordHash: user.password,
    role: user.role,
    name: user.name,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

const UserModel = {
  serializer,
  
  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user
  },

  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return serializer(user);
  },

  async addUser(data) {
    const user = await prisma.user.create({ data });
    return serializer(user);
  },

  async findMany(query) {
    const where = {};
    if (query.role) {
      where.role = query.role;
    }
    return await prisma.user.findMany({
      where,
      select: { id: true, email: true, role: true, name: true },
      orderBy: { created_at: "desc" },
    });
  },
};

module.exports = UserModel;
