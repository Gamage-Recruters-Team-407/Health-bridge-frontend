"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import { useAppointments } from "@/hooks/useAppointments";
import { appointmentService } from "@/services/appointmentService";
import { AppointmentFormValues, Doctor } from "@/types/appointment";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { bookAppointment } = useAppointments({}, false);

  useEffect(() => {
    let cancelled = false;

    const loadDoctor = async () => {
      if (!doctorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await appointmentService.getDoctorById(doctorId);
        if (!cancelled) {
          setDoctor(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Unable to load doctor details."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDoctor();

    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      setSubmitting(true);
      setError("");
      const appointment = await bookAppointment(values);
      window.alert("Appointment booked successfully.");
      router.push(`/appointments/${appointment.id}`);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Unable to book appointment."));
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppointmentModuleShell
      title="Book Appointment"
      subtitle="Choose a valid date, review availability, and confirm your visit."
    >
      {!doctorId ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Select a doctor to continue
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Start from Find a Doctor so the booking form can use the selected doctor.
          </p>
          <button
            type="button"
            onClick={() => router.push("/appointments/search-doctor")}
            className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Find a Doctor
          </button>
        </section>
      ) : loading ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          Loading booking form...
        </section>
      ) : error && !doctor ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-rose-700">
            Unable to load doctor details. Please try again.
          </h2>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
        </section>
      ) : doctor ? (
        <>
          {error ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {error}
            </section>
          ) : null}
          <div id="availability">
            <AppointmentForm
              doctor={doctor}
              mode="book"
              submitLabel="Confirm Appointment"
              isSubmitting={submitting}
              helperText="Available time slots update based on the selected doctor and date. Unavailable times cannot be selected."
              loadAvailability={(date) =>
                appointmentService.getDoctorAvailability(doctor.id, date)
              }
              onBack={() => router.push("/appointments/search-doctor")}
              onSubmit={handleSubmit}
            />
          </div>
        </>
      ) : null}
    </AppointmentModuleShell>
  );
}
