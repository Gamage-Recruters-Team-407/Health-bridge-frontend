// src/app/pharmacy/prescriptions/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { getPharmacyPrescriptions } from "@/services/pharmacyService";

interface RawPrescriptionData {
    id?: string;
    prescriptionNumber?: string;
    rxId?: string;
    patientName?: string;
    recipientName?: string;
    doctorName?: string;
    doctor?: {
        name?: string;
    };
    date?: string;
    createdAt?: string;
    status?: string;
    items?: unknown[];
    [key: string]: unknown;
}

type PrescriptionQueueItem = {
    id: string;
    prescriptionNumber: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: "active" | "completed" | "cancelled";
    itemsCount: number;
};

const STATUS_STYLES: Record<string, string> = {
    active: "bg-blue-50 text-blue-700 border border-blue-200/50",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_LABELS: Record<string, string> = {
    active: "Active",
    completed: "Dispensed",
    cancelled: "Cancelled",
};

type FilterTab = "all" | "active" | "completed" | "cancelled";

export default function PrescriptionQueuePage() {
    const [prescriptions, setPrescriptions] = useState<PrescriptionQueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<FilterTab>("all");

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const res = await getPharmacyPrescriptions();

                if (!isMounted) return;

                let rawList: RawPrescriptionData[] = [];
                if (Array.isArray(res)) {
                    rawList = res as unknown as RawPrescriptionData[];
                } else if (res && typeof res === "object" && "data" in res) {
                    rawList = (res as { data: unknown }).data as RawPrescriptionData[];
                }

                const formatted: PrescriptionQueueItem[] = rawList.map((p, idx) => {
                    const rawStatus = (p.status || "active").toLowerCase();
                    let statusVal: "active" | "completed" | "cancelled" = "active";
                    if (rawStatus === "completed" || rawStatus === "dispensed" || rawStatus === "delivered") {
                        statusVal = "completed";
                    } else if (rawStatus === "cancelled" || rawStatus === "rejected") {
                        statusVal = "cancelled";
                    }

                    return {
                        id: p.id || `rx-${idx}`,
                        prescriptionNumber: p.prescriptionNumber || p.rxId || `RX-${idx + 100}`,
                        patientName: p.patientName || p.recipientName || "Registered Patient",
                        doctorName: p.doctorName || (p.doctor?.name ? `Dr. ${p.doctor.name}` : "Assigned Doctor"),
                        date: p.date || p.createdAt || new Date().toISOString(),
                        status: statusVal,
                        itemsCount: Array.isArray(p.items) ? p.items.length : 1,
                    };
                });

                setPrescriptions(formatted);
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load prescriptions from backend");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleRefresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getPharmacyPrescriptions();

            let rawList: RawPrescriptionData[] = [];
            if (Array.isArray(res)) {
                rawList = res as unknown as RawPrescriptionData[];
            } else if (res && typeof res === "object" && "data" in res) {
                rawList = (res as { data: unknown }).data as RawPrescriptionData[];
            }

            const formatted: PrescriptionQueueItem[] = rawList.map((p, idx) => {
                const rawStatus = (p.status || "active").toLowerCase();
                let statusVal: "active" | "completed" | "cancelled" = "active";
                if (rawStatus === "completed" || rawStatus === "dispensed" || rawStatus === "delivered") {
                    statusVal = "completed";
                } else if (rawStatus === "cancelled" || rawStatus === "rejected") {
                    statusVal = "cancelled";
                }

                return {
                    id: p.id || `rx-${idx}`,
                    prescriptionNumber: p.prescriptionNumber || p.rxId || `RX-${idx + 100}`,
                    patientName: p.patientName || p.recipientName || "Registered Patient",
                    doctorName: p.doctorName || (p.doctor?.name ? `Dr. ${p.doctor.name}` : "Assigned Doctor"),
                    date: p.date || p.createdAt || new Date().toISOString(),
                    status: statusVal,
                    itemsCount: Array.isArray(p.items) ? p.items.length : 1,
                };
            });

            setPrescriptions(formatted);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load prescriptions from backend");
        } finally {
            setLoading(false);
        }
    }, []);

    const counts = useMemo(
        () => ({
            active: prescriptions.filter((p) => p.status === "active").length,
            completed: prescriptions.filter((p) => p.status === "completed").length,
            cancelled: prescriptions.filter((p) => p.status === "cancelled").length,
        }),
        [prescriptions]
    );

    const filtered = useMemo(() => {
        return prescriptions.filter((p) => {
            const matchesTab = tab === "all" || p.status === tab;
            const matchesSearch =
                !search ||
                p.patientName.toLowerCase().includes(search.toLowerCase()) ||
                p.prescriptionNumber.toLowerCase().includes(search.toLowerCase()) ||
                p.doctorName.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [prescriptions, tab, search]);

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prescription queue</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Review, verify, and dispense doctor prescriptions.</p>
                </div>
                <button
                    type="button"
                    onClick={() => void handleRefresh()}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                    Failed to load prescriptions: {error}
                </div>
            )}

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200/80">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="text-xs font-medium text-slate-500">Active</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "…" : counts.active}</div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200/80">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-medium text-slate-500">Dispensed</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "…" : counts.completed}</div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200/80">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="text-xs font-medium text-slate-500">Cancelled</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{loading ? "…" : counts.cancelled}</div>
                </div>
            </div>

            {/* Filter Tabs + Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-1 bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto text-xs">
                    {(["all", "active", "completed", "cancelled"] as FilterTab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`px-3.5 py-1.5 font-medium capitalize rounded-lg transition-all ${
                                tab === t
                                    ? "bg-white text-slate-900 shadow-sm font-semibold"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {t === "all" ? "All" : STATUS_LABELS[t]}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search patient, Rx ID, doctor..."
                        className="w-full pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Prescription Queue Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200/80">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-3.5 font-medium">Patient</th>
                            <th className="px-5 py-3.5 font-medium">Rx ID</th>
                            <th className="px-5 py-3.5 font-medium">Prescribed by</th>
                            <th className="px-5 py-3.5 font-medium">Date</th>
                            <th className="px-5 py-3.5 font-medium text-center">Status</th>
                            <th className="px-5 py-3.5 font-medium text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                    Loading prescriptions…
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                    No prescriptions found. Once a doctor submits a prescription, it will appear here.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                                    <td className="px-5 py-3.5 font-medium text-slate-900">{p.patientName}</td>
                                    <td className="px-5 py-3.5 font-mono text-slate-600">{p.prescriptionNumber}</td>
                                    <td className="px-5 py-3.5 text-slate-700">{p.doctorName}</td>
                                    <td className="px-5 py-3.5 text-slate-400">
                                        {new Date(p.date).toLocaleString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[p.status]}`}>
                        {STATUS_LABELS[p.status]}
                      </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Link
                                            href={`/pharmacy/prescriptions/${p.id}`}
                                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition"
                                        >
                                            View & Dispense
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}