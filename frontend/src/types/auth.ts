export type UserRole = "candidate" | "employer" | "admin";

export type AuthProvider = "local" | "google";

export type User = {
  id: number;
  email: string;
  role: UserRole;
  provider: AuthProvider;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
};
