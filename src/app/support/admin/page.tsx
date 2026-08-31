"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllTickets,
  getTicketByIdForAdmin,
  updateTicketStatus,
  replyAsAdmin,
} from "@/services/supportService";
import { Ticket, TicketSummary, TicketStatus } from "@/types/support";
import StatusBadge from "@/components/support/StatusBadge";
import ChatBubble from "@/components/support/ChatBubble";
import ReplyComposer from "@/components/support/ReplyComposer";

const FILTERS: Array<TicketStatus | "ALL"> = ["ALL", "OPEN", "PROCESSING", "SOLVED"];
const STATUS_OPTIONS: TicketStatus[] = ["OPEN", "PROCESSING", "SOLVED"];

function formatListDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketStatus | "ALL">("ALL");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadList = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await getAllTickets();
      setTickets(data);
      setSelectedId((current) => current ?? (data.length > 0 ? data[0].id : null));
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load tickets.");
    } finally {
      setLoadingList(false);
    }
  };

  const loadTicket = async (id: string) => {
    setLoadingTicket(true);
    setTicketError(null);
    try {
      const data = await getTicketByIdForAdmin(id);
      setTicket(data);
    } catch (e) {
      setTicketError(e instanceof Error ? e.message : "Failed to load ticket.");
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selectedId) loadTicket(selectedId);
  }, [selectedId]);

  const handleSend = async (message: string, image: File | null) => {
    if (!selectedId) return;
    setSending(true);
    try {
      const updated = await replyAsAdmin(selectedId, message, image);
      setTicket(updated);
      await loadList();
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket || !selectedId) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicketStatus(selectedId, status);
      setTicket(updated);
      await loadList();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filtered = filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  const counts: Record<TicketStatus | "ALL", number> = useMemo(
    () => ({
      ALL: tickets.length,
      OPEN: tickets.filter((t) => t.status === "OPEN").length,
      PROCESSING: tickets.filter((t) => t.status === "PROCESSING").length,
      SOLVED: tickets.filter((t) => t.status === "SOLVED").length,
    }),
    [tickets]
  );

  return (
    <div
      className="flex h-screen bg-white text-[#242424]"
      style={{ fontFamily: "'Segoe UI', Roboto, system-ui, sans-serif" }}
    >
      {/* Left: ticket list pane */}
      <div className="flex w-[380px] shrink-0 flex-col border-r border-[#E1DFDD] bg-white">
        <div className="mb-1 px-4 pt-3">
          <h1 className="text-[15px] font-semibold text-[#242424]">Support tickets</h1>
          <p className="mt-0.5 text-xs text-[#616161]">All tickets raised by patients across the platform.</p>
        </div>

        <div className="flex gap-4 border-b border-[#E1DFDD] px-4 pt-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-2 text-sm font-medium transition ${
                filter === f
                  ? "border-b-2 border-[#0F6CBD] text-[#0F6CBD]"
                  : "border-b-2 border-transparent text-[#616161] hover:text-[#242424]"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} · {counts[f]}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList && <p className="px-4 py-3 text-sm text-[#616161]">Loading tickets…</p>}
          {listError && <p className="px-4 py-3 text-sm text-red-600">{listError}</p>}

          {!loadingList && !listError && filtered.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-[#616161]">No tickets in this category.</p>
          )}

          {filtered.map((t) => {
            const isActive = t.id === selectedId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`flex w-full items-start gap-3 border-b border-[#EDEBE9] px-4 py-3 text-left transition ${
                  isActive ? "bg-[#EBF3FC]" : "hover:bg-[#F5F5F5]"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F6CBD]/10 text-xs font-semibold text-[#0F6CBD]">
                 {(t.userName || "?").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[#242424]">{t.userName}</p>
                    <span className="shrink-0 text-xs text-[#616161]">{formatListDate(t.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#616161]">
                    {t.subject}
                    {t.hasAttachment && " · Attachment"}
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle: reading pane */}
      <div className="flex flex-1 flex-col bg-white">
        {!selectedId && (
          <div className="flex flex-1 items-center justify-center text-sm text-[#616161]">
            Select a ticket to view the conversation.
          </div>
        )}

        {selectedId && loadingTicket && (
          <div className="flex flex-1 items-center justify-center text-sm text-[#616161]">Loading ticket…</div>
        )}

        {selectedId && !loadingTicket && ticketError && (
          <div className="flex flex-1 items-center justify-center text-sm text-red-600">{ticketError}</div>
        )}

        {selectedId && !loadingTicket && !ticketError && ticket && (
          <>
            <div className="flex items-center justify-between border-b border-[#E1DFDD] px-6 py-3">
              <h2 className="truncate text-base font-semibold text-[#242424]">{ticket.subject}</h2>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="border-b border-[#E1DFDD] bg-[#FAF9F8] px-6 py-2 text-xs text-[#616161]">
              Opened {new Date(ticket.createdAt).toLocaleString()}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-[#EDEBE9] px-6 py-4">
                <ChatBubble
                  reply={{
                    id: "original",
                    senderId: ticket.userId,
                    senderName: ticket.userName,
                    senderRole: "USER",
                    message: ticket.description,
                    imageUrl: ticket.attachmentUrl,
                    createdAt: ticket.createdAt,
                  }}
                  isOwn={false}
                />
              </div>
              {ticket.replies.map((r) => (
                <div key={r.id} className="border-b border-[#EDEBE9] px-6 py-4">
                  <ChatBubble reply={r} isOwn={r.senderRole === "ADMIN"} />
                </div>
              ))}
            </div>

            <div className="border-t border-[#E1DFDD] bg-[#FAF9F8] px-3 py-3">
              <ReplyComposer onSend={handleSend} sending={sending} placeholder="Reply to patient…" />
            </div>
          </>
        )}
      </div>

      {/* Right: patient / status info pane */}
      {selectedId && ticket && !loadingTicket && !ticketError && (
        <aside className="w-72 shrink-0 space-y-4 overflow-y-auto border-l border-[#E1DFDD] bg-[#FAF9F8] p-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#616161]">Patient</h3>
            <p className="text-sm font-medium text-[#242424]">{ticket.userName}</p>
            <p className="mt-0.5 text-xs text-[#616161]">{ticket.userEmail}</p>
            <p className="mt-0.5 text-xs text-[#9A9A9A]">ID: {ticket.userId}</p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#616161]">Status</h3>
            <div className="space-y-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                    ticket.status === s
                      ? "bg-[#0F6CBD] text-white"
                      : "bg-white text-[#616161] hover:bg-[#F0F6FC]"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {ticket.attachmentUrl && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#616161]">Attachment</h3>
              <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.attachmentUrl}
                  alt="Ticket attachment"
                  className="rounded-md border border-[#E1DFDD]"
                />
              </a>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}