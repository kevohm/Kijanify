const DashboardService = require("../services/dashboardService");
const { AppError } = require("../utils/appError");

function parsePositiveInt(value, { defaultValue, max } = {}) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
  if (Number.isFinite(max) && parsed > max) return max;
  return parsed;
}

async function getAdminDashboard(req, res) {
  const limit = parsePositiveInt(req.query.limit, { defaultValue: 20, max: 100 });
  const data = await DashboardService.getAdminDashboard({ limit });
  res.json({ data });
}

async function getAgentDashboard(req, res) {
  const agentId = req.user?.id;
  if (!agentId) {
    throw new AppError({ status: 401, code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  const limit = parsePositiveInt(req.query.limit, { defaultValue: 10, max: 100 });
  const data = await DashboardService.getAgentDashboard({ agentId, limit });
  res.json({ data });
}

module.exports = { getAdminDashboard, getAgentDashboard };

