const FieldModel = require("../models/fieldModel");
const { z } = require("zod");
const {
  updateStatusSchema,
  createFieldSchema,
  assignAgentSchema,
  updateFieldDetailsSchema,
} = require("../utils/validation");
const { plant_status } = require("@prisma/client");
const { computeStatus } = require("../utils/statusUtils");
const { AppError } = require("../utils/appError");
const UserService = require("./userService");

const FieldService = {
  toSafeField(field) {
    if (!field) return null;

    return {
      id: field.id,
      name: field.name,
      crop_type: field.crop_type,
      current_stage: field.current_stage,
      planting_date: field.planting_date,
      notes: field.notes,
      assigned_agent_id: field.assigned_agent_id,
      created_at: field.created_at,
      updated_at: field.updated_at,
    };
  },

  async createField(body) {
    const data = await createFieldSchema.parseAsync(body);

    return FieldModel.addField(data);
  },
  async getFieldByIdAndThrow(id) {
    if (!id) {
      throw new AppError("Field not found", 404);
    }
    const field = await FieldModel.findById(id);
    if (!field) {
      throw new AppError("Field not found", 404);
    }
    return { ...field, status: computeStatus(field) };
  },
  async getFieldById(id) {
    if (!id) return null;
    const field = await FieldModel.findById(id);
    return field ? { ...field, status: computeStatus(field) } : null;
  },

  async getFields(query) {
    const fields = await FieldModel.findMany(query);
    return fields.map((field) => ({
      ...field,
      status: computeStatus(field),
    }));
  },

  async updateFieldDetails(id, body) {
    const data = await updateFieldDetailsSchema.parseAsync(body);
    if (!id) {
      throw new AppError("Field not found", 404);
    }

    const hasUpdates = Object.values(data).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new AppError({
        status: 400,
        code: "BAD_REQUEST",
        message: "No updates provided",
        suggestion: "Provide at least one field to update",
      });
    }

    await FieldService.getFieldByIdAndThrow(id);
    const updated = await FieldModel.updateById(id, data);
    return { ...updated, status: computeStatus(updated) };
  },

  /**
     *  - Planting stages correlation:
     * - PLANTED: Initial stage when seeds or seedlings are placed in soil
     * - GROWING: Active development phase where the plant is establishing roots and foliage
     * - READY: Plant has matured and is prepared for harvest
     * - HARVESTED: Final stage after the plant has been harvested
     * 
     */
    // plant => Grow => Ready => Harvested
  async updateFieldStatus(id, body) {
    const data = await updateStatusSchema.parseAsync(body);
    const existingField = await FieldService.getFieldByIdAndThrow(id);
    let notes = existingField?.notes ?? [];
    if (data?.notes?.length > 0) {
      notes = [...new Set([...notes, ...data.notes])];
    }
    
    const updated = await FieldModel.updateById(id, {
      last_status_update: new Date(),
      current_stage: data.current_stage,
      ...(data?.notes?.length > 0 ? { notes } : {}),
    });

    return { ...updated, status: computeStatus(updated) };
  },

  async assignAgent(fieldId, body) {
    const data = await assignAgentSchema.parseAsync(body);

    await UserService.getUserByIdAndThrow(data.assigned_agent_id);
    const field = await this.getFieldByIdAndThrow(fieldId);

    if (field.assigned_agent_id === data.assigned_agent_id) {
      throw new AppError("Agent already assigned to this field", 400);
    }

    return await FieldModel.updateById(fieldId, data);
  },
};

module.exports = FieldService;
