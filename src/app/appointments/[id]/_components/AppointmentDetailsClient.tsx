"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import AppointmentInfoGrid, {
  formatAppointmentNumber,
  InfoItem,
} from "./AppointmentInfoGrid";
import RescheduleModal from "./RescheduleModal";
import { useAppointmentDetails } from "../_hooks/useAppointmentDetails";

type AppointmentDetailsClientProps = {
  appointmentId: string;
  isConfirmed: boolean;
};

export default function AppointmentDetailsClient({
  appointmentId,
  isConfirmed,
}: AppointmentDetailsClientProps) {
  const details = useAppointmentDetails(appointmentId);
  const { appointment } = details;

  return (
    <AppointmentModuleShell
      title={isConfirmed ? "Appointment Confirmed" : "Appointment Details"}
      subtitle={
        isConfirmed
          ? "Your booking is secured. Keep the reference number for your records."
          : "Review your channeling information and queue status."
      }
    >
      {details.isLoading && <LoadingState />}

      {!details.isLoading && details.error && !appointment && (
        <PageError message={details.error} />
      )}

      {!details.isLoading && appointment && (
        <>
          {isConfirmed && (
            <ConfirmationBanner
              appointmentNumber={appointment.appointmentNumber}
            />
          )}

          {details.error && <InlineError message={details.error} />}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <AppointmentInfoGrid appointment={appointment} />

            {details.isActive && isToday(appointment.date) && (
              <QueueSummary
                appointmentNumber={appointment.appointmentNumber}
                currentQueueNumber={appointment.currentQueueNumber}
                patientsAhead={details.patientsAhead}
              />
            )}

            {details.isActive && appointment.appointmentType === "VIDEO" && (
              <VideoCallAction
                isJoining={details.isJoiningCall}
                onJoin={details.joinVideoCall}
              />
            )}

            <AppointmentActions
              canReschedule={details.isActive}
              onReschedule={details.openReschedule}
            />
          </section>

          {details.isRescheduleOpen && (
            <RescheduleModal
              sessions={details.availableSessions}
              onClose={details.closeReschedule}
              onSelect={details.reschedule}
            />
          )}
        </>
      )}
    </AppointmentModuleShell>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl border bg-white p-12 text-center text-sm text-slate-500">
      Loading appointment...
    </div>
  );
}

function PageError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
      {message}
    </div>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {message}
    </div>
  );
}

function ConfirmationBanner({ appointmentNumber }: { appointmentNumber: number }) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-emerald-700">
        Your appointment number
      </p>
      <p className="mt-3 text-6xl font-black text-emerald-800">
        {formatAppointmentNumber(appointmentNumber)}
      </p>
    </section>
  );
}

type QueueSummaryProps = {
  appointmentNumber: number;
  currentQueueNumber: number;
  patientsAhead: number;
};

function QueueSummary({
  appointmentNumber,
  currentQueueNumber,
  patientsAhead,
}: QueueSummaryProps) {
  return (
    <div className="mt-6 grid gap-4 rounded-2xl bg-blue-50 p-5 sm:grid-cols-3">
      <InfoItem
        label="Your Number"
        value={formatAppointmentNumber(appointmentNumber)}
      />
      <InfoItem
        label="Current Number"
        value={formatAppointmentNumber(currentQueueNumber)}
      />
      <InfoItem
        label="Queue"
        value={`${patientsAhead} patient${patientsAhead === 1 ? "" : "s"} ahead of you`}
      />
    </div>
  );
}

type VideoCallActionProps = {
  isJoining: boolean;
  onJoin: () => void;
};

function VideoCallAction({ isJoining, onJoin }: VideoCallActionProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-slate-900">Ready to join?</p>
        <p className="text-xs text-slate-600">
          Your meeting room opens 10 minutes before the scheduled time.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void onJoin()}
        disabled={isJoining}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        <Video className="h-4 w-4" />
        {isJoining ? "Starting..." : "Join Video Consultation"}
      </button>
    </div>
  );
}

type AppointmentActionsProps = {
  canReschedule: boolean;
  onReschedule: () => void;
};

function AppointmentActions({
  canReschedule,
  onReschedule,
}: AppointmentActionsProps) {
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <Link
        href="/appointments"
        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
      >
        View My Appointments
      </Link>
      <Link
        href="/appointments/search-doctor"
        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
      >
        Back to Appointments
      </Link>
      {canReschedule && (
        <button
          type="button"
          onClick={() => void onReschedule()}
          className="rounded-2xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700"
        >
          Reschedule
        </button>
      )}
    </div>
  );
}

function isToday(date: string) {
  return date === new Date().toISOString().slice(0, 10);
}
