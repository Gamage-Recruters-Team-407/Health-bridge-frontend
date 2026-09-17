import Link from "next/link";
import { AlertTriangle, ArrowRight, BellRing, CheckCircle2, Clock3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FraudDetectionTabs from "@/components/fraud-detection/FraudDetectionTabs";

const alerts = [
  { title: "Duplicate billing pattern detected", claim: "CLM-20481", provider: "BlueCross", time: "12 minutes ago", severity: "High", tone: "red", description: "The same procedure code was submitted twice within a 24-hour window." },
  { title: "Unusual claim frequency", claim: "CLM-20412", provider: "Aetna", time: "48 minutes ago", severity: "Medium", tone: "amber", description: "Seven outpatient claims were submitted for the same patient this month." },
  { title: "Provider code mismatch", claim: "CLM-20377", provider: "United", time: "2 hours ago", severity: "Low", tone: "green", description: "The submitted service code does not match the provider specialty." },
  { title: "High-value claim requires review", claim: "CLM-20298", provider: "Cigna", time: "Yesterday", severity: "High", tone: "red", description: "Claim value exceeds the configured threshold for manual assessment." },
];

const toneStyles = {
  red: { icon: "bg-[#fff0f1] text-[#ef1624]", badge: "bg-[#fff0f1] text-[#ef1624]" },
  amber: { icon: "bg-[#fff7e8] text-[#e88900]", badge: "bg-[#fff7e8] text-[#e88900]" },
  green: { icon: "bg-[#e8fbf4] text-[#00a979]", badge: "bg-[#e8fbf4] text-[#00a979]" },
};

export default function FraudAlertsPage() {
  return (
    <DashboardLayout pageTitle="Insurance" userRole="INSURANCE_OFFICER">
      <div className="min-h-screen bg-[#fbfcfd] px-4 py-6 text-[#16191d] sm:px-7 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1280px]">
          <FraudDetectionTabs />
          <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7680]">Claims intelligence</p>
              <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171a1e] sm:text-[32px]">Fraud alerts</h1>
              <p className="mt-1 text-sm text-[#7b838c]">Review signals that need analyst attention.</p>
            </div>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1769e8] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#0e5bd0]"><BellRing className="h-3.5 w-3.5" /> Mark all as reviewed</button>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[{ label: "Open alerts", value: "18", detail: "Awaiting review", icon: AlertTriangle, tone: "text-[#ef1624]" }, { label: "Reviewed today", value: "42", detail: "Across all analysts", icon: CheckCircle2, tone: "text-[#00a979]" }, { label: "Average response", value: "26m", detail: "Target is under 1 hour", icon: Clock3, tone: "text-[#398bff]" }].map((metric) => <article key={metric.label} className="rounded-2xl border border-[#e8eaed] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(26,36,44,0.025)]"><div className="flex items-start justify-between"><p className="text-[11px] text-[#606a73]">{metric.label}</p><metric.icon className={`h-4 w-4 ${metric.tone}`} /></div><p className="mt-1 text-[27px] font-semibold leading-none tracking-[-0.04em]">{metric.value}</p><p className="mt-2 text-[10px] text-[#9299a0]">{metric.detail}</p></article>)}
          </section>

          <section className="rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_2px_10px_rgba(26,36,44,0.02)] sm:p-6">
            <div className="mb-5 flex items-start justify-between"><div><h2 className="text-sm font-semibold text-[#20252a]">Recent alerts</h2><p className="mt-1 text-[11px] text-[#9299a0]">Automatically generated risk signals</p></div><button type="button" className="rounded-lg border border-[#edf0f2] px-3 py-1.5 text-[11px] font-medium text-[#414850]">Filter alerts</button></div>
            <div className="divide-y divide-[#edf0f2]">{alerts.map((alert) => { const styles = toneStyles[alert.tone as keyof typeof toneStyles]; return <article key={alert.claim} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}><AlertTriangle className="h-4 w-4" /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xs font-semibold text-[#20252a]">{alert.title}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${styles.badge}`}>{alert.severity} risk</span></div><p className="mt-1 max-w-2xl text-[11px] leading-5 text-[#707981]">{alert.description}</p><p className="mt-2 text-[10px] text-[#a0a7ad]">{alert.claim} · {alert.provider} · {alert.time}</p></div></div><Link href="/fraud-detection/claim-analysis" className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#1769e8] hover:text-[#0e5bd0]">Review claim <ArrowRight className="h-3 w-3" /></Link></article>; })}</div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
