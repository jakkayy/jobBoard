import { apiRequest } from "./api";
import type { Application } from "@/types/candidate";
import type {
  ApplicationList,
  ApplicationStatusPayload,
  EmployerProfile,
  EmployerProfilePayload,
} from "@/types/employer";

export async function getEmployerProfile(token: string): Promise<EmployerProfile> {
  return apiRequest<EmployerProfile>("/profiles/employer/me", { token });
}

export async function createEmployerProfile(
  token: string,
  payload: EmployerProfilePayload,
): Promise<EmployerProfile> {
  return apiRequest<EmployerProfile>("/profiles/employer/me", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateEmployerProfile(
  token: string,
  payload: Partial<EmployerProfilePayload>,
): Promise<EmployerProfile> {
  return apiRequest<EmployerProfile>("/profiles/employer/me", {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function getJobApplications(token: string, jobId: number): Promise<ApplicationList> {
  return apiRequest<ApplicationList>(`/employer/jobs/${jobId}/applications`, { token });
}

export async function updateApplicationStatus(
  token: string,
  applicationId: number,
  payload: ApplicationStatusPayload,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}
