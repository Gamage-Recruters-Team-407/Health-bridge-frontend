"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Appointment, AppointmentFilters, AppointmentInput } from "@/types/appointment";

export function useAppointments(filters: AppointmentFilters = {}, autoLoad = true) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(autoLoad);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get<Appointment[]>("/appointments", { params: filters });
			setAppointments(response.data);
			return response.data;
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to load appointments.");
			throw cause;
		} finally {
			setLoading(false);
		}
	}, [filters]);

	const createAppointment = useCallback(async (payload: AppointmentInput) => {
		const response = await api.post<Appointment>("/appointments", payload);
		setAppointments((items) => [...items, response.data]);
		return response.data;
	}, []);

	const cancelAppointment = useCallback(async (id: string) => {
		const response = await api.patch<Appointment>(`/appointments/${id}/cancel`);
		setAppointments((items) => items.map((item) => (item.id === id ? response.data : item)));
		return response.data;
	}, []);

	useEffect(() => {
		if (autoLoad) queueMicrotask(() => void reload());
	}, [autoLoad, reload]);

	return { appointments, loading, error, reload, createAppointment, cancelAppointment };
}

export default useAppointments;
