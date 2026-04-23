export type PlantStage = "PLANTED" | "GROWING" | "READY" | "HARVESTED";
export type FieldStatus = "Active" | "At Risk" | "Completed";

export type Field = {
  id: string;
  name: string;
  crop_type: string;
  current_stage: PlantStage;
  planting_date: string;
  notes: string[];
  assigned_agent_id: string | null;
  last_status_update?: string;
  created_at: string;
  updated_at: string;
  status?: FieldStatus;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateFieldInput = {
  name: string;
  crop_type: string;
  planting_date: string;
  notes?: string[];
  assigned_agent_id?: string | null;
};

export type UpdateFieldStatusInput = {
  current_stage: PlantStage;
  notes?: string[];
};

export type UpdateFieldInput = {
  name?: string;
  crop_type?: string;
  planting_date?: string;
};

export type AssignAgentInput = {
  assigned_agent_id: string;
};
