"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyTickets, getMyTicketById, createTicket, replyAsUser } from "@/services/supportService";
import { Ticket, TicketSummary } from "@/types/support";
import StatusBadge from "@/components/support/StatusBadge";
import CreateTicketModal from "@/components/support/CreateTicketModal";
import ChatBubble from "@/components/support/ChatBubble";
import ReplyComposer from "@/components/support/ReplyComposer";
import { PlusIcon } from "@/components/support/icons";

function formatListDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" });
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const loadList = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await getMyTickets();
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
      const data = await getMyTicketById(id);
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

  const handleCreate = async (subject: string, description: string, attachment: File | null) => {
    await createTicket(subject, description, attachment);
    await loadList();
  };

  const handleSend = async (message: string, image: File | null) => {
    if (!selectedId) return;
    setSending(true);
    try {
      const updated = await replyAsUser(selectedId, message, image);
      setTicket(updated);
      await loadList();
    } finally {
      setSending(false);
    }
  };

  const filteredTickets = useMemo(() => {
    if (!query.trim()) return tickets;
    const q = query.toLowerCase();
    return tickets.filter((t) => (t.subject || "").toLowerCase().includes(q));
  }, [tickets, query]);

  return (
    <div
      className="flex h-screen bg-white text-[#242424]"
      style={{ fontFamily: "'Segoe UI', Roboto, system-ui, sans-serif" }}
    >
      {/* Left: message list pane */}
      <div className="flex w-[380px] shrink-0 flex-col border-r border-[#E1DFDD] bg-white">
        <div className="flex items-center justify-between border-b border-[#E1DFDD] px-4 pt-3">
          <span className="border-b-2 border-[#0F6CBD] pb-2 text-sm font-medium text-[#242424]">All tickets</span>
          <button
            onClick={() => setModalOpen(true)}
            title="New ticket"
            className="mb-2 flex items-center gap-1 rounded-md px-2 py-1 text-[#0F6CBD] hover:bg-[#F0F6FC]"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-3 py-1.5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#9A9A9A]" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
              <path d="m14 14 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets"
              className="w-full bg-transparent text-sm text-[#242424] placeholder:text-[#9A9A9A] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList && <p className="px-4 py-3 text-sm text-[#616161]">Loading tickets…</p>}
          {listError && <p className="px-4 py-3 text-sm text-red-600">{listError}</p>}

          {!loadingList && !listError && filteredTickets.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="text-sm text-[#616161]">
                {tickets.length === 0 ? "You haven't raised any tickets yet." : "No tickets match your search."}
              </p>
              {tickets.length === 0 && (
                <button onClick={() => setModalOpen(true)} className="text-sm font-medium text-[#0F6CBD] hover:underline">
                  Raise your first ticket
                </button>
              )}
            </div>
          )}

          {filteredTickets.map((t) => {
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
                  {(t.subject || "?").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[#242424]">{t.subject || "Untitled ticket"}</p>
                    <span className="shrink-0 text-xs text-[#616161]">{formatListDate(t.createdAt)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#616161]">
                    <StatusBadge status={t.status} />
                    {t.replyCount > 0 && <span>· {t.replyCount} repl{t.replyCount === 1 ? "y" : "ies"}</span>}
                    {t.hasAttachment && <span>· Attachment</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: reading pane */}
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
              <h1 className="truncate text-base font-semibold text-[#242424]">{ticket.subject || "Untitled ticket"}</h1>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="flex items-center justify-between border-b border-[#E1DFDD] bg-[#FAF9F8] px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6CBD]/10 text-sm font-semibold text-[#0F6CBD]">
                  {(ticket.userName || "Y").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#242424]">{ticket.userName || "You"}</p>
                  <p className="text-xs text-[#616161]">To: Support team</p>
                </div>
              </div>
              <span className="text-xs text-[#616161]">{new Date(ticket.createdAt).toLocaleString()}</span>
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
                  isOwn={true}
                />
              </div>
              {ticket.replies.map((r) => (
                <div key={r.id} className="border-b border-[#EDEBE9] px-6 py-4">
                  <ChatBubble reply={r} isOwn={r.senderRole === "USER"} />
                </div>
              ))}
            </div>

            <div className="border-t border-[#E1DFDD] bg-[#FAF9F8] px-3 py-3">
              <ReplyComposer onSend={handleSend} sending={sending} placeholder="Reply to support…" />
            </div>
          </>
        )}
      </div>

      <CreateTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}