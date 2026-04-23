const { plant_status, user_role } = require("@prisma/client");
const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { error: "Must include at least one uppercase letter" })
  .regex(/[a-z]/, { error: "Must include at least one lowercase letter" })
  .regex(/[0-9]/, { error: "Must include at least one number" })
  .regex(/[^A-Za-z0-9]/, { error: "Must include at least one special character" });

const loginSchema = z.object({
  email: z.email({ error: "Please provide a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

const signupSchema = z.object({
  email: z.email({ error: "Please provide a valid email address" }),
  password: passwordSchema,
  name: z.string().min(1, { error: "Name is required" }),
  role: z.enum(user_role, { error: "Invalid role" }).default(user_role.AGENT),
});

const fieldSchema = z.object({
  name: z.string().min(1),
  crop_type: z.string().min(1),
  planting_date: z.string(),
  notes: z.array(z.string()).optional().default([]),
  current_stage: z.enum(["PLANTED", "GROWING", "READY", "HARVESTED"]).optional(),
  assigned_agent_id: z.string().optional(),
});

const createFieldSchema = z.object({
  name: z.string().min(1),
  crop_type: z.string().min(1),
  planting_date: z.coerce.date(),
  notes: z.array(z.string()).optional().default([]),
  assigned_agent_id: z.string().optional().nullable(),
});

const updateStatusSchema = z.object({
  current_stage: z.enum(plant_status, {
    error: "Invalid stage",
  }),
  notes: z
    .array(z.string({ error: "Please provide a valid note" }), {
      error: "Please provide atleast one note",
    })
    .optional()
    .default([]),
});

const assignAgentSchema = z.object({
  assigned_agent_id: z.cuid({ error: "Please provide a valid agent ID" }),
});

const updateFieldDetailsSchema = z.object({
  name: z.string().min(1).optional(),
  crop_type: z.string().min(1).optional(),
  planting_date: z.coerce.date().optional(),
});

module.exports = {
  loginSchema,
  signupSchema,
  fieldSchema,
  createFieldSchema,
  updateStatusSchema,
  assignAgentSchema,
  updateFieldDetailsSchema,
};
