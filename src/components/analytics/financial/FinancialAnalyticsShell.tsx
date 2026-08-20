"use client";

import { useState } from "react";
import { financialAnalyticsMockData } from "@/src/data/financialAnalyticsMockData";
import type { AnalyticsPeriod } from "@/src/types/analytics";
import AnalyticsHeader from "@/src/components/analytics/AnalyticsHeader";
import AnalyticsKpiCard from "@/src/components/analytics/AnalyticsKpiCard";
import DepartmentRevenueChart from "@/src/components/analytics/financial/DepartmentRevenueChart";
import FinancialPanel from "@/src/components/analytics/financial/FinancialPanel";
import FinancialPerformanceTable from "@/src/components/analytics/financial/FinancialPerformanceTable";
import PaymentStatusChart from "@/src/components/analytics/financial/PaymentStatusChart";
import RevenueBySourceChart from "@/src/components/analytics/financial/RevenueBySourceChart";
import RevenueGrowth from "@/src/components/analytics/financial/RevenueGrowth";
import RevenueTrendChart from "@/src/components/analytics/financial/RevenueTrendChart";
import TransactionActivityChart from "@/src/components/analytics/financial/TransactionActivityChart";

export default function FinancialAnalyticsShell() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");
  const data = financialAnalyticsMockData[period];

  return <main className="min-h-screen overflow-x-hidden bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><AnalyticsHeader period={period} onPeriodChange={setPeriod} title="Financial Analytics" subtitle="Revenue performance, payment trends, and financial insights." /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.kpis.map((kpi) => <AnalyticsKpiCard key={kpi.label} kpi={kpi} />)}</div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><FinancialPanel title="Revenue Trend" description="Monthly revenue performance" className="xl:col-span-2"><RevenueTrendChart data={data.revenueTrend} /></FinancialPanel><FinancialPanel title="Revenue by Source" description="Healthcare service revenue contribution"><RevenueBySourceChart data={data.revenueBySource} /></FinancialPanel><FinancialPanel title="Payment Status" description="Transaction counts by payment status"><PaymentStatusChart data={data.paymentStatus} /></FinancialPanel><FinancialPanel title="Monthly Transaction Activity" description="Successful, pending, failed, and refunded payments"><TransactionActivityChart data={data.transactionActivity} /></FinancialPanel><FinancialPanel title="Department Revenue" description="Revenue comparison across departments"><DepartmentRevenueChart data={data.departmentRevenue} /></FinancialPanel><FinancialPanel title="Revenue Growth" description="Growth by healthcare service source" className="xl:col-span-2"><RevenueGrowth data={data.revenueGrowth} /></FinancialPanel></div><FinancialPanel title="Financial Performance Summary" description="Revenue-source snapshot for the selected period" className="mt-4"><FinancialPerformanceTable data={data.performance} /></FinancialPanel><p className="mt-5 text-center text-xs text-slate-400">Financial analytics preview uses local mock data and is ready for future API integration.</p></div></main>;
}
