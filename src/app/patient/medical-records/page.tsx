"use client";

import Link from "next/link";
import { useState } from "react";

type TabId =
  | "history"
  | "prescriptions"
  | "labs"
  | "vitals"
  | "immunizations"
  | "notes"
  | "referrals"
  | "documents";

const tabs: { id: TabId; label: string }[] = [
  { id: "history", label: "Medical History" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "labs", label: "Lab Results" },
  { id: "vitals", label: "Vitals" },
  { id: "immunizations", label: "Immunizations" },
  { id: "notes", label: "Consultation Notes" },
  { id: "referrals", label: "Referrals" },
  { id: "documents", label: "Documents" },
];

const recentRecords = [
  {
    id: "MR-001",
    date: "12 Aug 2026",
    title: "Annual Checkup",
    doctor: "Dr. Elena Park",
    diagnosis: "Stable hypertension, improved glucose control",
  },
  {
    id: "MR-002",
    date: "03 May 2026",
    title: "Follow-up Visit",
    doctor: "Dr. Marcus Lee",
    diagnosis: "Post-operative recovery progressing normally",
  },
  {
    id: "MR-003",
    date: "18 Jan 2026",
    title: "Emergency Visit",
    doctor: "Dr. Nina Shah",
    diagnosis: "Acute migraine episode",
  },
];

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("history");

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc] text-slate-900">
      <div className="mx-auto w-full max-w-[1450px] px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        {/* HEADER */}
        <header className="mb-5 border-b border-slate-200 pb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                Medical Records
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Electronic Health Record
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Review clinical history, diagnoses, reports, vitals and patient
                health documents.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/patient/medical-records/history"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Complete History
              </Link>

              <button
                type="button"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Export Record
              </button>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT */}
          <section className="min-w-0 space-y-5">
            {/* PATIENT */}
            <PatientSummary />

            {/* EMERGENCY */}
            <EmergencyInformation />

            {/* TABS */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-3 sm:p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {tabs.map((tab) => {
                    const selected = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-0 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-0 p-4 sm:p-5">
                <TabContent activeTab={activeTab} />
              </div>
            </section>

            {/* LOWER CARDS */}
            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
              <LabCard />
              <VitalsCard />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
              <ImmunizationsCard />
              <DocumentsCard />
            </div>
          </section>

          {/* RIGHT */}
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-5 xl:self-start">
            <RecordActions />
            <SecurityCard />
            <AccessLog />
          </aside>
        </div>
      </div>
    </main>
  );
}

function PatientSummary() {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-100 to-blue-100 text-xl font-bold text-slate-700">
            AT
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-950">
                Ava Thompson
              </h2>

              <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase text-blue-700">
                Primary Patient
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Patient ID: HB-204891
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip text="DOB: 14 Feb 1987" />
              <Chip text="Blood Type: O+" />
              <Chip text="Sex: Female" />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400">
                Family
              </span>

              <button className="rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white">
                Ava
              </button>

              <button className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                Noah
              </button>

              <button className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                Mia
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 md:w-auto"
        >
          Edit Summary
        </button>
      </div>
    </section>
  );
}

function EmergencyInformation() {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-950">
            Emergency Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Critical information for emergency healthcare access
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <EmergencyChip text="Allergy: Penicillin" />
            <EmergencyChip text="Chronic: Hypertension" />
            <EmergencyChip text="Medication: Lisinopril" />
            <EmergencyChip text="Medication: Metformin" />
          </div>
        </div>

        <button className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 md:w-auto">
          SOS Quick Pull
        </button>
      </div>
    </section>
  );
}

