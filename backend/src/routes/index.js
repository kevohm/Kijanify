
const router = require("express").Router();
const prisma = require("../utils/prisma");
const pkg = require("../../package.json");

async function healthHandler(req, res) {
  const now = new Date();
  const startedAtNs = process.hrtime.bigint();

  const health = {
    status: "ok",
    message: "OK",
    timestamp: now.toISOString(),
    service: {
      name: pkg.name,
      version: pkg.version,
      environment: process.env.NODE_ENV || "development",
    },
    runtime: {
      node: process.version,
      pid: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryBytes: process.memoryUsage(),
    },
    database: {
      status: "unknown",
      provider: "postgresql",
      message: "not checked",
    },
  };

  try {
    const dbStartedAtNs = process.hrtime.bigint();
    await prisma.$queryRaw`SELECT 1`;
    const dbEndedAtNs = process.hrtime.bigint();
    health.database.status = "ok";
    health.database.message = "connected";
    health.database.latencyMs = Number(dbEndedAtNs - dbStartedAtNs) / 1e6;
    health.message = "OK (database connected)";
  } catch (err) {
    health.status = "degraded";
    health.database.status = "error";
    health.database.message = "not connected";
    health.message = "Degraded (database not connected)";
    health.database.error = {
      name: err?.name || "Error",
      code: err?.code,
    };
    if (process.env.NODE_ENV !== "production") {
      health.database.error.message = err?.message;
    }
  }

  const endedAtNs = process.hrtime.bigint();
  health.responseTimeMs = Number(endedAtNs - startedAtNs) / 1e6;

  res.status(health.database.status === "ok" ? 200 : 503).json(health);
}

router.get("/", healthHandler);
router.get("/health", healthHandler);

router.use("/auth", require("./auth"));
router.use("/fields", require("./fields"));
router.use("/users", require("./users"));

module.exports = router;