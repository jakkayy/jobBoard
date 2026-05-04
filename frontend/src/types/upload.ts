export type UploadType = "cv" | "profile-picture" | "company-logo";

export type UploadResponse = {
  filename: string;
  url: string;
  content_type: string;
  size: number;
};
