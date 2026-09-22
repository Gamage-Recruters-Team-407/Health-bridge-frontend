"use client";

import { useEffect, useState } from "react";

import {
  getAllSupportDocuments,
  SupportDocument,
} from "@/services/supportDocumentService";

import { createTicket } from "@/services/supportService";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import CreateTicketModal from "@/components/support/CreateTicketModal";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, string> = {
  BILLING: "💳",
  LAB_REPORT: "🧪",
  MEDICAL_RECORD: "📋",
  INSURANCE: "🛡️",
  ADMISSION: "🏥",
  DISCHARGE: "📤",
  MEDICINE: "💊",
  OTHER: "📁",
};

const categories = [
  { value: "BILLING", label: "Billing" },
  { value: "LAB_REPORT", label: "Lab Report" },
  { value: "MEDICAL_RECORD", label: "Medical Record" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "ADMISSION", label: "Admission" },
  { value: "DISCHARGE", label: "Discharge" },
  { value: "MEDICINE", label: "Medicine" },
  { value: "OTHER", label: "Other" },
];

const DESCRIPTION_LIMIT = 140;

/* =========================================================
   DOCUMENT DESCRIPTION
   ========================================================= */

function DocumentDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) {
    return (
      <p className="mt-1 text-sm italic text-slate-400">
        No description provided.
      </p>
    );
  }

  const isLong = text.length > DESCRIPTION_LIMIT;

  const shown =
    expanded || !isLong
      ? text
      : `${text.slice(0, DESCRIPTION_LIMIT)}…`;

  return (
    <p className="mt-1 text-sm leading-6 text-slate-600">
      {shown}

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="ml-1.5 font-medium text-[#0052cc] hover:text-[#0044aa]"
        >
          {expanded ? "Show less" : "Show all"}
        </button>
      )}
    </p>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function PatientSupportPage() {
  const [documents, setDocuments] = useState<SupportDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD SUPPORT DOCUMENTS
     ======================================================= */

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllSupportDocuments();

      setDocuments(data);
    } catch (err) {
      console.error(
        "Failed to load support documents:",
        err
      );

      setError("Failed to load support documents.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FILTER DOCUMENTS
     ======================================================= */

  const getDocumentsByCategory = (category: string) =>
    documents.filter(
      (document) => document.category === category
    );

  /* =======================================================
     CREATE SUPPORT TICKET
     ======================================================= */

  const createSupportTicket = async (
    subject: string,
    description: string,
    category: string,
    contactNumber: string,
    attachment: File | null
  ) => {
    await createTicket(
      subject,
      description,
      category,
      contactNumber,
      attachment
    );
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar spans full width, on top */}
      <Navbar />

      <div className="mx-auto flex max-w-7xl items-start gap-6 p-6">
      
       

        {/* Main content area takes remaining space */}
        <div className="grid flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-5">

          {/* =================================================
              LEFT - SUPPORT DOCUMENTS
          ================================================= */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">

              {/* Header banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0F6CBD] to-[#2E9BF0] px-6 py-7 sm:px-8">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/10" />
                <h1 className="relative text-2xl font-bold text-white">
                  Support Documents
                </h1>
                <p className="relative mt-1.5 max-w-md text-sm text-blue-50/90">
                  Reference documents available to help with your
                  care and billing.
                </p>
              </div>

              <div className="p-6 sm:p-8">

                {/* Loading */}
                {loading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#0F6CBD]" />
                    <p className="text-sm text-slate-500">
                      Loading documents...
                    </p>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                    <span className="text-lg">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Documents */}
                {!loading && !error && (
                  <div className="space-y-8">
                    {categories.map((cat) => {
                      const categoryDocuments = getDocumentsByCategory(cat.value);

                      return (
                        <section key={cat.value}>
                          {/* Category Header */}
                          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                              <span className="text-base">
                                {CATEGORY_ICONS[cat.value] ?? "📁"}
                              </span>
                              {cat.label}
                            </h2>

                            {categoryDocuments.length > 0 && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                                {categoryDocuments.length}
                              </span>
                            )}
                          </div>

                          {/* No Documents */}
                          {categoryDocuments.length === 0 ? (
                            <p className="px-1 text-sm italic text-slate-400">
                              No documents available.
                            </p>
                          ) : (
                            <div className="space-y-2.5">
                              {categoryDocuments.map((document) => (
                                <div
                                  key={document.id}
                                  className="group flex items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-3 transition hover:border-slate-100 hover:bg-slate-50/70"
                                >
                                  {/* Description */}
                                  <div className="min-w-0 flex-1">
                                    <DocumentDescription
                                      text={document.description ?? ""}
                                    />
                                  </div>

                                  {/* Open Document */}
                                  <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open document"
                                    title="Open document"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-[#0F6CBD]/30 group-hover:text-[#0F6CBD] hover:!bg-[#0F6CBD]/10"
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                      <path
                                        d="M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5A1.5 1.5 0 0 1 6.5 3.5H7Z"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M14 3.5V8a1 1 0 0 0 1 1h4.5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT - CREATE SUPPORT TICKET
          ================================================= */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">

              {/* My Support Tickets shortcut */}
              <Link
                href="/support/patient"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#0F6CBD]/20 bg-gradient-to-r from-[#0F6CBD] to-[#2E9BF0] px-5 py-4 text-white shadow-sm transition hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path d="M8 5v14M4 9h4" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold">
                    My Support Tickets
                  </span>
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-white/80 transition group-hover:translate-x-0.5"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* Create ticket card */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-1 shadow-sm">
                <CreateTicketModal onCreate={createSupportTicket} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}