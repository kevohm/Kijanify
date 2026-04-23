import { api } from "../../../lib/api-client";
import type { User, UserRole } from "../types";

export type ListUsersParams = {
  role?: UserRole;
};

export async function listUsers(params: ListUsersParams = {}): Promise<User[]> {
  const res = await api.get<User[]>("/users", { params });
  return res.data;
}

export async function getUser(id: string): Promise<User> {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
}
