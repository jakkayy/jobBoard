export type NotificationType = "application_received" | "application_status_updated";

export type Notification = {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type NotificationList = {
  items: Notification[];
  total: number;
  unread_count: number;
};
