"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Doctor } from "@/types/doctor";

export function useDoctors(autoLoad = true) {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(autoLoad);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get<Doctor[]>("/doctors");
			setDoctors(response.data);
			return response.data;
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to load doctors.");
			throw cause;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (autoLoad) queueMicrotask(() => void reload());
	}, [autoLoad, reload]);

	return { doctors, loading, error, reload };
}

export default useDoctors;
