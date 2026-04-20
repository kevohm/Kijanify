const { da } = require("zod/v4/locales");
const {
  getAllFields,
  getFieldById,
  addField,
  updateField,
} = require("../models/fieldModel");
const FieldService = require("../services/fieldService");
const { computeStatus } = require("../utils/statusUtils");
const { user_role } = require("@prisma/client");

function parseDate(value) {
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

async function listFields(req, res, next) {
  const assignedAgentId =
    req.user?.role === user_role.AGENT ? req.user.id : undefined;
  const fields = await FieldService.getFields({ assignedAgentId });
  res.json({
    data: fields,
  });
}

async function getField(req, res, next) {
  const field = await FieldService.getFieldByIdAndThrow(req.params.id);
  if (
    req.user?.role === user_role.AGENT &&
    field.assigned_agent_id !== req.user.id
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json({ data: field });
}

async function createField(req, res, next) {
  const field = await FieldService.createField(req.body);
  res.status(201).json({ ...field, status: computeStatus(field) });
}

async function patchField(req, res, next) {
  if (req.user?.role === user_role.AGENT) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const field = await FieldService.updateFieldStatus(req.params.id, req.body);

  res.json({ data: field });
}

async function updateStatus(req, res, next) {
  const existingField = await FieldService.getFieldByIdAndThrow(req.params?.id);

  if (
    req.user?.role === user_role.AGENT &&
    existingField.assigned_agent_id !== req.user.id
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  console.log(req.body)

  const field = await FieldService.updateFieldStatus(req.params?.id, req.body);

  res.json({ data: field });
}

async function assignAgent(req, res, next) {
  if (req.user?.role === user_role.AGENT) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const field = await FieldService.assignAgent(req.params?.id, req.body);
  res.json({ data: field });
}

module.exports = {
  listFields,
  getField,
  createField,
  patchField,
  assignAgent,
  updateStatus,
};
