import { apiBaseUrl } from "./config";
import type { UploadResponse, UploadType } from "@/types/upload";

export async function uploadFile(
  token: string,
  uploadType: UploadType,
  file: File,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch(`${apiBaseUrl}/uploads/${uploadType}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return response.json() as Promise<UploadResponse>;
}
