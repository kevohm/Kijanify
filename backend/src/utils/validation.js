import { plant_status, user_role } from "@prisma/client";
import { z } from "zod";
const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { error: "Must include at least one uppercase letter" })
  .regex(/[a-z]/, { error: "Must include at least one lowercase letter" })
  .regex(/[0-9]/, { error: "Must include at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    error: "Must include at least one special character",
  });

export const loginSchema = z.object({
  email: z.email({ error: "Please provide a valid email address" }),
  password: passwordSchema,
  role: z.enum(user_role, { error: "Invalid role" }).default(user_role.FARMER),
});

export const signupSchema = z.object({
  email: z.email({ error: "Please provide a valid email address" }),
  password: passwordSchema,
  name: z.string().min(1, { error: "Name is required" }),
  role: z.enum(user_role, { error: "Invalid role" }).default(user_role.FARMER),
});

export const fieldSchema = z.object({
  name: z.string().min(1),
  crop_type: z.string().min(1),
  planting_date: z.string(),
  notes: z.array(z.string()).optional().default([]),
  current_stage: z
    .enum(["PLANTED", "GROWING", "READY", "HARVESTED"])
    .optional(),
  assigned_agent_id: z.string().optional(),
});

export const createFieldSchema = z.object({
  name: z.string().min(1),
  crop_type: z.string().min(1),
  planting_date: z.coerce.date(),
  notes: z.array(z.string()).optional().default([]),
  assigned_agent_id: z.string().optional().nullable(),
});

export const updateStatusSchema = z.object({
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

export const assignAgentSchema = z.object({
  assigned_agent_id: z.cuid({ error: "Please provide a valid agent ID" }),
});
