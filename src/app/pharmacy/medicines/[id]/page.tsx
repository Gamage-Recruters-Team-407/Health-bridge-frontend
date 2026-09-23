"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMedicineById } from "@/services/pharmacyService";
import type { Medicine } from "@/types/pharmacy";
import MedicineForm from "@/components/pharmacy/MedicineForm";

export default function EditMedicinePage() {
    const { id } = useParams<{ id: string }>();
    const [medicine, setMedicine] = useState<Medicine | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const data = await getMedicineById(id);
                if (!cancelled) setMedicine(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load medicine");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (id) load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <div>
            <h1 className="mb-1 text-2xl font-semibold text-slate-900">Add/Edit Medicine</h1>
            <p className="mb-6 text-sm text-slate-500">Create, update, and manage medicine records</p>
            {loading ? (
                <p className="text-sm text-slate-400">Loading…</p>
            ) : error || !medicine ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error ?? "Medicine not found"}
                </div>
            ) : (
                <MedicineForm mode="edit" initialMedicine={medicine} />
            )}
        </div>
    );
}