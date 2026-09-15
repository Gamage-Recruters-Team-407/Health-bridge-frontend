"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationService } from "@/services/notification.service";
import type { Notification } from "@/types/notification";

export function useNotifications(autoLoad = true) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(autoLoad);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [items, unread] = await Promise.all([
				notificationService.getAll(),
				notificationService.getUnreadCount(),
			]);
			setNotifications(items);
			setUnreadCount(unread);
			return items;
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to load notifications.");
			throw cause;
		} finally {
			setLoading(false);
		}
	}, []);

	const markAsRead = useCallback(async (id: string) => {
		const current = notifications.find((item) => item.id === id);
		const updated = await notificationService.markAsRead(id);
		setNotifications((items) => items.map((item) => (item.id === id ? updated : item)));
		if (current && !current.read) setUnreadCount((count) => Math.max(0, count - 1));
		return updated;
	}, [notifications]);

	useEffect(() => {
		if (autoLoad) queueMicrotask(() => void reload());
	}, [autoLoad, reload]);

	return { notifications, unreadCount, loading, error, reload, markAsRead };
}

export default useNotifications;
