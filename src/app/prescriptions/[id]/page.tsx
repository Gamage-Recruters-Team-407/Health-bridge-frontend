"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QRCodeDisplay from "@/components/prescription/QRCodeDisplay";

export default function PrescriptionDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData({
      id, prescriptionNumber: "RX-2026-089", date: "19 Aug 2026", status: "active",
      patientName: "Ava Thompson", patientPhone: "+94 77 123 4567", doctorName: "Dr. Elena Park",
      validUntil: "19 Sep 2026", notes: "Take medicines after meals. Avoid alcohol.",
      items: [
        { id: "1", medicineName: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", quantity: 30, instructions: "Take in the morning" },
        { id: "2", medicineName: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days", quantity: 60, instructions: "Take with meals" },
      ],
    });
  }, [id]);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <Link href="/prescriptions" className="text-xs font-semibold text-blue-600 hover:text-blue-700">← Back to Prescriptions</Link>

        <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{data.prescriptionNumber}</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Prescription Details</h1>
              <p className="mt-2 text-sm text-slate-500">Issued on {data.date} • Valid until {data.validUntil}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${data.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{data.status.toUpperCase()}</span>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 space-y-5">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-950">Prescribed Medicines ({data.items.length})</h2>
              <div className="space-y-3">
                {data.items.map((item: any, index: number) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.medicineName}</p>
                          <p className="text-xs text-slate-500">{item.dosage} • {item.frequency}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Qty: {item.quantity}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                      <div><p className="text-[10px] font-semibold uppercase text-slate-400">Duration</p><p className="text-xs font-semibold text-slate-700">{item.duration}</p></div>
                      <div><p className="text-[10px] font-semibold uppercase text-slate-400">Instructions</p><p className="text-xs font-semibold text-slate-700">{item.instructions}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-950">Doctor's Notes</h2>
              <p className="text-sm leading-6 text-slate-600">{data.notes}</p>
            </section>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <h2 className="text-sm font-bold text-slate-950">Prescription QR Code</h2>
              <p className="mt-1 text-[10px] text-slate-500">Scan to verify at Pharmacy</p>
              <div className="mt-4 flex justify-center">
                <QRCodeDisplay value={data.prescriptionNumber} size={128} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-950">Patient Info</h2>
              <div className="mt-3 space-y-3">
                <div className="border-b border-slate-100 pb-3"><p className="text-[10px] font-semibold uppercase text-slate-400">Name</p><p className="mt-1 text-xs font-bold text-slate-700">{data.patientName}</p></div>
                <div className="border-b border-slate-100 pb-3"><p className="text-[10px] font-semibold uppercase text-slate-400">Phone Number</p><p className="mt-1 text-xs font-bold text-slate-700">📞 {data.patientPhone}</p></div>
                <div><p className="text-[10px] font-semibold uppercase text-slate-400">Prescribed By</p><p className="mt-1 text-xs font-bold text-slate-700">{data.doctorName}</p></div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-950">Actions</h2>
              <div className="mt-3 space-y-2">
                <Link href={`/prescriptions/${id}/edit`} className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit Prescription</Link>
                <Link href={`/prescriptions/${id}/download`} className="block w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-blue-700">Download PDF</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}