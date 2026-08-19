"use client";

import { useState } from "react";
import { analyticsMockData } from "@/src/data/analyticsMockData";
import type { AnalyticsPeriod } from "@/src/types/analytics";
import AnalyticsHeader from "@/src/components/analytics/AnalyticsHeader";
import AnalyticsKpiCard from "@/src/components/analytics/AnalyticsKpiCard";
import AnalyticsSummaryTable from "@/src/components/analytics/AnalyticsSummaryTable";
import DepartmentPerformance from "@/src/components/analytics/DepartmentPerformance";
import PatientTrendChart from "@/src/components/analytics/PatientTrendChart";
import ResourceUtilizationChart from "@/src/components/analytics/ResourceUtilizationChart";
import RevenueTrendChart from "@/src/components/analytics/RevenueTrendChart";

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-5"><div className="mb-4"><h2 className="text-sm font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-400">{description}</p></div>{children}</section>;
}

export default function AnalyticsDashboardShell() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");
  const data = analyticsMockData[period];

  return <main className="min-h-screen bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><AnalyticsHeader period={period} onPeriodChange={setPeriod} /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.kpis.map((kpi) => <AnalyticsKpiCard key={kpi.label} kpi={kpi} />)}</div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Panel title="Patient Trends" description="Monthly patient growth"><PatientTrendChart data={data.patientTrends} /></Panel><Panel title="Revenue Overview" description="Monthly revenue in millions"><RevenueTrendChart data={data.revenue} /></Panel><Panel title="Resource Utilization" description="Current capacity usage by resource"><ResourceUtilizationChart data={data.resources} /></Panel><Panel title="Department Performance" description="Utilization comparison across departments"><DepartmentPerformance data={data.departments} /></Panel></div><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-5"><div className="mb-4"><h2 className="text-sm font-bold text-slate-900">Operational Summary</h2><p className="mt-1 text-xs text-slate-400">Department-level snapshot for the selected period</p></div><AnalyticsSummaryTable data={data.departments} /></div><p className="mt-5 text-center text-xs text-slate-400">Dashboard preview uses local mock data and is ready for future API integration.</p></div></main>;
}