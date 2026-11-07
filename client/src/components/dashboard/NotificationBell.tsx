import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "../../services/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const notificationRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
  try {
    setError("");

    const [notificationData, count] = await Promise.all([
      getNotifications(),
      getUnreadCount(),
    ]);

    setNotifications(notificationData);
    setUnreadCount(count);
  } catch (error) {
    console.error("Failed to load notifications:", error);
    setError("Unable to load notifications.");
  } finally {
    setIsLoading(false);
  }
},[]);

useEffect(() => {
  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, [loadNotifications]);

useEffect(() => {
  if (!isOpen) return;

  const handleOutsideClick = (event: PointerEvent) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  document.addEventListener("pointerdown", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("pointerdown", handleOutsideClick);
    document.removeEventListener("keydown", handleEscape);
  };
}, [isOpen]);

const handleMarkAsRead = async (notificationId: string) => {
  try {
    const existingNotification = notifications.find(
      (notification) => notification._id === notificationId
    );

    if (!existingNotification || existingNotification.isRead) {
      return;
    }

    const updatedNotification =
      await markNotificationAsRead(notificationId);

    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification._id === notificationId
          ? updatedNotification
          : notification
      )
    );

    setUnreadCount((previousCount) =>
      Math.max(0, previousCount - 1)
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    setError("Unable to update notification.");
  }
};

const handleMarkAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead();

    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    setUnreadCount(0);
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    setError("Unable to update notifications.");
  }
};


return (
  <div ref={notificationRef} className="relative">
    {/* Notification bell */}
    <button
      type="button"
      onClick={() => setIsOpen((previous) => !previous)}
      aria-label="Open notifications"
      aria-expanded={isOpen}
      className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100"
    >
      <Bell size={22} />

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>

    {/* Notification panel */}
    {isOpen && (
      <div className="absolute right-0 top-full z-50 mt-3 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Notifications
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {unreadCount} unread notifications
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-emerald-700 transition hover:text-emerald-900"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[420px] overflow-y-auto">

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500">
              <Loader2 size={17} className="animate-spin" />
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-600">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={25} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium text-gray-700">
                No notifications yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                New updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleMarkAsRead(notification._id)}
                className={`flex w-full items-start gap-3 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50 ${
                  !notification.isRead ? "bg-emerald-50/50" : "bg-white"
                }`}
              >
                {/* Unread indicator */}
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    !notification.isRead
                      ? "bg-emerald-600"
                      : "bg-transparent"
                  }`}
                />

                {/* Notification details */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-3">
            <p className="text-center text-xs text-gray-400">
              Showing recent notifications
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);}


