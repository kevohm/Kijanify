import { api } from "../../../lib/api-client";
import type {
  AssignAgentInput,
  CreateFieldInput,
  Field,
  UpdateFieldInput,
  UpdateFieldStatusInput,
} from "../types";

type DataResponse<T> = { data: T };

function unwrapData<T>(payload: T | DataResponse<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as DataResponse<T>).data;
  }
  return payload as T;
}

export async function listFields(): Promise<Field[]> {
  const res = await api.get<DataResponse<Field[]>>("/fields");
  return res.data.data;
}

export async function listFieldsForUser(userId: string): Promise<Field[]> {
  const res = await api.get<DataResponse<Field[]>>("/fields", {
    params: { user_id: userId },
  });
  return res.data.data;
}

export async function getField(id: string): Promise<Field> {
  const res = await api.get<DataResponse<Field>>(`/fields/${id}`);
  return res.data.data;
}

export async function createField(input: CreateFieldInput): Promise<Field> {
  const res = await api.post<Field | DataResponse<Field>>("/fields", input);
  return unwrapData(res.data);
}

export async function updateFieldStatus(
  id: string,
  input: UpdateFieldStatusInput,
): Promise<Field> {
  const res = await api.post<DataResponse<Field>>(`/fields/${id}/status`, input);
  return res.data.data;
}

export async function updateField(
  id: string,
  input: UpdateFieldInput,
): Promise<Field> {
  const res = await api.patch<DataResponse<Field>>(`/fields/${id}`, input);
  return res.data.data;
}

export async function assignAgent(
  id: string,
  input: AssignAgentInput,
): Promise<Field> {
  const res = await api.post<DataResponse<Field>>(`/fields/${id}/assign`, input);
  return res.data.data;
}
