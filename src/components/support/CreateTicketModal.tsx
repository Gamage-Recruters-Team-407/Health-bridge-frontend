
"use client";

import { useRef, useState } from "react";
import { TICKET_CATEGORIES } from "@/constants/support";
import { PaperclipIcon, XIcon } from "./icons";

export default function CreateTicketModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (
    subject: string,
    description: string,
    category: string,
    contactNumber: string,
    attachment: File | null
  ) => Promise<void>;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const reset = () => {
    setSubject("");
    setDescription("");
    setCategory("");
    setContactNumber("");
    setAttachment(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (
      !subject.trim() ||
      !description.trim() ||
      !category ||
      !contactNumber.trim()
    ) {
      setError(
        "Subject, description, category, and contact number are required."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onCreate(
        subject.trim(),
        description.trim(),
        category,
        contactNumber.trim(),
        attachment
      );

      reset();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Raise a support ticket
          </h2>

          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">

          {/* 1. Category */}
          <div>
            <label
              htmlFor="ticket-category"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="ticket-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Select a category</option>

              {TICKET_CATEGORIES.map((ticketCategory) => (
                <option key={ticketCategory} value={ticketCategory}>
                  {ticketCategory.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Subject */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Unable to book an appointment"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* 3. Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail…"
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* 4. Contact Number */}
          <div>
            <label
              htmlFor="ticket-contact-number"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact number
            </label>

            <input
              id="ticket-contact-number"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. +1 555 123 4567"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* 5. Attachment */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Attachment (optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) =>
                setAttachment(e.target.files?.[0] ?? null)
              }
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500 hover:border-teal-400 hover:text-teal-600"
            >
              <PaperclipIcon className="h-4 w-4" />

              {attachment ? attachment.name : "Attach a file"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}


