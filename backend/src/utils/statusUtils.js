const { plant_status } = require("@prisma/client");

function getAtRiskThresholdDays() {
  const rawValue = process.env.AT_RISK_THRESHOLD_DAYS;
  const parsed = Number.parseInt(rawValue ?? "", 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 7;
}

function getAtRiskThresholdDate(now = new Date()) {
  const days = getAtRiskThresholdDays();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function computeStatus(field) {
  const currentStage = field?.current_stage ?? field?.currentStage;
  if (currentStage === plant_status.HARVESTED) {
    return "Completed";
  }

  const now = new Date();
  const thresholdDate = getAtRiskThresholdDate(now);

  const lastUpdatedValue =
    field?.last_status_update ??
    field?.lastStatusUpdate ??
    field?.planting_date ??
    field?.plantingDate;

  const lastUpdated =
    lastUpdatedValue instanceof Date ? lastUpdatedValue : new Date(lastUpdatedValue);

  if (Number.isNaN(lastUpdated.getTime())) {
    return "At Risk";
  }

  if (lastUpdated.getTime() <= thresholdDate.getTime()) {
    return "At Risk";
  }

  return "Active";
}

module.exports = { computeStatus, getAtRiskThresholdDays, getAtRiskThresholdDate };
