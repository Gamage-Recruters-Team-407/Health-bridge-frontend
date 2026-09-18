"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { prescriptionService } from "@/services/prescriptionService";
import { Prescription } from "@/types/prescription";
import { Download, ArrowLeft, FileText } from "lucide-react";

export default function DownloadPrescriptionPage() {
  const params = useParams();
  const id = params.id as string;
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<Prescription | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await prescriptionService.getPrescriptionById(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching prescription:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await prescriptionService.downloadPrescription(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prescription-${data?.prescriptionNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download prescription.");
    } finally {
      setDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading prescription data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">Download Prescription</h1>
        <p className="mt-2 text-sm text-slate-500">
          Prescription: <span className="font-semibold text-slate-700">{data.prescriptionNumber}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Your prescription will be downloaded as a PDF document
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <Link
            href={`/prescriptions/${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}