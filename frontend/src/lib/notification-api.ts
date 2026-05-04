import { apiRequest } from "./api";
import type { NotificationList } from "@/types/notification";

export async function getNotifications(token: string): Promise<NotificationList> {
  return apiRequest<NotificationList>("/notifications", {
    token,
    cache: "no-store",
  });
}

export async function markNotificationsRead(token: string): Promise<void> {
  return apiRequest<void>("/notifications/mark-read", {
    method: "POST",
    token,
  });
}
