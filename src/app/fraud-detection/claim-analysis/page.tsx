"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, FileSearch, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FraudDetectionTabs from "@/components/fraud-detection/FraudDetectionTabs";
import { fraudDetectionService, type FraudRecord } from "@/services/fraudDetectionService";

const text = (record: FraudRecord | undefined, ...keys: string[]) => { const key = keys.find((item) => record?.[item] !== undefined && record[item] !== null); return key ? String(record?.[key]) : "-"; };

export default function ClaimAnalysisPage() {
  const [claimId, setClaimId] = useState("");
  const [analysis, setAnalysis] = useState<FraudRecord>();
  const [patients, setPatients] = useState<FraudRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("claimId") ?? "";
    setClaimId(id);
    Promise.all([fraudDetectionService.getHighRiskPatients(), id ? fraudDetectionService.analyzeClaim(id) : Promise.resolve({})]).then(([riskPatients, result]) => { setPatients(riskPatients.items); setAnalysis(result); }).catch(() => setError("Claim analysis data is unavailable.")).finally(() => setLoading(false));
  }, []);
  const analyze = async () => { if (!claimId) return; setAnalyzing(true); setMessage(null); try { setAnalysis(await fraudDetectionService.analyzeClaim(claimId)); setMessage("Claim analysis refreshed."); } catch { setMessage("Claim analysis could not be completed."); } finally { setAnalyzing(false); } };

  return <DashboardLayout pageTitle="Insurance" userRole="INSURANCE_OFFICER"><div className="min-h-screen bg-[#fbfcfd] px-4 py-6 text-[#16191d] sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><FraudDetectionTabs /><Link href="/fraud-detection/alerts" className="mb-5 inline-flex items-center gap-2 text-[11px] text-[#6c7680]"><ArrowLeft className="h-3.5 w-3.5" /> Back to alerts</Link><header className="mb-7"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7680]">Investigation workspace</p><h1 className="text-[28px] font-semibold sm:text-[32px]">Claim analysis</h1><p className="mt-1 text-sm text-[#7b838c]">Inspect the live analysis returned for a flagged claim.</p></header>{loading && <div role="status" className="rounded-2xl border bg-white p-8 text-center text-sm text-[#707981]">Loading claim analysis...</div>}{error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>}{!loading && !error && <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]"><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h2 className="text-lg font-semibold">{claimId || "No claim selected"}</h2><span className="rounded-full bg-[#fff7e8] px-2 py-1 text-[10px]">{text(analysis, "severity", "riskLevel", "risk")}</span></div><p className="mt-1 text-[11px] text-[#9299a0]">{text(analysis, "claimSummary", "description", "reason")}</p></div><FileSearch className="h-5 w-5 text-[#398bff]" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(analysis ?? {}).slice(0, 8).map(([key, value]) => <div key={key} className="rounded-xl bg-[#fafbfc] px-4 py-3"><p className="text-[10px] text-[#9299a0]">{key}</p><p className="mt-1 wrap-break-word text-sm font-medium text-[#30373d]">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p></div>)}</div><button type="button" disabled={!claimId || analyzing} onClick={analyze} className="mt-5 rounded-lg bg-[#1769e8] px-4 py-2 text-xs font-medium text-white disabled:opacity-60">{analyzing ? "Analyzing..." : "Analyze claim"}</button>{message && <p role="status" className="mt-3 text-xs text-[#008b65]">{message}</p>}</article><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-[#ef1624]" /><h2 className="text-sm font-semibold">High-risk patients</h2></div>{patients.length === 0 ? <p className="mt-5 text-sm text-[#9299a0]">No high-risk patients returned.</p> : <div className="mt-5 space-y-3">{patients.map((patient, index) => <div key={index} className="border-b border-[#edf0f2] pb-3"><p className="text-xs font-medium">{text(patient, "patientName", "name", "patientId")}</p><p className="mt-1 text-[11px] text-[#707981]">Risk score: {text(patient, "score", "riskScore", "value")}</p></div>)}</div>}</article></section>}</div></div></DashboardLayout>;
}
