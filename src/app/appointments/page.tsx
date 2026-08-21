"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import AppointmentTable from "@/components/appointment/AppointmentTable";
import { useAppointments } from "@/hooks/useAppointments";
import { Appointment } from "@/types/appointment";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const summaryCards = [
  {
    key: "upcoming",
    label: "Upcoming Appointments",
    accent: "border-blue-100 bg-blue-50 text-blue-700",
  },
  {
    key: "completed",
    label: "Completed Appointments",
    accent: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  {
    key: "cancelled",
    label: "Cancelled Appointments",
    accent: "border-rose-100 bg-rose-50 text-rose-700",
  },
] as const;

const filterOptions = ["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const;

export default function AppointmentsPage() {
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    appointments,
    summary,
    loading,
    error,
    filters,
    setFilters,
    cancelAppointment,
    reload,
  } = useAppointments({
    status: "ALL",
    query: "",
  });

  const upcomingAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "UPCOMING"),
    [appointments]
  );

  const historyAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status !== "UPCOMING"),
    [appointments]
  );

  const handleConfirmCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    try {
      setIsCancelling(true);
      setActionError("");
      await cancelAppointment(cancelTarget.id, cancelReason);
      setCancelTarget(null);
      setCancelReason("");
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, "Unable to cancel appointment."));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AppointmentModuleShell
      title="My Appointments"
      subtitle="View and manage your healthcare appointments."
      action={
        <Link
          href="/appointments/search-doctor"
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Book Appointment
        </Link>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.key}
            className={`rounded-3xl border p-5 shadow-sm ${card.accent}`}
          >
            <p className="text-sm font-medium">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {summary[card.key]}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Appointment Schedule
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by doctor, appointment ID, reason, or hospital.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={filters.query || ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Search appointments"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-72"
            />
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = (filters.status || "ALL") === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        status: option,
                      }))
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option === "ALL" ? "All" : option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          Loading appointments...
        </section>
      ) : error ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-rose-700">
            Unable to load appointments. Please try again.
          </h2>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Retry
          </button>
        </section>
      ) : appointments.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No appointments found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            You do not have any appointments yet.
          </p>
          <Link
            href="/appointments/search-doctor"
            className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Book Appointment
          </Link>
        </section>
      ) : (
        <>
          <AppointmentTable
            appointments={upcomingAppointments}
            title="Upcoming Appointments"
            description="Your confirmed and upcoming consultations."
            emptyTitle="No upcoming appointments"
            emptyDescription="Schedule a consultation to see it here."
            onCancel={(appointment) => setCancelTarget(appointment)}
          />
          <AppointmentTable
            appointments={historyAppointments}
            title="Appointment History"
            description="Review completed and cancelled appointments."
            emptyTitle="No appointment history"
            emptyDescription="Completed or cancelled visits will appear here."
          />
        </>
      )}

      {cancelTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900">
              Cancel Appointment?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">{cancelTarget.doctorName}</p>
              <p className="mt-1">
                {cancelTarget.appointmentDate} at {cancelTarget.appointmentTime}
              </p>
            </div>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Cancellation Reason
              </span>
              <textarea
                rows={4}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Optional reason for cancelling this appointment."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {actionError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {actionError}
              </div>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setCancelTarget(null);
                  setCancelReason("");
                  setActionError("");
                }}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCancelling ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppointmentModuleShell>
  );
}
