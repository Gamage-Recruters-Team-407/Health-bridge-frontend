"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppointmentModuleShell from "@/components/appointment/AppointmentModuleShell";
import { appointmentService } from "@/services/appointmentService";
import { Doctor } from "@/types/appointment";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function SearchDoctorPage() {
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        const results = await appointmentService.searchDoctors(query);
        if (!cancelled) {
          setDoctors(results);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Unable to load doctors."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <AppointmentModuleShell
      title="Find a Doctor"
      subtitle="Search doctors, review specialties, and start your booking flow."
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Search by doctor name, specialization, or hospital
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search doctor or specialist"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </section>

      {loading ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          Loading doctors...
        </section>
      ) : error ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-rose-700">
            Unable to load doctors. Please try again.
          </h2>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
        </section>
      ) : doctors.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            No matching doctors found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another doctor name, specialization, or hospital.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {doctor.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-blue-700">
                    {doctor.specialization}
                  </p>
                  {doctor.hospital ? (
                    <p className="mt-2 text-sm text-slate-500">{doctor.hospital}</p>
                  ) : null}
                  {doctor.about ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {doctor.about}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {doctor.consultationFee ? (
                    <p>Fee: Rs. {doctor.consultationFee.toLocaleString()}</p>
                  ) : null}
                  {doctor.rating ? (
                    <p className="mt-1">
                      Rating: {doctor.rating} ({doctor.reviews || 0} reviews)
                    </p>
                  ) : null}
                  <p className="mt-1">
                    Visit Type:{" "}
                    {doctor.appointmentType === "VIDEO"
                      ? "Video Consultation"
                      : "In-person"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/appointments/book?doctorId=${doctor.id}`}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Book Appointment
                </Link>
                <Link
                  href={`/appointments/book?doctorId=${doctor.id}#availability`}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Availability
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </AppointmentModuleShell>
  );
}
