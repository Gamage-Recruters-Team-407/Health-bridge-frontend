"use client";

import { useCallback, useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import {
  Appointment,
  AppointmentFilters,
  AppointmentFormValues,
  AppointmentSummary,
} from "@/types/appointment";

const emptySummary: AppointmentSummary = {
  upcoming: 0,
  completed: 0,
  cancelled: 0,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export function useAppointments(initialFilters: AppointmentFilters = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<AppointmentSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);

  const loadAppointments = useCallback(
    async (nextFilters: AppointmentFilters) => {
      try {
        setLoading(true);
        setError("");
        const [appointmentData, summaryData] = await Promise.all([
          appointmentService.getAppointments(nextFilters),
          appointmentService.getSummary(),
        ]);
        setAppointments(appointmentData);
        setSummary(summaryData);
      } catch (error: unknown) {
        setError(
          getErrorMessage(error, "Unable to load appointments. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAppointments(filters);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [filters, loadAppointments]);

  const bookAppointment = async (values: AppointmentFormValues) => {
    const appointment = await appointmentService.createAppointment(values);
    await loadAppointments(filters);
    return appointment;
  };

  const rescheduleAppointment = async (
    appointmentId: string,
    values: AppointmentFormValues
  ) => {
    const appointment = await appointmentService.rescheduleAppointment(
      appointmentId,
      values
    );
    await loadAppointments(filters);
    return appointment;
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    const appointment = await appointmentService.cancelAppointment({
      appointmentId,
      reason,
    });
    await loadAppointments(filters);
    return appointment;
  };

  return {
    appointments,
    summary,
    loading,
    error,
    filters,
    setFilters,
    reload: () => loadAppointments(filters),
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
  };
}
