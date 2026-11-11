export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
  } | null;
  title: string;
  message: string;
  type:
    | "new_product"
    | "product_update"
    | "new_order"
    | "order_update";
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "/api";

interface NotificationsResponse {
  success: boolean;
  count: number;
  data: Notification[];
  message?: string;
}

interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
  message?: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: "GET",
    credentials: "include",
  });

  const result: NotificationsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch notifications.");
  }

  return result.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/notifications/unread-count`, {
    method: "GET",
    credentials: "include",
  });

  const result: UnreadCountResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch unread count.");
  }

  return result.unreadCount;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const result: {
    success: boolean;
    data: Notification;
    message?: string;
  } = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to mark notification as read.");
  }

  return result.data;
};

export const markAllNotificationsAsRead = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
  });

  const result: {
    success: boolean;
    message: string;
    modifiedCount: number;
  } = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to mark all notifications as read.");
  }

  return result.modifiedCount;
};