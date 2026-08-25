"use client";

import { useState } from "react";
import { recentReports as initialReports, reportActivity, reportCategories, reportDepartments, reportPeriods, reportSummaryKpis, reportTypes, scheduledReports } from "@/data/reportAnalyticsMockData";
import type { AnalyticsReport, ReportCategory, ReportFormat, ReportPeriod } from "@/types/analytics";
import GenerateReportPanel from "@/components/analytics/reports/GenerateReportPanel";
import ReportActivityChart from "@/components/analytics/reports/ReportActivityChart";
import ReportCategoryCards from "@/components/analytics/reports/ReportCategoryCards";
import ReportPreview from "@/components/analytics/reports/ReportPreview";
import ReportSummaryCards from "@/components/analytics/reports/ReportSummaryCards";
import RecentReportsTable from "@/components/analytics/reports/RecentReportsTable";
import ReportsPanel from "@/components/analytics/reports/ReportsPanel";
import ScheduledReports from "@/components/analytics/reports/ScheduledReports";

const defaultReportType: ReportCategory = "Healthcare";

function reportMetrics(category: ReportCategory): { label: string; value: string }[] {
  const existing = initialReports.find((report) => report.category === category);
  return existing?.metrics ?? [{ label: "Status", value: "Ready" }, { label: "Coverage", value: "Analytics" }];
}

export default function ReportsAnalyticsShell() {
  const [reports, setReports] = useState<AnalyticsReport[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<AnalyticsReport>();
  const [reportType, setReportType] = useState<ReportCategory>(defaultReportType);
  const [period, setPeriod] = useState<ReportPeriod>("This Month");
  const [department, setDepartment] = useState("All Departments");
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const generateReport = () => {
    if (isGenerating) return;
    setExportMessage("");
    setIsGenerating(true);
    const generatedReport: AnalyticsReport = { id: `report-${Date.now()}`, name: `${reportType} Report`, category: reportType, period, generatedDate: "Just now", format, status: "Completed", summary: `${reportType} mock report for ${department.toLowerCase()} covering ${period.toLowerCase()}.`, metrics: reportMetrics(reportType) };
    window.setTimeout(() => { setReports((current) => [generatedReport, ...current]); setSelectedReport(generatedReport); setIsGenerating(false); }, 700);
  };

  const selectCategory = (category: ReportCategory) => { setReportType(category); setExportMessage(""); };
  const viewCategory = (category: ReportCategory) => { const report = reports.find((item) => item.category === category); if (report) setSelectedReport(report); else selectCategory(category); };
  const downloadReport = (report: AnalyticsReport) => { setExportMessage(`Export integration will be enabled with the reporting backend for ${report.name}.`); };

  return <main className="min-h-screen overflow-x-hidden bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><header className="border-b border-slate-200 pb-6"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Health Bridge insights</p><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Analytics Reports</h1><p className="mt-2 text-sm text-slate-500">Generate, review, and manage healthcare analytics reports.</p><p className="mt-3 text-[11px] text-slate-400">Last updated: Today, 10:42 AM</p></header><div className="mt-6"><ReportSummaryCards data={reportSummaryKpis} /></div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><ReportsPanel title="Generate Report" description="Configure a frontend-only analytics report preview"><GenerateReportPanel reportType={reportType} period={period} department={department} format={format} isGenerating={isGenerating} onReportTypeChange={selectCategory} onPeriodChange={setPeriod} onDepartmentChange={setDepartment} onFormatChange={setFormat} onGenerate={generateReport} reportTypes={reportTypes} periods={reportPeriods} departments={reportDepartments} /></ReportsPanel><ReportsPanel title="Report Preview" description="Mock summary for the selected or generated report"><ReportPreview report={selectedReport} /></ReportsPanel></div>{exportMessage && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700" role="status">{exportMessage}</div>}<ReportsPanel title="Report Categories" description="Available analytics report outputs" className="mt-4"><ReportCategoryCards categories={reportCategories} onSelect={selectCategory} onView={viewCategory} /></ReportsPanel><ReportsPanel title="Recent Reports" description="Generated and scheduled analytics reports" className="mt-4"><RecentReportsTable reports={reports} onView={setSelectedReport} onDownload={downloadReport} /></ReportsPanel><div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2"><ReportsPanel title="Scheduled Reports" description="Display-only report schedules"><ScheduledReports reports={scheduledReports} /></ReportsPanel><ReportsPanel title="Report Activity" description="Reports generated by category"><ReportActivityChart data={reportActivity} /></ReportsPanel></div><p className="mt-5 text-center text-xs text-slate-400">Reports are local mock previews and are ready for future reporting service integration.</p></div></main>;
}
