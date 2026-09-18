"use client";

import { useEffect, useState } from "react";

import {
  getAllSupportDocuments,
  SupportDocument,
} from "@/services/supportDocumentService";

import { createTicket } from "@/services/supportService";
import Navbar from "@/components/ui/Navbar";

import CreateTicketModal from "@/components/support/CreateTicketModal";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    {/* Sidebar - fixed width column on the far left, below the navbar */}
    

   


        {/* Main content area takes remaining space */}
        <div className="grid flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-5">

          {/* =================================================
              LEFT - SUPPORT DOCUMENTS
          ================================================= */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">

              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  Support Documents
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Reference documents available to help with your
                  care and billing.
                </p>
              </div>

              {/* Loading */}
              {loading && (
                <div className="py-12 text-center">
                  <p className="text-sm text-slate-500">
                    Loading documents...
                  </p>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
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
                        <div className="mb-3 border-b border-slate-100 pb-2.5">
                          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                            {cat.label}
                          </h2>
                        </div>

                        {/* No Documents */}
                        {categoryDocuments.length === 0 ? (
                          <p className="px-1 text-sm italic text-slate-400">
                            No documents available.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {categoryDocuments.map((document) => (
                              <div
                                key={document.id}
                                className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4"
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
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
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

          {/* =================================================
              RIGHT - CREATE SUPPORT TICKET
          ================================================= */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
               <Link
  href="/support/patient"
  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    usePathname() === "/support/patient"
      ? "bg-[#0052cc]/10 text-[#0052cc]"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`}
>
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M8 5v14M4 9h4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
  My Support Tickets
</Link>
              <CreateTicketModal onCreate={createSupportTicket} />

              
            </div>
          </div>

         

        </div>
      </div>
    </div>
  );
}