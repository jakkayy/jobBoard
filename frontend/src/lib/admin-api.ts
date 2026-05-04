import { apiRequest } from "./api";
import type { ApplicationStatus } from "@/types/candidate";
import type { AdminApplicationList, AdminJobList, AdminUserList } from "@/types/admin";
import type { User, UserRole } from "@/types/auth";
import type { Job, JobStatus } from "@/types/job";

export async function getAdminUsers(token: string): Promise<AdminUserList> {
  return apiRequest<AdminUserList>("/admin/users", { token, cache: "no-store" });
}

export async function updateAdminUser(
  token: string,
  userId: number,
  payload: { role?: UserRole; is_active?: boolean },
): Promise<User> {
  return apiRequest<User>(`/admin/users/${userId}`, { method: "PATCH", token, body: payload });
}

export async function getAdminJobs(token: string): Promise<AdminJobList> {
  return apiRequest<AdminJobList>("/admin/jobs", { token, cache: "no-store" });
}

export async function updateAdminJob(
  token: string,
  jobId: number,
  payload: { status?: JobStatus },
): Promise<Job> {
  return apiRequest<Job>(`/admin/jobs/${jobId}`, { method: "PATCH", token, body: payload });
}

export async function getAdminApplications(token: string): Promise<AdminApplicationList> {
  return apiRequest<AdminApplicationList>("/admin/applications", { token, cache: "no-store" });
}

export type AdminApplicationStatus = ApplicationStatus;
