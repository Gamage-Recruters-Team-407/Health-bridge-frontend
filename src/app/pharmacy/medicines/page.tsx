"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllMedicines } from "@/services/pharmacyService";
import type { Medicine } from "@/types/pharmacy";

export default function MedicinesListPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        getAllMedicines()
            .then((data) => !cancelled && setMedicines(data))
            .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load medicines"))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Medicines</h1>
                <Link href="/pharmacy/medicines/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    + Add Medicine
                </Link>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Code</th>
                        <th className="px-5 py-3 font-medium">Category</th>
                        <th className="px-5 py-3 font-medium">Unit Price</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading…</td></tr>
                    ) : medicines.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No medicines yet.</td></tr>
                    ) : (
                        medicines.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-900">{m.name}</td>
                                <td className="px-5 py-3 text-slate-600">{m.medicineCode}</td>
                                <td className="px-5 py-3 text-slate-600">{m.category ?? "—"}</td>
                                <td className="px-5 py-3 text-slate-600">${m.unitPrice?.toFixed(2)}</td>
                                <td className="px-5 py-3 text-right">
                                    <Link href={`/pharmacy/medicines/${m.id}`} className="text-xs font-medium text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}