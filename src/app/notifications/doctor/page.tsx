"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import DoctorShell from "@/features/doctor/components/DoctorShell";
import PageHeader from "@/features/doctor/components/PageHeader";
import { getNotifications, markNotificationAsRead, type Notification } from "@/services/notificationService";

function DoctorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setNotifications(await getNotifications()); }
    catch { setError("Unable to load notifications. Please try again."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function markRead(notification: Notification) {
    if (notification.read) return;
    setPending(notification.id);
    setError("");
    try {
      await markNotificationAsRead(notification.id);
      setNotifications(items => items.map(item => item.id === notification.id ? { ...item, read: true } : item));
    } catch { setError("Unable to mark the notification as read. Please try again."); }
    finally { setPending(null); }
  }

  return <>
    <PageHeader eyebrow="Updates" title="Notifications" description="Your latest HealthBridge updates." />
    {error && <div role="alert" className="mb-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{error}<button type="button" onClick={() => void load()} className="ml-3 font-semibold underline">Retry</button></div>}
    <section aria-busy={loading} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {loading ? <p role="status" className="p-6 text-sm text-slate-500">Loading notifications...</p>
        : !notifications.length ? <div className="p-10 text-center"><Bell className="mx-auto mb-3 h-8 w-8 text-blue-600" /><h2 className="font-semibold">{error ? "Notifications unavailable" : "No notifications yet"}</h2><p className="mt-2 text-sm text-slate-500">{error ? "Retry when the backend connection is available." : "New updates will appear here."}</p></div>
          : <ul className="divide-y divide-slate-100">{notifications.map(notification => <li key={notification.id}>
            <button type="button" disabled={pending !== null} onClick={() => void markRead(notification)} className={`flex w-full gap-4 p-5 text-left hover:bg-slate-50 disabled:opacity-60 ${notification.read ? "bg-white" : "bg-blue-50"}`}>
              <Bell className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-900">{notification.title}</span>{!notification.read && <span className="text-xs font-semibold text-blue-700">{pending === notification.id ? "Updating..." : "Unread"}</span>}</span><span className="mt-1 block text-sm text-slate-600">{notification.message}</span><time className="mt-2 block text-xs text-slate-500" dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString()}</time></span>
            </button>
          </li>)}</ul>}
    </section>
  </>;
}

export default function DoctorNotificationsPage() {
  return <DoctorShell><DoctorNotifications /></DoctorShell>;
}
