export type UserRole = "ADMIN" | "AGENT";

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
};

export type AuthSuccess = {
  token: string;
  user: SafeUser;
};

