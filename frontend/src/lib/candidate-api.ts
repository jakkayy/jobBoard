import { apiRequest } from "./api";
import type {
  Application,
  ApplicationPayload,
  CandidateProfile,
  CandidateProfilePayload,
} from "@/types/candidate";

export async function getCandidateProfile(token: string): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/profiles/candidate/me", { token });
}

export async function createCandidateProfile(
  token: string,
  payload: CandidateProfilePayload,
): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/profiles/candidate/me", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function updateCandidateProfile(
  token: string,
  payload: Partial<CandidateProfilePayload>,
): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/profiles/candidate/me", {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function getMyApplications(token: string): Promise<Application[]> {
  return apiRequest<Application[]>("/me/applications", { token });
}

export async function applyToJob(
  token: string,
  jobId: number,
  payload: ApplicationPayload,
): Promise<Application> {
  return apiRequest<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    token,
    body: payload,
  });
}
