// src/app/pharmacy/prescriptions/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function PrescriptionDetailPage() {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const router = useRouter();

    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) return;
            try {
                setLoading(true);
                const data = await prescriptionService.getPrescriptionById(id);
                if (!cancelled) setPrescription(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load prescription");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleDownload() {
        if (!prescription) return;
        try {
            setDownloading(true);
            const blob = await prescriptionService.downloadPrescription(prescription.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${prescription.prescriptionNumber}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Download failed");
        } finally {
            setDownloading(false);
        }
    }

    async function handleStatusChange(newStatus: Prescription["status"]) {
        if (!prescription) return;
        setActionError(null);
        setUpdating(true);
        try {
            await prescriptionService.updatePrescription(prescription.id, {
                status: newStatus,
            } as unknown as Parameters<typeof prescriptionService.updatePrescription>[1]);

            const refreshed = await prescriptionService.getPrescriptionById(prescription.id);
            setPrescription(refreshed);

            if (refreshed.status !== newStatus) {
                setActionError(
                    `Backend didn't apply the status change (still "${refreshed.status}"). A dedicated status update endpoint might be needed.`
                );
            }
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Status update failed");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="p-6 text-sm text-slate-400 flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                Loading prescription…
            </div>
        );
    }

    if (error || !prescription) {
        return (
            <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Couldn&apos;t load prescription: {error ?? "Not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                        ← Back to queue
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prescription verification</h1>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[prescription.status]}`}>
          {STATUS_LABELS[prescription.status]}
        </span>
            </div>

            {actionError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
                    ⚠️ {actionError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200/80 lg:col-span-2">
                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Prescription details</h2>

                    <div className="mb-5 flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                            {prescription.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 text-sm">{prescription.patientName}</p>
                            <p className="text-xs text-slate-500">
                                Patient ID: {prescription.patientId} &middot; Phone: {prescription.patientPhone}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                        <Field label="Rx ID" value={prescription.prescriptionNumber} />
                        <Field label="Prescribing Doctor" value={prescription.doctorName} />
                        <Field
                            label="Issue Date"
                            value={new Date(prescription.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        />
                        <Field
                            label="Valid Until"
                            value={new Date(prescription.validUntil).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        />
                    </div>

                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Medications</h3>
                    <div className="overflow-hidden rounded-lg border border-slate-100">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-4 py-2.5 font-medium">Drug</th>
                                <th className="px-4 py-2.5 font-medium">Dosage</th>
                                <th className="px-4 py-2.5 font-medium">Frequency</th>
                                <th className="px-4 py-2.5 font-medium">Duration</th>
                                <th className="px-4 py-2.5 font-medium text-right">Qty</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                            {prescription.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2.5 font-medium text-slate-900">{item.medicineName}</td>
                                    <td className="px-4 py-2.5">{item.dosage}</td>
                                    <td className="px-4 py-2.5">{item.frequency}</td>
                                    <td className="px-4 py-2.5">{item.duration}</td>
                                    <td className="px-4 py-2.5 text-right font-medium">{item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {prescription.notes && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                            <span className="font-medium text-slate-700">Notes: </span>
                            {prescription.notes}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl bg-white p-5 text-center shadow-sm border border-slate-200/80">
                        <p className="mb-3 text-2xl" aria-hidden>📷</p>
                        <p className="mb-3 text-xs font-medium text-slate-700">Scan QR to verify</p>
                        <input
                            type="text"
                            placeholder="Enter Rx ID manually"
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-400"
                        />
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200/80">
                        <h3 className="mb-1 text-sm font-semibold text-slate-900">Actions</h3>
                        <p className="mb-3 text-xs text-slate-400">
                            Update prescription status and dispense medicines.
                        </p>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => void handleDownload()}
                                disabled={downloading}
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {downloading ? "Downloading…" : "Download prescription"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleStatusChange("completed")}
                                disabled={updating || prescription.status !== "active"}
                                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 transition"
                            >
                                {updating ? "Working…" : "Verify and dispense"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleStatusChange("cancelled")}
                                disabled={updating || prescription.status !== "active"}
                                className="w-full rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] text-slate-400">{label}</p>
            <p className="font-medium text-slate-800 text-xs mt-0.5">{value}</p>
        </div>
    );
}