
function computeStatus(field) {
  const now = new Date();
  const lastUpdated = new Date(field.lastUpdated || field.plantingDate);
  const daysSinceUpdate = Math.floor(
    (now - lastUpdated) / (1000 * 60 * 60 * 24),
  );
  const atRiskThreshold = Number(process.env.AT_RISK_THRESHOLD_DAYS || 7);

  if (field.currentStage === "Harvested") {
    return "Completed";
  }

  if (daysSinceUpdate >= atRiskThreshold) {
    return "At Risk";
  }

  return "Active";
}

module.exports = { computeStatus };
