"use client";
import { useCallback } from "react";
import AvailabilityCalendar from "@/features/doctor/components/AvailabilityCalendar";
import LoadingState from "@/features/doctor/components/LoadingState";
import PageHeader from "@/features/doctor/components/PageHeader";
import { useDoctorData } from "@/features/doctor/hooks/useDoctorData";
import { getAvailability, updateAvailability } from "@/features/doctor/services/doctorService";
export default function DoctorSchedulePage() { const loader = useCallback(() => getAvailability(), []); const { data, loading, error } = useDoctorData(loader); return <><PageHeader eyebrow="Availability" title="Schedule management" description="Set clinic hours and keep your availability current for bookings." />{loading ? <LoadingState /> : error || !data ? <p className="text-sm text-rose-600">{error}</p> : <AvailabilityCalendar slots={data} onChange={async (slots) => { await updateAvailability(slots); }} />}</>; }
