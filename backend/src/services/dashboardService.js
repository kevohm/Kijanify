const prisma = require("../utils/prisma");
const { computeStatus, getAtRiskThresholdDate } = require("../utils/statusUtils");
const { AppError } = require("../utils/appError");

const fieldInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

function toActivityItem(field) {
  const notes = Array.isArray(field?.notes) ? field.notes : [];
  return {
    field_id: field.id,
    field_name: field.name,
    crop_type: field.crop_type,
    current_stage: field.current_stage,
    status: computeStatus(field),
    assigned_agent_id: field.assigned_agent_id ?? null,
    assigned_agent: field.user ?? null,
    last_status_update: field.last_status_update,
    updated_at: field.updated_at,
    notes_count: notes.length,
    latest_note: notes.length > 0 ? notes[notes.length - 1] : null,
  };
}

function createEmptyStatusBreakdown() {
  return { Active: 0, "At Risk": 0, Completed: 0 };
}

const DashboardService = {
  async getAdminDashboard({ limit = 20 } = {}) {
    const now = new Date();
    const thresholdDate = getAtRiskThresholdDate(now);

    const [totalFields, completedCount, atRiskCount, recentFields] = await Promise.all([
      prisma.field.count(),
      prisma.field.count({ where: { current_stage: "HARVESTED" } }),
      prisma.field.count({
        where: {
          current_stage: { not: "HARVESTED" },
          last_status_update: { lte: thresholdDate },
        },
      }),
      prisma.field.findMany({
        include: fieldInclude,
        orderBy: { last_status_update: "desc" },
        take: limit,
      }),
    ]);

    const activeCount = Math.max(totalFields - completedCount - atRiskCount, 0);

    return {
      totalFields,
      statusBreakdown: {
        Active: activeCount,
        "At Risk": atRiskCount,
        Completed: completedCount,
      },
      activities: recentFields.map(toActivityItem),
    };
  },

  async getAgentDashboard({ agentId, limit = 10 } = {}) {
    if (!agentId) {
      throw new AppError({
        status: 400,
        code: "BAD_REQUEST",
        message: "Agent id is required",
      });
    }

    const fields = await prisma.field.findMany({
      where: { assigned_agent_id: agentId },
      include: fieldInclude,
      orderBy: { created_at: "desc" },
    });

    const fieldsWithStatus = fields.map((field) => ({
      ...field,
      status: computeStatus(field),
    }));

    const statusSummary = createEmptyStatusBreakdown();
    for (const field of fieldsWithStatus) {
      const status = field.status;
      if (statusSummary[status] != null) {
        statusSummary[status] += 1;
      }
    }

    const recentUpdates = [...fieldsWithStatus]
      .sort((a, b) => {
        const aTime = new Date(a.last_status_update ?? a.updated_at).getTime();
        const bTime = new Date(b.last_status_update ?? b.updated_at).getTime();
        return bTime - aTime;
      })
      .slice(0, limit)
      .map((field) => {
        const notes = Array.isArray(field?.notes) ? field.notes : [];
        return {
          field_id: field.id,
          field_name: field.name,
          current_stage: field.current_stage,
          status: field.status,
          last_status_update: field.last_status_update,
          notes_count: notes.length,
          latest_note: notes.length > 0 ? notes[notes.length - 1] : null,
        };
      });

    return {
      assignedFieldsCount: fieldsWithStatus.length,
      assignedFields: fieldsWithStatus,
      statusSummary,
      recentUpdates,
    };
  },
};

module.exports = DashboardService;

