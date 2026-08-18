"use client";

import Link from "next/link";
import { useState } from "react";

const records = [
  {
    id: "MR-001",
    date: "12 Aug 2026",
    type: "Annual Checkup",
    doctor: "Dr. Elena Park",
    diagnosis: "Stable hypertension",
    category: "Routine",
  },
  {
    id: "MR-002",
    date: "03 May 2026",
    type: "Follow-up Visit",
    doctor: "Dr. Marcus Lee",
    diagnosis: "Post-operative follow-up",
    category: "Follow-up",
  },
  {
    id: "MR-003",
    date: "18 Jan 2026",
    type: "Emergency Visit",
    doctor: "Dr. Nina Shah",
    diagnosis: "Acute migraine",
    category: "Emergency",
  },
  {
    id: "MR-004",
    date: "20 Oct 2025",
    type: "General Consultation",
    doctor: "Dr. Elena Park",
    diagnosis: "Hypertension monitoring",
    category: "Routine",
  },
  {
    id: "MR-005",
    date: "02 Jul 2025",
    type: "Diabetes Review",
    doctor: "Dr. Marcus Lee",
    diagnosis: "Type 2 diabetes monitoring",
    category: "Follow-up",
  },
];

export default function MedicalHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.type.toLowerCase().includes(search.toLowerCase()) ||
      record.doctor.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || record.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <Link
          href="/patient/medical-records"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Electronic Health Record
        </Link>

        {/* HEADER */}
        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            Medical Records
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
            Complete Medical History
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View the patient's chronological healthcare history and open
            individual clinical records.
          </p>
        </header>

        {/* SEARCH/FILTER */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search diagnosis, visit or doctor..."
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400"
            >
              <option>All</option>
              <option>Routine</option>
              <option>Follow-up</option>
              <option>Emergency</option>
            </select>
          </div>
        </section>

        {/* COUNT */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-slate-500">
            {filteredRecords.length} medical record
            {filteredRecords.length !== 1 ? "s" : ""}
          </p>

          <button className="text-xs font-semibold text-blue-600">
            Export History
          </button>
        </div>

        {/* TIMELINE */}
        <section className="relative mt-4 pl-5 sm:pl-7">
          <div className="absolute bottom-5 left-[5px] top-5 w-px bg-blue-100 sm:left-[9px]" />

          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <article key={record.id} className="relative">
                <span
                  className={`absolute -left-5 top-6 h-3 w-3 rounded-full border-[3px] border-[#f7f9fc] sm:-left-7 sm:h-4 sm:w-4 ${
                    record.category === "Emergency"
                      ? "bg-rose-500"
                      : index === 0
                        ? "bg-blue-600"
                        : "bg-blue-400"
                  }`}
                />

                <Link
                  href={`/patient/medical-records/${record.id}`}
                  className="block min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {record.date}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                            record.category === "Emergency"
                              ? "bg-rose-50 text-rose-700"
                              : record.category === "Follow-up"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {record.category}
                        </span>
                      </div>

                      <h2 className="mt-3 text-sm font-bold text-slate-950">
                        {record.type}
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Diagnosis: {record.diagnosis}
                      </p>

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        {record.doctor}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-blue-600">
                      View Details →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <h2 className="text-sm font-bold text-slate-800">
                No medical records found
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Try another search keyword or category.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}