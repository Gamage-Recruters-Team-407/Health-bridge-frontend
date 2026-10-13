"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { telemedicineApi } from "@/features/telemedicine/api/telemedicineApi";
import { getApiErrorMessage } from "@/lib/axios";
import { appointmentService } from "@/services/appointmentService";
import type { Appointment, DoctorSession } from "@/types/appointment";

const ACTIVE_APPOINTMENT_STATUSES = ["BOOKED", "UPCOMING"];

export function useAppointmentDetails(appointmentId: string) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [availableSessions, setAvailableSessions] = useState<DoctorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [error, setError] = useState("");

  const loadAppointment = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(result);
    } catch (loadError) {
      setError(toErrorMessage(loadError, "Unable to load appointment."));
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAppointment(), 0);
    return () => window.clearTimeout(timer);
  }, [loadAppointment]);

  const openReschedule = async () => {
    setError("");

    try {
      const sessions = await appointmentService.searchSessions();
      setAvailableSessions(
        sessions.filter(
          (session) =>
            session.status === "AVAILABLE" &&
            session.sessionId !== appointment?.sessionId,
        ),
      );
      setIsRescheduleOpen(true);
    } catch (sessionError) {
      setError(toErrorMessage(sessionError, "Unable to load sessions."));
    }
  };

  const closeReschedule = () => setIsRescheduleOpen(false);

  const reschedule = async (sessionId: string) => {
    setError("");

    try {
      const updatedAppointment = await appointmentService.rescheduleAppointment(
        appointmentId,
        sessionId,
      );
      setAppointment(updatedAppointment);
      closeReschedule();
    } catch (rescheduleError) {
      setError(toErrorMessage(rescheduleError, "Unable to reschedule."));
    }
  };

  const joinVideoCall = async () => {
    if (!appointment) return;

    setIsJoiningCall(true);
    setError("");

    try {
      let telemedicineSession;

      try {
        telemedicineSession =
          await telemedicineApi.getSessionByAppointmentId(appointmentId);
      } catch (lookupError) {
        const sessionDoesNotExist =
          axios.isAxiosError(lookupError) && lookupError.response?.status === 404;

        if (!sessionDoesNotExist) throw lookupError;

        telemedicineSession = await telemedicineApi.createSession({
          appointmentId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          consultationType: "VIDEO",
          scheduledStartTime: `${appointment.date}T${appointment.sessionTime}`,
        });
      }

      router.push(`/telemedicine/consultation/${telemedicineSession.id}`);
    } catch (joinError) {
      const responseBody = axios.isAxiosError(joinError)
        ? joinError.response?.data
        : undefined;

      setError(
        typeof responseBody === "string" && responseBody
          ? responseBody
          : getApiErrorMessage(
              joinError,
              "Unable to start the video consultation. Please try again.",
            ),
      );
    } finally {
      setIsJoiningCall(false);
    }
  };

  const isActive = appointment
    ? ACTIVE_APPOINTMENT_STATUSES.includes(appointment.status)
    : false;

  const patientsAhead = appointment
    ? Math.max(
        appointment.appointmentNumber - appointment.currentQueueNumber - 1,
        0,
      )
    : 0;

  return {
    appointment,
    availableSessions,
    error,
    isActive,
    isJoiningCall,
    isLoading,
    isRescheduleOpen,
    patientsAhead,
    closeReschedule,
    joinVideoCall,
    openReschedule,
    reschedule,
  };
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
