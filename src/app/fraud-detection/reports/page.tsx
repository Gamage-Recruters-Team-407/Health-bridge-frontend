"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, FileBarChart2, FileText, TrendingDown, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FraudDetectionTabs from "@/components/fraud-detection/FraudDetectionTabs";

const reports = [
  { name: "Monthly fraud summary", type: "Executive overview", date: "01 Aug 2026", status: "Ready", icon: FileBarChart2 },
  { name: "Provider risk assessment", type: "Provider performance", date: "28 Jul 2026", status: "Ready", icon: FileText },
  { name: "Claims investigation export", type: "Case-level detail", date: "22 Jul 2026", status: "Ready", icon: FileText },
];

const reportLines = [
  "Fraud Detection Intelligence Report",
  "Health Bridge Insurance Operations",
  "Generated: 19 August 2026",
  "",
  "SUMMARY",
  "Recovered this month: LKR 284,000",
  "Confirmed fraud cases: 12",
  "False positive rate: 6.4%",
  "",
  "RISK DISTRIBUTION",
  "Low risk: 62%     Medium risk: 28%     High risk: 10%",
  "",
  "FLAGGED CLAIMS",
  "CLM-20481  Ava Thompson  BlueCross  HIGH  Duplicate billing",
  "CLM-20412  Marcus Lee     Aetna      MEDIUM  Unusual frequency",
  "CLM-20377  Noah Patel     United     LOW  Low anomaly",
  "CLM-20311  Emily Carter   Cigna      HIGH  Confirmed fraud",
  "",
  "TOP RISK PROVIDERS",
  "BlueCross 38%     Aetna 24%     Cigna 17%",
];

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function createFraudReportPdf() {
  const commands = ["BT", "/F1 20 Tf", "50 750 Td"];

  reportLines.forEach((line, index) => {
    if (index === 1) commands.push("/F1 10 Tf");
    if (index === 4) commands.push("/F1 12 Tf");
    if (index === 5) commands.push("/F1 10 Tf");
    commands.push(`(${escapePdfText(line)}) Tj`);
    commands.push("0 -25 Td");
  });

  commands.push("ET");
  const content = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export default function FraudReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  function handleGenerateReport() {
    setIsGenerating(true);
    const pdf = createFraudReportPdf();
    const url = URL.createObjectURL(pdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = "health-bridge-fraud-detection-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
    setIsGenerating(false);
  }

  return <DashboardLayout pageTitle="Insurance" userRole="INSURANCE_OFFICER"><div className="min-h-screen bg-[#fbfcfd] px-4 py-6 text-[#16191d] sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><FraudDetectionTabs /><header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7680]">Claims intelligence</p><h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171a1e] sm:text-[32px]">Fraud reports</h1><p className="mt-1 text-sm text-[#7b838c]">Track investigation outcomes and export stakeholder-ready summaries.</p></div><button type="button" onClick={handleGenerateReport} disabled={isGenerating} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1769e8] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#0e5bd0] disabled:cursor-wait disabled:opacity-70"><Download className="h-3.5 w-3.5" /> {isGenerating ? "Generating..." : "Generate report"}</button></header>

<section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">{[{ label: "Recovered this month", value: "LKR 284,000", detail: "+18% vs July", icon: TrendingUp, tone: "text-[#00a979]" }, { label: "Confirmed fraud", value: "12", detail: "4 cases escalated", icon: FileBarChart2, tone: "text-[#ef1624]" }, { label: "False positive rate", value: "6.4%", detail: "-1.2% vs July", icon: TrendingDown, tone: "text-[#398bff]" }].map((metric) => <article key={metric.label} className="rounded-2xl border border-[#e8eaed] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(26,36,44,0.025)]"><div className="flex items-start justify-between"><p className="text-[11px] text-[#606a73]">{metric.label}</p><metric.icon className={`h-4 w-4 ${metric.tone}`} /></div><p className="mt-1 text-[27px] font-semibold leading-none tracking-[-0.04em]">{metric.value}</p><p className="mt-2 text-[10px] text-[#9299a0]">{metric.detail}</p></article>)}</section>

<section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]"><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_2px_10px_rgba(26,36,44,0.02)] sm:p-6"><div className="mb-5"><h2 className="text-sm font-semibold text-[#20252a]">Report library</h2><p className="mt-1 text-[11px] text-[#9299a0]">Previously generated fraud intelligence reports</p></div><div className="divide-y divide-[#edf0f2]">{reports.map((report) => <div key={report.name} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef5ff] text-[#398bff]"><report.icon className="h-4 w-4" /></div><div className="min-w-0"><p className="truncate text-xs font-medium text-[#30373d]">{report.name}</p><p className="mt-1 text-[10px] text-[#9299a0]">{report.type} · {report.date}</p></div></div><button type="button" aria-label={`Download ${report.name}`} className="shrink-0 rounded-lg p-2 text-[#7b838c] hover:bg-[#f3f7fb] hover:text-[#1769e8]"><Download className="h-4 w-4" /></button></div>)}</div></article><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_2px_10px_rgba(26,36,44,0.02)] sm:p-6"><h2 className="text-sm font-semibold text-[#20252a]">Top risk providers</h2><p className="mt-1 text-[11px] text-[#9299a0]">Based on confirmed and open cases</p><div className="mt-6 space-y-5">{[{ name: "BlueCross", value: "38%", width: "38%", color: "#ef1624" }, { name: "Aetna", value: "24%", width: "24%", color: "#ff9d00" }, { name: "Cigna", value: "17%", width: "17%", color: "#398bff" }].map((provider) => <div key={provider.name}><div className="mb-2 flex justify-between text-[11px]"><span className="text-[#65707a]">{provider.name}</span><span className="font-medium text-[#343b42]">{provider.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#f0f1f2]"><div className="h-full rounded-full" style={{ width: provider.width, backgroundColor: provider.color }} /></div></div>)}</div><Link href="/fraud-detection/claim-analysis" className="mt-7 inline-flex items-center gap-1 text-[11px] font-medium text-[#1769e8]">Open provider analysis <ArrowUpRight className="h-3 w-3" /></Link></article></section></div></div></DashboardLayout>;
}

