"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { prescriptionService } from "@/services/prescriptionService";
import type { Prescription } from "@/types/prescription";

const STATUS_STYLES: Record<Prescription["status"], string> = {
    active: "bg-blue-50 text-blue-700",
    completed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<Prescription["status"], string> = {
    active: "Active",
    completed: "Dispensed",
    cancelled: "Cancelled",
};

type FilterTab = "all" | Prescription["status"];

export default function PrescriptionQueuePage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<FilterTab>("all");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const data = await prescriptionService.getAllPrescriptions();
                if (!cancelled) setPrescriptions(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load prescriptions");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
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
                p.prescriptionNumber.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [prescriptions, tab, search]);

    return (
        <div>
            <h1 className="mb-1 text-2xl font-semibold text-slate-900">Prescription queue</h1>
            <p className="mb-6 text-sm text-slate-500">Review, verify, and dispense patient prescriptions.</p>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Couldn&apos;t load prescriptions: {error}
                </div>
            )}

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard label="Active" value={loading ? "…" : counts.active} tone="amber" />
                <SummaryCard label="Dispensed" value={loading ? "…" : counts.completed} tone="green" />
                <SummaryCard label="Cancelled" value={loading ? "…" : counts.cancelled} tone="red" />
            </div>

            {/* Search + Tabs */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
                    {(["all", "active", "completed", "cancelled"] as FilterTab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${
                                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t === "all" ? "All" : STATUS_LABELS[t]}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patient or Rx ID"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 sm:w-64"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                        <th className="px-5 py-3 font-medium">Patient</th>
                        <th className="px-5 py-3 font-medium">Rx ID</th>
                        <th className="px-5 py-3 font-medium">Prescribed by</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                                Loading prescriptions…
                            </td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                                No prescriptions found.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-900">{p.patientName}</td>
                                <td className="px-5 py-3 text-slate-600">{p.prescriptionNumber}</td>
                                <td className="px-5 py-3 text-slate-600">{p.doctorName}</td>
                                <td className="px-5 py-3 text-slate-500">
                                    {new Date(p.date).toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}
                                </td>
                                <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <Link
                                        href={`/pharmacy/prescriptions/${p.id}`}
                                        className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                                    >
                                        View
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

function SummaryCard({ label, value, tone }: { label: string; value: number | string; tone: "amber" | "green" | "red" }) {
    const dot = { amber: "bg-amber-400", green: "bg-green-400", red: "bg-red-400" }[tone];
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
                <span className="text-sm text-slate-500">{label}</span>
            </div>
            <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
    );
}