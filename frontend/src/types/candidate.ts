export type CandidateProfile = {
  id: number;
  user_id: number;
  full_name: string;
  phone: string | null;
  bio: string | null;
  skills: string | null;
  cv_url: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateProfilePayload = {
  full_name: string;
  phone?: string;
  bio?: string;
  skills?: string;
  cv_url?: string;
  profile_picture_url?: string;
};

export type ApplicationStatus = "pending" | "reviewing" | "accepted" | "rejected";

export type Application = {
  id: number;
  job_id: number;
  candidate_id: number;
  cover_letter: string | null;
  cv_url: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type ApplicationPayload = {
  cover_letter?: string;
  cv_url?: string;
};
