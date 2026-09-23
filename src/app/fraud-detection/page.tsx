"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FraudDetectionTabs from "@/components/fraud-detection/FraudDetectionTabs";
import { fraudDetectionService, type FraudAlert, type FraudRecord } from "@/services/fraudDetectionService";

const text = (record: FraudRecord | undefined, ...keys: string[]) => {
  const key = keys.find((item) => record?.[item] !== undefined && record[item] !== null);
  return key ? String(record?.[key]) : "-";
};
const score = (record: FraudRecord | undefined) => text(record, "score", "riskScore", "value");
const idOf = (alert: FraudAlert) => String(alert.alertId ?? alert.id ?? alert.claimId ?? "");

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [patients, setPatients] = useState<FraudRecord[]>([]);
  const [statistics, setStatistics] = useState<FraudRecord>();
  const [riskStatistics, setRiskStatistics] = useState<FraudRecord>();
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fraudDetectionService.getRecentAlerts(),
      fraudDetectionService.getAlertStatistics(),
      fraudDetectionService.getRiskScoreStatistics(),
      fraudDetectionService.getHighRiskPatients(),
      fraudDetectionService.getHighRiskDoctors(),
      fraudDetectionService.getIncreasingRiskPatients(),
      fraudDetectionService.getSuspiciousDoctors(),
    ]).then(([recent, alertStats, scoreStats, highRiskPatients]) => {
      if (!active) return;
      setAlerts(recent.items as FraudAlert[]);
      setStatistics(alertStats);
      setRiskStatistics(scoreStats);
      setPatients(highRiskPatients.items);
    }).catch(() => active && setError("Fraud detection data is unavailable. Please try again."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const selected = patients[selectedPatient];
  return <DashboardLayout pageTitle="Insurance" userRole="INSURANCE_OFFICER"><div className="min-h-screen bg-[#fbfcfd] px-4 py-6 text-[#16191d] sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><FraudDetectionTabs /><header className="mb-7"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7680]">Claims intelligence</p><h1 className="text-[28px] font-semibold sm:text-[32px]">Fraud detection</h1><p className="mt-1 text-sm text-[#7b838c]">Monitor suspicious claims and coordinate investigations.</p></header>
    {loading && <div role="status" className="rounded-2xl border border-[#e7e9ec] bg-white p-8 text-center text-sm text-[#707981]">Loading fraud detection data...</div>}
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>}
    {!loading && !error && <><section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Total flagged claims", text(statistics, "totalFlaggedClaims", "totalAlerts", "total"), "Across all providers"], ["High risk count", text(statistics, "highRiskCount", "highRiskAlerts"), "Needs immediate review"], ["Under review", text(statistics, "underReview", "pendingReview", "openAlerts"), "Pending analyst action"], ["Confirmed fraud", text(statistics, "confirmedFraud", "confirmedFraudCount"), "Escalated cases"]].map(([label, metric, detail]) => <article key={label} className="rounded-2xl border border-[#e8eaed] bg-white px-5 py-4"><p className="text-[11px] text-[#606a73]">{label}</p><p className="mt-1 text-[27px] font-semibold">{metric}</p><p className="mt-2 text-[10px] text-[#9299a0]">{detail}</p></article>)}</section>
  <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]"><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><div className="mb-5"><h2 className="text-sm font-semibold">Flagged claims</h2><p className="mt-1 text-[11px] text-[#9299a0]">Risk-scored claims requiring investigation</p></div><div className="overflow-x-auto rounded-xl border border-[#e3e6e9]"><table className="w-full min-w-155 border-collapse text-left"><thead className="bg-[#fbfcfd] text-[9px] uppercase text-[#6d7780]"><tr>{["Claim ID", "Patient", "Provider", "Risk", "Status", "Date"].map((heading) => <th key={heading} className="px-3 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="text-[11px] text-[#3b4249]">{alerts.length === 0 ? <tr><td colSpan={6} className="px-3 py-10 text-center text-[#9299a0]">No recent fraud alerts.</td></tr> : alerts.map((alert) => <tr key={idOf(alert)} className="border-t border-[#e9ebed]"><td className="px-3 py-3 font-semibold">{text(alert, "claimId", "id")}</td><td className="px-3 py-3">{text(alert, "patientName", "patient", "memberName")}</td><td className="px-3 py-3">{text(alert, "providerName", "provider")}</td><td className="px-3 py-3">{text(alert, "severity", "riskLevel", "risk")}</td><td className="px-3 py-3">{text(alert, "status")}</td><td className="px-3 py-3">{text(alert, "createdAt", "timestamp", "date")}</td></tr>)}</tbody></table></div></article>
        <div className="space-y-4"><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><h2 className="text-sm font-semibold">High-risk patient scores</h2>{patients.length === 0 ? <p className="mt-5 text-sm text-[#9299a0]">No high-risk patients returned.</p> : <><select value={selectedPatient} onChange={(event) => setSelectedPatient(Number(event.target.value))} className="mt-4 w-full rounded-lg border border-[#e4e7ea] bg-white px-2 py-2 text-xs">{patients.map((patient, index) => <option key={index} value={index}>{text(patient, "patientName", "name", "patientId")}</option>)}</select><p className="mt-6 text-center text-5xl font-semibold">{score(selected)}</p><p className="mt-2 text-center text-xs text-[#707981]">{text(selected, "detail", "reason", "explanation")}</p></>}</article><article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><h2 className="text-sm font-semibold">Risk score statistics</h2><div className="mt-4 space-y-3 text-xs text-[#65707a]">{Object.entries(riskStatistics ?? {}).slice(0, 6).map(([key, item]) => <div key={key} className="flex justify-between border-b border-[#edf0f2] pb-2"><span>{key}</span><strong className="text-[#343b42]">{String(item)}</strong></div>)}</div></article></div></section></>}
  </div></div></DashboardLayout>;
}
