"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import { useAppointments } from "@/hooks/useAppointments";
import { appointmentService } from "@/services/appointmentService";
import { Appointment, AppointmentFormValues, Doctor } from "@/types/appointment";
import { CalendarDays, ClipboardCheck, MapPin, Video } from "lucide-react";

interface AppointmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatTime = (time: string) => {
  const [hoursRaw, minutes] = time.split(":");
  const hours = Number(hoursRaw);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = ((hours + 11) % 12) + 1;
  return `${normalizedHours}:${minutes} ${suffix}`;
};

export default function AppointmentDetailsPage({
  params,
}: AppointmentDetailsPageProps) {
  const searchParams = useSearchParams();
  const [appointmentId, setAppointmentId] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(
    searchParams.get("mode") === "reschedule"
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visitChecklist, setVisitChecklist] = useState([false, false, false]);
  const { cancelAppointment, rescheduleAppointment } = useAppointments();

  useEffect(() => {
    let cancelled = false;

    const resolveParams = async () => {
      const resolved = await params;
      if (!cancelled) {
        setAppointmentId(resolved.id);
      }
    };

    resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    let cancelled = false;

    const loadDetails = async () => {
      if (!appointmentId) {
        return;
      }

      try {
        setLoading(true);
        setError("");
        const appointmentData = await appointmentService.getAppointmentById(
          appointmentId
        );
        const doctorData = await appointmentService.getDoctorById(
          appointmentData.doctorId
        );

        if (!cancelled) {
          setAppointment(appointmentData);
          setDoctor(doctorData);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Unable to load appointment details."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  const refresh = async () => {
    if (!appointmentId) {
      return;
    }
    const appointmentData = await appointmentService.getAppointmentById(appointmentId);
    const doctorData = await appointmentService.getDoctorById(appointmentData.doctorId);
    setAppointment(appointmentData);
    setDoctor(doctorData);
  };

  const handleCancel = async () => {
    if (!appointment) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await cancelAppointment(appointment.id, cancelReason);
      setActionMessage("Appointment cancelled successfully.");
      setShowCancelModal(false);
      setCancelReason("");
      await refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Unable to cancel appointment."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReschedule = async (values: AppointmentFormValues) => {
    if (!appointment) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await rescheduleAppointment(appointment.id, values);
      setActionMessage("Appointment rescheduled successfully.");
      setIsRescheduling(false);
      await refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Unable to reschedule appointment."));
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppointmentModuleShell
      title="Appointment Details"
      subtitle="Review appointment information and manage valid next actions."
      action={
        <Link
          href="/appointments"
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Appointments
        </Link>
      }
    >
      {loading ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          Loading appointment details...
        </section>
      ) : error && !appointment ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-rose-700">
            Unable to load appointment details. Please try again.
          </h2>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
        </section>
      ) : appointment && doctor ? (
        <>
          {actionMessage ? (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
              {actionMessage}
            </section>
          ) : null}
          {error ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {error}
            </section>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                      {doctor.name.replace("Dr. ", "").split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                      <p className="text-sm font-medium text-blue-700">{doctor.specialization}</p>
                      <p className="mt-1 text-xs text-slate-500">★ {doctor.rating.toFixed(1)} ({doctor.reviews} reviews)</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${appointment.status === "UPCOMING" ? "bg-emerald-50 text-emerald-700" : appointment.status === "COMPLETED" ? "bg-slate-100 text-slate-600" : "bg-rose-50 text-rose-700"}`}>
                    {appointment.status === "UPCOMING" ? "Confirmed" : appointment.status}
                  </span>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="border-b border-slate-100 pb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Consultation Details</h3>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="flex gap-3"><CalendarDays className="mt-1 h-5 w-5 text-blue-600" /><div><p className="text-xs text-slate-500">Date & Time</p><p className="mt-1 font-semibold text-slate-900">{formatDate(appointment.appointmentDate)}</p><p className="text-sm text-slate-600">{formatTime(appointment.appointmentTime)}</p></div></div>
                  <div className="flex gap-3">{appointment.appointmentType === "VIDEO" ? <Video className="mt-1 h-5 w-5 text-blue-600" /> : <MapPin className="mt-1 h-5 w-5 text-blue-600" />}<div><p className="text-xs text-slate-500">Appointment Type</p><p className="mt-1 font-semibold text-slate-900">{appointment.appointmentType === "VIDEO" ? "Video Consultation" : "In-person Visit"}</p><p className="text-sm text-slate-600">{appointment.appointmentType === "VIDEO" ? "Secure telehealth link" : appointment.hospital}</p></div></div>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Reason for visit</p><p className="mt-1 text-sm leading-6 text-slate-700">{appointment.reason}</p></div>
                {appointment.status === "UPCOMING" ? <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">Ready to join?</p><p className="text-xs text-slate-600">Your meeting room opens 10 minutes before the scheduled time.</p></div>{appointment.appointmentType === "VIDEO" ? <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Video className="h-4 w-4" /> Join Meeting</button> : null}</div> : null}
                {appointment.notes ? (
                  <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                    {appointment.notes}
                  </div>
                ) : null}
                {appointment.cancellationReason ? (
                  <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                    Cancellation reason: {appointment.cancellationReason}
                  </div>
                ) : null}
              </article>

              {isRescheduling && appointment.status === "UPCOMING" ? (
                <AppointmentForm
                  doctor={doctor}
                  mode="reschedule"
                  submitLabel="Confirm Reschedule"
                  isSubmitting={submitting}
                  initialValues={{
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate,
                    appointmentTime: appointment.appointmentTime,
                    reason: appointment.reason,
                  }}
                  helperText="Select a new valid appointment date and an available time slot for this same doctor."
                  loadAvailability={(date) =>
                    appointmentService.getDoctorAvailability(
                      doctor.id,
                      date,
                      appointment.id
                    )
                  }
                  onBack={() => setIsRescheduling(false)}
                  onSubmit={handleReschedule}
                />
              ) : null}
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-slate-900">Before Your Visit</h3></div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">{["Update your latest medical information.", "Prepare recent test reports or lab work.", "List any symptom changes to discuss."].map((item, index) => <label key={item} className="flex cursor-pointer gap-3"><input type="checkbox" checked={visitChecklist[index]} onChange={() => setVisitChecklist((current) => current.map((value, i) => i === index ? !value : value))} className="mt-0.5 h-4 w-4 accent-blue-600" /><span className={visitChecklist[index] ? "text-slate-400 line-through" : ""}>{item}</span></label>)}</div>
              </article>

              {appointment.status === "UPCOMING" ? (
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(true)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Reschedule Appointment
                    </button>
                    <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><CalendarDays className="h-4 w-4" /> Add to Calendar</button>
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </article>
              ) : null}
            </aside>
          </section>
        </>
      ) : null}

      {showCancelModal && appointment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900">
              Cancel Appointment?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to cancel this appointment?
            </p>
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppointmentModuleShell>
  );
}
