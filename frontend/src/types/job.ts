export type EmploymentType = "full_time" | "part_time" | "contract" | "freelance" | "internship";

export type JobStatus = "draft" | "published" | "closed";

export type Job = {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  location: string | null;
  employment_type: EmploymentType;
  salary_min: number | null;
  salary_max: number | null;
  skills_required: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
};

export type JobList = {
  items: Job[];
  total: number;
  page: number;
  limit: number;
};
