import type { ReportStatus } from "@/src/types/analytics";

const statusStyles: Record<ReportStatus, string> = { Completed: "bg-emerald-50 text-emerald-700", Generating: "bg-blue-50 text-blue-700", Failed: "bg-rose-50 text-rose-700", Scheduled: "bg-amber-50 text-amber-700" };

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{status}</span>;
}
