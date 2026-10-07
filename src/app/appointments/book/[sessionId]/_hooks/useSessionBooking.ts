"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { appointmentService } from "@/services/appointmentService";
import type { BookingInput, DoctorSession } from "@/types/appointment";

type PatientProfile = {
  fullName?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export function useSessionBooking(sessionId: string) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [session, setSession] = useState<DoctorSession | null>(null);
  const [form, setForm] = useState<BookingInput>(() => createEmptyForm(sessionId));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      const bookingPath = `/appointments/book/${sessionId}`;
      router.replace(`/login?redirect=${encodeURIComponent(bookingPath)}`);
      return;
    }

    let isActive = true;

    async function loadBookingDetails() {
      try {
        const [sessionDetails, profile] = await Promise.all([
          appointmentService.getSession(sessionId),
          loadPatientProfile(),
        ]);

        if (!isActive) return;

        setSession(sessionDetails);
        setForm(createFormFromProfile(sessionId, profile));
      } catch (loadError) {
        if (isActive) {
          setError(toErrorMessage(loadError, "Unable to load booking details."));
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadBookingDetails();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, router, sessionId]);

  const updateField = (field: keyof BookingInput, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const submitBooking = async () => {
    setError("");

    const validationError = validateBookingForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const appointment = await appointmentService.book(form);
      router.push(`/appointments/${appointment.appointmentId}?confirmed=1`);
    } catch (submitError) {
      setError(
        toErrorMessage(
          submitError,
          "Unable to complete the booking. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    form,
    isLoading,
    isSubmitting,
    session,
    goBack: router.back,
    submitBooking,
    updateField,
  };
}

async function loadPatientProfile(): Promise<PatientProfile> {
  try {
    return await api.get<PatientProfile>("/users/profile");
  } catch {
    return {};
  }
}

function createEmptyForm(sessionId: string): BookingInput {
  return {
    sessionId,
    patientName: "",
    patientPhone: "",
    nicOrPassport: "",
    email: "",
    address: "",
  };
}

function createFormFromProfile(
  sessionId: string,
  profile: PatientProfile,
): BookingInput {
  return {
    sessionId,
    patientName: profile.fullName ?? "",
    patientPhone: profile.phoneNumber ?? profile.phone ?? "",
    nicOrPassport: "",
    email: profile.email ?? "",
    address: profile.address ?? "",
  };
}

function validateBookingForm(form: BookingInput): string | null {
  if (
    !form.patientName.trim() ||
    !form.patientPhone.trim() ||
    !form.nicOrPassport.trim()
  ) {
    return "Full name, phone, and NIC / passport are required.";
  }

  if (!/^[+0-9() -]{7,20}$/.test(form.patientPhone)) {
    return "Please enter a valid phone number.";
  }

  return null;
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
