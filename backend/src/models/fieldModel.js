const prisma = require("../utils/prisma");
const fieldInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};
const FieldModel = {
  async findMany(query = {}) {
    const where = {};
    if (query.assignedAgentId) {
      where.assigned_agent_id = query.assignedAgentId;
    }
    return await prisma.field.findMany({
      where,
      include: fieldInclude,
      orderBy: { created_at: "desc" },
    });
  },

  async findById(id) {
    return await prisma.field.findUnique({
      where: { id },
      include: fieldInclude,
    });
  },

  async addField(data) {
    return await prisma.field.create({ data, include: fieldInclude });
  },

  async updateById(id, updates) {
    return await prisma.field.update({
      where: { id },
      data: updates,
      include: fieldInclude,
    });
  },

  async deleteById(id) {
    return await prisma.field.delete({ where: { id } });
  },
};

module.exports = FieldModel;
