"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import QRCodeDisplay from "@/components/prescription/QRCodeDisplay";
import { Prescription } from "@/types/prescription";
import { Download, ArrowLeft, Pill, Calendar, Clock } from "lucide-react";

export default function PrescriptionDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await prescriptionService.getPrescriptionById(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching prescription:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-500">Loading prescription details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">Prescription not found</p>
          <Link href="/prescriptions" className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Prescriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Back Button */}
      <Link
        href="/prescriptions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {data.prescriptionNumber}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  data.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {data.status}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Prescription Details</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>Valid until: {new Date(data.validUntil).toLocaleDateString()}</span>
            </div>
          </div>
          <Link
            href={`/prescriptions/${id}/download`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Medicines */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900">
                Prescribed Medicines ({data.items.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100 p-6">
              {data.items.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 py-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.medicineName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.dosage} • {item.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-100">
                      Qty: {item.quantity}
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">{item.duration}</p>
                      <p className="text-xs font-medium text-slate-600">{item.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-6">
              <h2 className="text-sm font-bold text-blue-900">Doctor's Notes</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{data.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Verification QR Code</h2>
            <p className="mt-1 text-[11px] text-slate-500">Scan at pharmacy to validate</p>
            <div className="mt-4 flex justify-center rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <QRCodeDisplay value={data.qrCodeData || data.prescriptionNumber} size={140} />
            </div>
          </div>

          {/* Patient Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Patient Information</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{data.patientName}</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Phone</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{data.patientPhone}</p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Prescribed By</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{data.doctorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}