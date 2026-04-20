const FieldModel = require("../models/fieldModel");
const { z } = require("zod");
const {
  updateStatusSchema,
  createFieldSchema,
  assignAgentSchema,
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
    
    return FieldModel.updateById(id, {
      current_stage: data.current_stage,
      ...(data?.notes?.length > 0 ? { notes } : {}),
      ...(existingField?.planting_date &&
      data.current_stage === plant_status.PLANTED
        ? {}
        : { planting_date: new Date() }),
    });
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
