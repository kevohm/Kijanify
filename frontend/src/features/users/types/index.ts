export type UserRole = "ADMIN" | "AGENT";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

