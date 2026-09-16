"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function DownloadPrescriptionPage() {
  const params = useParams();
  const id = params.id as string;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // const blob = await prescriptionService.downloadPrescription(id);
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `prescription-${id}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      
      // Mock download for testing
      setTimeout(() => {
        alert("PDF Downloaded successfully! (Mock)");
        setDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download prescription.");
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl flex-col items-center justify-center px-3 py-5 sm:px-5">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-3xl">📄</div>
          <h1 className="mt-5 text-xl font-bold text-slate-950">Download Prescription</h1>
          <p className="mt-2 text-sm text-slate-500">Your prescription will be downloaded as a secure PDF document.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={handleDownload} disabled={downloading} className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              {downloading ? "Downloading..." : "Download PDF"}
            </button>
            <Link href={`/prescriptions/${id}`} className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link>
          </div>
        </div>
      </div>
    </main>
  );
}