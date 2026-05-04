import type { EmploymentType, Job } from "@/types/job";

export function formatEmploymentType(type: EmploymentType): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatSalary(job: Pick<Job, "salary_min" | "salary_max">): string {
  if (job.salary_min !== null && job.salary_max !== null) {
    return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
  }

  if (job.salary_min !== null) {
    return `From ${job.salary_min.toLocaleString()}`;
  }

  if (job.salary_max !== null) {
    return `Up to ${job.salary_max.toLocaleString()}`;
  }

  return "Not specified";
}
