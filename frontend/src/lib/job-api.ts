import { apiRequest } from "./api";
import type { EmploymentType, Job, JobList, JobPayload, JobStatus } from "@/types/job";

export type JobSearchParams = {
  keyword?: string;
  location?: string;
  employment_type?: EmploymentType;
  salary_min?: string;
  salary_max?: string;
  status?: JobStatus;
  page?: string;
  limit?: string;
  sort?: "newest" | "oldest";
};

export async function getJobs(params: JobSearchParams = {}): Promise<JobList> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return apiRequest<JobList>(`/jobs${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
  });
}

export async function getJob(jobId: string): Promise<Job> {
  return apiRequest<Job>(`/jobs/${jobId}`, {
    cache: "no-store",
  });
}

export async function createJob(token: string, payload: JobPayload): Promise<Job> {
  return apiRequest<Job>("/jobs", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateJob(token: string, jobId: number, payload: Partial<JobPayload>): Promise<Job> {
  return apiRequest<Job>(`/jobs/${jobId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deleteJob(token: string, jobId: number): Promise<void> {
  return apiRequest<void>(`/jobs/${jobId}`, {
    method: "DELETE",
    token,
  });
}
