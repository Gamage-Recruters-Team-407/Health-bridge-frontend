import type { AnalyticsKpi } from "@/src/types/analytics";

const accentStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  teal: "bg-teal-50 text-teal-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  green: "bg-emerald-50 text-emerald-600",
};

const iconPaths: Record<string, string> = {
  P: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0m14 0H5",
  A: "M7 3v3m10-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3 8h2m2 0h2m-6 4h2m2 0h2",
  C: "M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6",
  R: "M12 2v20m5-16.5A4.5 4.5 0 0 0 12 4c-2.49 0-4.5 1.57-4.5 3.5S9.51 11 12 11s4.5 1.57 4.5 3.5S14.49 18 12 18a4.5 4.5 0 0 1-5-1.5",
  L: "M6 3v18h14M9 17h2m-2-4h5m-5-4h8",
  I: "M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Zm-3.5 9 2.3 2.3 4.7-4.7",
};

export default function AnalyticsKpiCard({ kpi }: { kpi: AnalyticsKpi }) {
  const isPositive = kpi.trendPositive ?? kpi.direction === "up";
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${accentStyles[kpi.accent] ?? accentStyles.blue}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d={iconPaths[kpi.icon] ?? iconPaths.P} />
          </svg>
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{kpi.value}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span className={isPositive ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>{isPositive ? "↗" : "↘"} {kpi.change}</span>
        <span className="text-slate-400">{kpi.comparison}</span>
      </div>
    </article>
  );
}