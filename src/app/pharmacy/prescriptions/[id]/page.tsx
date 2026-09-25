// src/app/pharmacy/prescriptions/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, RefreshCw, CheckCircle, XCircle, ArrowLeft, User, FileText, Calendar } from "lucide-react";
import { prescriptionService } from "@/services/prescriptionService";
import type { Prescription } from "@/types/prescription";

const STATUS_LABELS: Record<string, string> = {
    ACTIVE: "Active",
    COMPLETED: "Dispensed",
    CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-amber-50 text-amber-700 border border-amber-200/50",
    COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    CANCELLED: "bg-rose-50 text-rose-700 border border-rose-200/50",
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
        let isMounted = true;

        async function loadPrescription() {
            if (!id) return;
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }
                const data = await prescriptionService.getPrescriptionById(id);
                const unwrapped =
                    (data as unknown as { data?: Prescription })?.data || (data as unknown as Prescription);

                if (isMounted) {
                    setPrescription(unwrapped);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load prescription details");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadPrescription();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleUpdateStatus = async (newStatus: "COMPLETED" | "CANCELLED") => {
        if (!id || !prescription) return;
        try {
            setUpdating(true);
            setActionError(null);
            await prescriptionService.updatePrescription(id, {
                status: newStatus,
            } as unknown as Parameters<typeof prescriptionService.updatePrescription>[1]);

            const updated = await prescriptionService.getPrescriptionById(id);
            const unwrapped =
                (updated as unknown as { data?: Prescription })?.data || (updated as unknown as Prescription);
            setPrescription(unwrapped);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Status update failed");
        } finally {
            setUpdating(false);
        }
    };

    const handleDownload = async () => {
        if (!id) return;
        try {
            setDownloading(true);
            const blob = await prescriptionService.downloadPrescription(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Prescription-${id.slice(0, 8)}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not download prescription file");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 p-6 flex items-center justify-center text-xs text-slate-500 gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                Loading prescription details...
            </div>
        );
    }

    if (error || !prescription) {
        return (
            <div className="m-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-xs text-red-700 shadow-sm space-y-2">
                <p className="font-semibold">Failed to load prescription</p>
                <p>{error ?? "Prescription not found"}</p>
                <button
                    type="button"
                    onClick={() => router.push("/pharmacy/prescriptions")}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                >
                    Return to Queue
                </button>
            </div>
        );
    }

    const rawPrescription = prescription as unknown as Record<string, unknown>;
    const dateVal =
        rawPrescription.date || rawPrescription.createdAt || rawPrescription.prescriptionDate;
    const formattedDate = dateVal
        ? new Date(String(dateVal)).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "Not specified";

    const currentStatus = String(prescription.status || "ACTIVE").toUpperCase();
    const medicinesList = Array.isArray(rawPrescription.medicines)
        ? (rawPrescription.medicines as Array<Record<string, unknown>>)
        : Array.isArray(rawPrescription.items)
            ? (rawPrescription.items as Array<Record<string, unknown>>)
            : [];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => router.push("/pharmacy/prescriptions")}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 mb-2 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Prescription Queue
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Prescription #{prescription.id?.slice(0, 8).toUpperCase()}
                        </h1>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                STATUS_STYLES[currentStatus] || "bg-slate-100 text-slate-600"
                            }`}
                        >
              {STATUS_LABELS[currentStatus] || currentStatus}
            </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Reference ID: {prescription.id}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void handleDownload()}
                        disabled={downloading}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" /> {downloading ? "Downloading..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 shadow-sm">
                    {actionError}
                </div>
            )}

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Information & Medicines */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Patient & Doctor Meta */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" /> Consultation Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                            <div>
                                <p className="text-slate-400">Patient Identifier</p>
                                <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                                    {String(rawPrescription.patientId || prescription.patientId || "—")}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400">Doctor / Clinician</p>
                                <p className="font-semibold text-slate-800 mt-0.5">
                                    {String(rawPrescription.doctorName || rawPrescription.prescribedBy || "Dr. Assigned")}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400">Prescription Date</p>
                                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Medicines List */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" /> Prescribed Medications
                        </h2>

                        {medicinesList.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">
                                No specific medicines attached to this record.
                            </p>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {medicinesList.map((med, index) => (
                                    <div key={index} className="py-3 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {String(med.name || med.medicineName || `Medication #${index + 1}`)}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {String(med.dosage || med.strength || "Standard dosage")} •{" "}
                                                {String(med.frequency || "As directed")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">
                        Qty: {String(med.quantity || 1)}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {Boolean(rawPrescription.instructions) && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs border border-slate-200/60">
                                <span className="font-bold text-slate-700 block mb-1">Doctor&apos;s Instructions:</span>
                                <p className="text-slate-600 leading-relaxed">{String(rawPrescription.instructions)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Pharmacy Dispensing Actions
                        </h2>

                        <div className="space-y-2.5">
                            <button
                                type="button"
                                disabled={updating || currentStatus === "COMPLETED"}
                                onClick={() => void handleUpdateStatus("COMPLETED")}
                                className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {currentStatus === "COMPLETED" ? "Prescription Dispensed" : "Mark as Dispensed"}
                            </button>

                            <button
                                type="button"
                                disabled={updating || currentStatus === "CANCELLED"}
                                onClick={() => void handleUpdateStatus("CANCELLED")}
                                className="w-full py-2.5 px-4 border border-rose-200 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" /> Cancel Prescription
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}