function TabContent({ activeTab }: { activeTab: TabId }) {
  if (activeTab === "history") {
    return (
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              Recent Medical History
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Recent healthcare encounters
            </p>
          </div>

          <Link
            href="/patient/medical-records/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View Full History →
          </Link>
        </div>

        <div className="space-y-3">
          {recentRecords.map((record) => (
            <Link
              key={record.id}
              href={`/patient/medical-records/${record.id}`}
              className="block min-w-0 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {record.date}
                    </span>

                    <span className="text-xs text-slate-300">•</span>

                    <span className="text-xs font-semibold text-slate-700">
                      {record.title}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Diagnosis: {record.diagnosis}
                  </p>
                </div>

                <span className="w-fit shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                  {record.doctor}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const data = {
    prescriptions: {
      title: "Prescription History",
      text: "Prescription information will be displayed here after integration with the Prescription module.",
    },

    labs: {
      title: "Laboratory Results",
      text: "Laboratory results will be displayed here after integration with the Laboratory module.",
    },

    vitals: {
      title: "Patient Vitals",
      text: "Blood pressure, glucose, pulse and other recorded health measurements will appear here.",
    },

    immunizations: {
      title: "Immunizations",
      text: "Patient vaccination and immunization records will appear here.",
    },

    notes: {
      title: "Consultation Notes",
      text: "Authorized consultation notes created by healthcare professionals will appear here.",
    },

    referrals: {
      title: "Referrals",
      text: "Specialist referral history and related information will appear here.",
    },

    documents: {
      title: "Medical Documents",
      text: "Uploaded reports, consent forms and other patient medical documents will appear here.",
    },
  };

  const content = data[activeTab];

  return (
    <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-xl">
          📄
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900">
          {content.title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {content.text}
        </p>
      </div>
    </div>
  );
}

function LabCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Lab Results</h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest result trend
          </p>
        </div>

        <button className="text-xs font-semibold text-blue-600">
          View All
        </button>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        HbA1c Report · 12 Aug 2026
      </div>

      <Chart bars={[40, 55, 45, 68, 61, 78, 88]} />
    </section>
  );
}

function VitalsCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Vitals</h2>

          <p className="mt-1 text-xs text-slate-500">
            Blood pressure and glucose
          </p>
        </div>

        <button className="text-xs font-semibold text-blue-600">
          View All
        </button>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        Last updated · Today 09:42 AM
      </div>

      <Chart bars={[34, 48, 64, 55, 74, 82, 92]} />
    </section>
  );
}

function Chart({ bars }: { bars: number[] }) {
  return (
    <div className="mt-5 flex h-24 items-end gap-2 overflow-hidden rounded-xl bg-blue-50/40 px-4 py-3">
      {bars.map((bar, index) => (
        <div key={index} className="flex flex-1 items-end">
          <div
            className="w-full rounded-t bg-blue-500"
            style={{ height: `${bar}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ImmunizationsCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold">Immunizations</h2>

      <p className="mt-1 text-xs text-slate-500">
        Recent vaccines
      </p>

      <div className="mt-4 space-y-2">
        <Row title="Influenza" value="14 Oct 2025" />
        <Row title="COVID-19 Booster" value="02 Feb 2025" />
      </div>
    </section>
  );
}

function DocumentsCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h2 className="text-sm font-bold">Documents</h2>

          <p className="mt-1 text-xs text-slate-500">
            Medical reports and forms
          </p>
        </div>

        <button className="text-xs font-semibold text-blue-600">
          Upload
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {["Cardiology", "Consent", "Discharge"].map((document) => (
          <div
            key={document}
            className="grid min-h-24 place-items-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-center text-[10px] font-semibold text-slate-500"
          >
            <div>
              <div className="text-xl">📄</div>

              <span>{document}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecordActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold">Record Actions</h2>

      <p className="mt-1 text-xs text-slate-500">
        Record management
      </p>

      <div className="mt-4 space-y-2">
        <button className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50">
          Download / Export Record
        </button>

        <button className="w-full rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
          Share / Manage Consent
        </button>
      </div>
    </section>
  );
}

function SecurityCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold">Security</h2>

      <p className="mt-1 text-xs text-slate-500">
        Record security information
      </p>

      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
        <p className="text-xs font-bold text-emerald-800">
          Encrypted & Protected
        </p>

        <p className="mt-1 text-[11px] leading-4 text-emerald-700">
          Protected health data with controlled and audited access.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] uppercase text-slate-400">
            Last Updated
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            Today
          </p>
        </div>

        <div>
          <p className="text-[9px] uppercase text-slate-400">
            Version
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            v12
          </p>
        </div>
      </div>
    </section>
  );
}

function AccessLog() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Access Log</h2>

          <p className="mt-1 text-xs text-slate-500">
            Recent record activity
          </p>
        </div>

        <button className="text-[10px] font-semibold text-blue-600">
          Audit Trail
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <AccessItem
          name="Dr. Elena Park"
          action="Viewed record"
          time="09:42 AM"
        />

        <AccessItem
          name="Nurse Olivia Chen"
          action="Viewed emergency information"
          time="08:15 AM"
        />

        <AccessItem
          name="Billing Admin"
          action="Accessed consent"
          time="Yesterday"
        />
      </div>
    </section>
  );
}

function AccessItem({
  name,
  action,
  time,
}: {
  name: string;
  action: string;
  time: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between xl:flex-col">
        <p className="text-xs font-bold text-slate-700">{name}</p>

        <span className="text-[9px] text-slate-400">{time}</span>
      </div>

      <p className="mt-1 text-[10px] text-slate-500">{action}</p>
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="max-w-full rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
      {text}
    </span>
  );
}

function EmergencyChip({ text }: { text: string }) {
  return (
    <span className="max-w-full rounded-full border border-rose-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700">
      {text}
    </span>
  );
}

function Row({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold text-slate-700">
        {title}
      </span>

      <span className="text-[10px] text-slate-400">
        {value}
      </span>
    </div>
  );
}