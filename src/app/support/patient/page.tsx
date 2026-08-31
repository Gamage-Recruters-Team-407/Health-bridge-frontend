"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTickets, createTicket } from "@/services/supportService";
import { TicketSummary } from "@/types/support";
import StatusBadge from "@/components/support/StatusBadge";
import CreateTicketModal from "@/components/support/CreateTicketModal";
import { PlusIcon } from "@/components/support/icons";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (subject: string, description: string, attachment: File | null) => {
    await createTicket(subject, description, attachment);
    await load();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Support tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track issues you&apos;ve raised and chat with our support team.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <PlusIcon className="h-4 w-4" />
          New ticket
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading tickets…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">You haven&apos;t raised any tickets yet.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 text-sm font-medium text-teal-600 hover:underline"
          >
            Raise your first ticket
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {tickets.map((t) => (
          <Link
            key={t.id}
            href={`/support/patient/${t.id}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition hover:border-teal-300 hover:shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{t.subject}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Opened {formatDate(t.createdAt)}
                {t.replyCount > 0 && ` · ${t.replyCount} repl${t.replyCount === 1 ? "y" : "ies"}`}
                {t.hasAttachment && " · Attachment"}
              </p>
            </div>
            <StatusBadge status={t.status} />
          </Link>
        ))}
      </div>

      <CreateTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
