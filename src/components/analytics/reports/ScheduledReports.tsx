import type { ScheduledAnalyticsReport } from "@/types/analytics";

export default function ScheduledReports({ reports }: { reports: ScheduledAnalyticsReport[] }) {
  return <div className="space-y-3">{reports.map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div><p className="text-xs font-semibold text-slate-800">{report.report}</p><p className="mt-1 text-xs text-slate-400">{report.frequency} · Next run {report.nextRun}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{report.status}</span></div>)}</div>;
}
