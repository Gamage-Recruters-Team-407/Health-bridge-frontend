import api from "@/lib/axios";
import type { Notification } from "@/types/notification";

export const notificationService = {
	async getAll(): Promise<Notification[]> {
		const response = await api.get<Notification[]>("/notifications");
		return response.data;
	},

	async getUnreadCount(): Promise<number> {
		const response = await api.get<{ count: number }>("/notifications/unread-count");
		return response.data.count;
	},

	async markAsRead(id: string): Promise<Notification> {
		const response = await api.patch<Notification>(`/notifications/${id}/read`);
		return response.data;
	},
};
