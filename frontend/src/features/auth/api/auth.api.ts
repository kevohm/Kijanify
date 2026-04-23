import { api } from "../../../lib/api-client";
import type { AuthSuccess, LoginInput, SafeUser, SignupInput } from "../types";

type AuthResponse = { token: string; data: SafeUser };
type MeResponse = { data: SafeUser };

export async function signup(input: SignupInput): Promise<AuthSuccess> {
  const res = await api.post<AuthResponse>("/auth/signup", input);
  return { token: res.data.token, user: res.data.data };
}

export async function login(input: LoginInput): Promise<AuthSuccess> {
  const res = await api.post<AuthResponse>("/auth/login", input);
  return { token: res.data.token, user: res.data.data };
}

export async function getMe(): Promise<SafeUser> {
  const res = await api.get<MeResponse>("/auth/me");
  return res.data.data;
}

