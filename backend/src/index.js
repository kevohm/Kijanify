const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const prisma = require("./utils/prisma");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

(async () => {
  try {
    const dbStartedAtNs = process.hrtime.bigint();
    await prisma.$queryRaw`SELECT 1`;
    const dbEndedAtNs = process.hrtime.bigint();
    const latencyMs = Number(dbEndedAtNs - dbStartedAtNs) / 1e6;
    console.log(`Database connected (${latencyMs.toFixed(1)}ms)`);
  } catch (err) {
    console.error("Database connection check failed", err?.message || err);
  }
})();

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);

  await new Promise((resolve) => server.close(resolve));

  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error("Error disconnecting Prisma", err?.message || err);
  }

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
