"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Prescription } from "@/types/prescription";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Backend එක එනකන් Mock Data
    setPrescriptions([
      { id: "1", patientId: "patient-1", doctorId: "doctor-1", prescriptionNumber: "RX-2026-089", patientName: "Ava Thompson", patientPhone: "+94 77 123 4567", doctorName: "Dr. Elena Park", date: "19 Aug 2026", status: "active", items: [{ id: "1", medicineId: "m1", medicineName: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", quantity: 30, instructions: "Morning" }], validUntil: "19 Sep 2026" }
    ]);
    setLoading(false);
  }, []);

  const filtered = prescriptions.filter((p) => p.patientName.toLowerCase().includes(search.toLowerCase()) || p.prescriptionNumber.toLowerCase().includes(search.toLowerCase()) || p.patientPhone.includes(search));

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Prescriptions</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Prescription Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage electronic prescriptions, view history, and create new prescriptions.</p>
          </div>
          <Link href="/prescriptions/create" className="w-fit rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700">+ Create Prescription</Link>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by patient name, phone or prescription number..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white" />
        </section>

        <section className="mt-5 space-y-4">
          {loading ? <div className="py-20 text-center text-sm text-slate-500">Loading prescriptions...</div> : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center"><h2 className="text-sm font-bold text-slate-800">No prescriptions found</h2></div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.prescriptionNumber}</span>
                      <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.status.toUpperCase()}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-950">{p.patientName}</h3>
                    <p className="mt-1 text-xs text-slate-500">📞 {p.patientPhone} • Dr. {p.doctorName} • {p.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/prescriptions/${p.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">View Details</Link>
                    <Link href={`/prescriptions/${p.id}/download`} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Download</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}