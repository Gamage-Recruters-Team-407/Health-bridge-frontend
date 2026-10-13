"use client";

import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import PatientDetailsForm from "./PatientDetailsForm";
import SessionSummary from "./SessionSummary";
import { useSessionBooking } from "../_hooks/useSessionBooking";

type SessionBookingClientProps = {
  sessionId: string;
};

export default function SessionBookingClient({
  sessionId,
}: SessionBookingClientProps) {
  const booking = useSessionBooking(sessionId);

  return (
    <AppointmentModuleShell
      title="Book Appointment"
      subtitle="Confirm the session and provide the patient details used for this booking."
    >
      {booking.isLoading ? (
        <LoadingState />
      ) : !booking.session ? (
        <SessionError message={booking.error || "Session not found."} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <SessionSummary session={booking.session} />
          <PatientDetailsForm
            error={booking.error}
            form={booking.form}
            isSubmitting={booking.isSubmitting}
            sessionStatus={booking.session.status}
            onBack={booking.goBack}
            onChange={booking.updateField}
            onSubmit={booking.submitBooking}
          />
        </div>
      )}
    </AppointmentModuleShell>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl border bg-white p-12 text-center text-sm text-slate-500">
      Loading booking details...
    </div>
  );
}

function SessionError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
      {message}
    </div>
  );
}
