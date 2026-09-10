import api from "@/lib/axios";
import { Reminder } from "@/types/reminder";

export const reminderService = {
  getTodaysReminders: async (patientId: string): Promise<Reminder[]> => {
    const response = await api.get(`/reminders/today/${patientId}`);
    return response.data;
  },

  updateReminderStatus: async (reminderId: string, status: string): Promise<Reminder> => {
    const response = await api.put(`/reminders/${reminderId}/status?status=${status}`);
    return response.data;
  }
};
