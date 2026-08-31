"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTicketByIdForAdmin, updateTicketStatus, replyAsAdmin } from "@/services/supportService";
import { Ticket, TicketStatus } from "@/types/support";
import ChatBubble from "@/components/support/ChatBubble";
import ReplyComposer from "@/components/support/ReplyComposer";
import { ChevronLeftIcon } from "@/components/support/icons";

const STATUS_OPTIONS: TicketStatus[] = ["OPEN", "PROCESSING", "SOLVED"];

export default function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    try {
      const data = await getTicketByIdForAdmin(id);
      setTicket(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async (message: string, image: File | null) => {
    setSending(true);
    try {
      const updated = await replyAsAdmin(id, message, image);
      setTicket(updated);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicketStatus(id, status);
      setTicket(updated);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading ticket…</div>;
  if (error || !ticket) return <div className="p-8 text-sm text-red-600">{error || "Ticket not found."}</div>;

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-5xl gap-4 px-4 py-6">
      <div className="flex flex-1 flex-col">
        <button
          onClick={() => router.push("/dashboard/support/admin")}
          className="mb-3 flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to all tickets
        </button>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <h1 className="text-base font-semibold text-slate-900">{ticket.subject}</h1>
          <p className="mt-1 text-xs text-slate-400">Opened {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
          {ticket.replies.map((r) => (
            <ChatBubble key={r.id} reply={r} isOwn={r.senderRole === "ADMIN"} />
          ))}
        </div>

        <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white">
          <ReplyComposer onSend={handleSend} sending={sending} placeholder="Reply to patient…" />
        </div>
      </div>

      <aside className="w-72 shrink-0 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Patient</h2>
          <p className="text-sm font-medium text-slate-900">{ticket.userName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{ticket.userEmail}</p>
          <p className="mt-0.5 text-xs text-slate-400">ID: {ticket.userId}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</h2>
          <div className="space-y-1.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updatingStatus}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  ticket.status === s ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {ticket.attachmentUrl && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Attachment</h2>
            <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ticket.attachmentUrl} alt="Ticket attachment" className="rounded-lg border border-slate-100" />
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
