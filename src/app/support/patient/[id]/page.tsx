"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyTicketById, replyAsUser } from "@/services/supportService";
import { Ticket } from "@/types/support";
import StatusBadge from "@/components/support/StatusBadge";
import ChatBubble from "@/components/support/ChatBubble";
import ReplyComposer from "@/components/support/ReplyComposer";
import { ChevronLeftIcon } from "@/components/support/icons";

export default function MyTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      const data = await getMyTicketById(id);
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
      const updated = await replyAsUser(id, message, image);
      setTicket(updated);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading ticket…</div>;
  if (error || !ticket) return <div className="p-8 text-sm text-red-600">{error || "Ticket not found."}</div>;

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-3xl flex-col px-4 py-6">
      <button
        onClick={() => router.push("/dashboard/ticket")}
        className="mb-3 flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to my tickets
      </button>

      <div className="mb-4 flex items-start justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div>
          <h1 className="text-base font-semibold text-slate-900">{ticket.subject}</h1>
          <p className="mt-1 text-xs text-slate-400">Opened {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={ticket.status} />
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
          isOwn={true}
        />
        {ticket.replies.map((r) => (
          <ChatBubble key={r.id} reply={r} isOwn={r.senderRole === "USER"} />
        ))}
      </div>

      <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white">
        <ReplyComposer onSend={handleSend} sending={sending} placeholder="Reply to support…" />
      </div>
    </div>
  );
}
