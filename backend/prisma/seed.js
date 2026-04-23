const argon2 = require("argon2");
const { PrismaClient, user_role, plant_status } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertUser({ email, role, name, plainPassword }) {
  const passwordHash = await argon2.hash(plainPassword, {
    type: argon2.argon2id,
  });

  return prisma.user.upsert({
    where: { email },
    update: { role, name, password: passwordHash },
    create: { email, role, name, password: passwordHash },
  });
}

async function main() {
  
  const admin = await upsertUser({
    email: "kevinkbet+admin@gmail.com",
    role: user_role.ADMIN,
    name: "Admin Coordinator",
    plainPassword: "#Password123",
  });

  const agent = await upsertUser({
    email: "kevinkbet+agent@gmail.com",
    role: user_role.AGENT,
    name: "Field Agent",
    plainPassword: "#Password123",
  });

  await prisma.field.createMany({
    data: [
      {
        name: "North Farm",
        crop_type: "Maize",
        planting_date: new Date("2026-03-25"),
        current_stage: plant_status.GROWING,
        ...(agent?.id ? { assigned_agent_id: agent?.id } : {}),
        notes: ["Initial planting complete"],
      },
      {
        name: "South Plot",
        crop_type: "Beans",
        planting_date: new Date("2026-04-01"),
        current_stage: plant_status.GROWING,
        ...(agent?.id ? { assigned_agent_id: agent?.id } : {}),
        notes: ["Soil moisture good"],
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded demo users + fields:");
  console.log(`- Admin: ${admin.email} / #Password123`);
  console.log(`- Agent: ${agent.email} / #Password123`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
