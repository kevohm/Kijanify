import { api } from "../../../lib/api-client";
import type { AuthSuccess, LoginInput, SafeUser, SignupInput } from "../types";

type AuthResponse = { data: SafeUser };
type MeResponse = { data: SafeUser };

export async function signup(input: SignupInput): Promise<AuthSuccess> {
  const res = await api.post<AuthResponse>("/auth/signup", input);
  return { user: res.data.data };
}

export async function login(input: LoginInput): Promise<AuthSuccess> {
  const res = await api.post<AuthResponse>("/auth/login", input);
  return { user: res.data.data };
}

export async function getMe(): Promise<SafeUser> {
  const res = await api.get<MeResponse>("/auth/me");
  return res.data.data;
}

export async function refreshSession(): Promise<SafeUser> {
  const res = await api.post<MeResponse>("/auth/refresh");
  return res.data.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
