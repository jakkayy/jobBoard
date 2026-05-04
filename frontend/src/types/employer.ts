import type { Application, ApplicationStatus } from "./candidate";

export type EmployerProfile = {
  id: number;
  user_id: number;
  company_name: string;
  company_website: string | null;
  company_description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type EmployerProfilePayload = {
  company_name: string;
  company_website?: string;
  company_description?: string;
  logo_url?: string;
};

export type ApplicationList = {
  items: Application[];
  total: number;
};

export type ApplicationStatusPayload = {
  status: ApplicationStatus;
};
