import { TicketReply } from "@/types/support";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatBubble({
  reply,
  isOwn,
}: {
  reply: TicketReply;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[75%] flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
        <span className="px-1 text-xs text-slate-400">
          {reply.senderName} · {formatTime(reply.createdAt)}
        </span>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isOwn
              ? "rounded-br-sm bg-teal-600 text-white"
              : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
          }`}
        >
          {reply.message && <p className="whitespace-pre-wrap">{reply.message}</p>}
          {reply.imageUrl && (
            <a href={reply.imageUrl} target="_blank" rel="noreferrer" className="mt-2 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reply.imageUrl}
                alt="Attached"
                className="max-h-56 rounded-lg border border-white/20 object-cover"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
