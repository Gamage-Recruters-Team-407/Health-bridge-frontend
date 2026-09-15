"use client";

import { useCallback, useEffect, useState } from "react";

export interface AppNotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = (await response.json()) as AppNotificationItem[];
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );

    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    notifications,
    loading,
    error,
    reload,
    markAsRead,
  };
}

export default useNotifications;
