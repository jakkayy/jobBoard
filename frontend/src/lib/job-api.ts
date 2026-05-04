import { apiRequest } from "./api";
import type { EmploymentType, Job, JobList, JobStatus } from "@/types/job";

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
