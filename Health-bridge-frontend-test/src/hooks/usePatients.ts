"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import type { PatientProfile, UpdatePatientProfile } from "@/types/patient";

export function usePatients(autoLoad = true) {
	const [patient, setPatient] = useState<PatientProfile | null>(null);
	const [loading, setLoading] = useState(autoLoad);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get<PatientProfile>("/users/profile");
			setPatient(response.data);
			return response.data;
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to load patient profile.");
			throw cause;
		} finally {
			setLoading(false);
		}
	}, []);

	const updatePatient = useCallback(async (payload: UpdatePatientProfile) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.put<PatientProfile>("/users/profile", payload);
			setPatient(response.data);
			return response.data;
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to update patient profile.");
			throw cause;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (autoLoad) queueMicrotask(() => void reload());
	}, [autoLoad, reload]);

	return { patient, loading, error, reload, updatePatient };
}

export default usePatients;
