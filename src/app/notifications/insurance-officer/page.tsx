"use client";

import { Bell } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/hooks/useNotifications";

export default function InsuranceOfficerNotificationsPage() {
  const { notifications, loading, error, reload, markAsRead } =
    useNotifications();

  return (
    <DashboardLayout
      pageTitle="Insurance Notifications"
      userRole="INSURANCE_OFFICER"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">
            Updates for your insurance operations.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between rounded-lg bg-rose-50 p-4 text-sm text-rose-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void reload()}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <section
          aria-busy={loading}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          {loading ? (
            <p role="status" className="p-6 text-sm text-slate-500">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center">
              <Bell className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-slate-900">
                {error ? "Notifications unavailable" : "No notifications yet"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {error
                  ? "Retry when the backend connection is available."
                  : "New updates will appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => void markAsRead(notification.id)}
                    className={`flex w-full gap-4 p-5 text-left transition hover:bg-slate-50 ${
                      notification.read ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <Bell className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="text-xs font-semibold text-blue-700">
                            Unread
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {notification.message}
                      </span>
                      <time
                        className="mt-2 block text-xs text-slate-500"
                        dateTime={notification.createdAt}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </time>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
