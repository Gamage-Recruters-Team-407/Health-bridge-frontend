"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTickets } from "@/services/supportService";
import { TicketSummary, TicketStatus } from "@/types/support";
import StatusBadge from "@/components/support/StatusBadge";

const FILTERS: Array<TicketStatus | "ALL"> = ["ALL", "OPEN", "PROCESSING", "SOLVED"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketStatus | "ALL">("ALL");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  const counts: Record<TicketStatus | "ALL", number> = {
    ALL: tickets.length,
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    PROCESSING: tickets.filter((t) => t.status === "PROCESSING").length,
    SOLVED: tickets.filter((t) => t.status === "SOLVED").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Support tickets</h1>
        <p className="mt-1 text-sm text-slate-500">All tickets raised by patients across the platform.</p>
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} · {counts[f]}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading tickets…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Replies</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/support/admin/${t.id}`} className="block">
                      <p className="font-medium text-slate-900">{t.userName}</p>
                      <p className="text-xs text-slate-400">{t.userId}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/support/admin/${t.id}`}
                      className="block max-w-xs truncate text-slate-700"
                    >
                      {t.subject}
                      {t.hasAttachment && <span className="ml-1.5 text-slate-400">📎</span>}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.replyCount}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    No tickets in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
