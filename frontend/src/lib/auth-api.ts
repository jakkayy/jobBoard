import { apiRequest } from "./api";
import { apiBaseUrl } from "./config";
import type { LoginPayload, RegisterPayload, TokenResponse, User } from "@/types/auth";

export async function registerUser(payload: RegisterPayload): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.set("username", payload.email);
  formData.set("password", payload.password);

  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  return response.json() as Promise<TokenResponse>;
}

export async function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>("/auth/me", { token });
}
