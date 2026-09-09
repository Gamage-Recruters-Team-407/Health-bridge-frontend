const claims = [
  { id: "CLM-20481", patient: "Ava Thompson", provider: "BlueCross", risk: "high", reason: "Duplicate billing", date: "12 Aug 2026" },
  { id: "CLM-20412", patient: "Marcus Lee", provider: "Aetna", risk: "medium", reason: "Unusual frequency", date: "11 Aug 2026" },
  { id: "CLM-20377", patient: "Noah Patel", provider: "United", risk: "low", reason: "Low anomaly", date: "10 Aug 2026" },
  { id: "CLM-20311", patient: "Emily Carter", provider: "Cigna", risk: "high", reason: "Confirmed fraud", date: "09 Aug 2026" },
];

const metrics = [
  { label: "Total Flagged Claims", value: "1,284", detail: "Across all providers", tone: "blue", icon: "○" },
  { label: "High Risk Count", value: "37", detail: "Needs immediate review", tone: "red", icon: "△" },
  { label: "Under Review", value: "248", detail: "Pending analyst action", tone: "sky", icon: "◷" },
  { label: "Confirmed Fraud", value: "12", detail: "Escalated cases", tone: "red", icon: "⊙" },
];

const riskLevels = [
  { label: "Low Risk", value: "62%", width: "62%", color: "#00b981" },
  { label: "Medium Risk", value: "28%", width: "28%", color: "#ff9d00" },
  { label: "High Risk", value: "10%", width: "10%", color: "#ef1624" },
];

function RiskMarker({ risk }: { risk: string }) {
  const color = risk === "high" ? "#ef1624" : risk === "medium" ? "#ff9d00" : "#00b981";
  return <span aria-label={`${risk} risk`} className="block h-1.5 w-6 rounded-full" style={{ backgroundColor: color }} />;
}

function ReasonBadge({ risk, reason }: { risk: string; reason: string }) {
  const styles = risk === "high" ? "bg-[#fff0f1] text-[#ef1624]" : risk === "medium" ? "bg-[#fff7e8] text-[#e88900]" : "bg-[#e8fbf4] text-[#00a979]";
  return <span className={`inline-flex max-w-[84px] rounded-full px-2 py-1 text-center text-[10px] font-medium leading-3 ${styles}`}>{reason}</span>;
}

export default function FraudDetectionPage() {
  return (
    <main className="min-h-screen bg-[#fbfcfd] px-4 py-6 text-[#16191d] sm:px-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c7680]">Claims intelligence</p>
            <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171a1e] sm:text-[32px]">Fraud detection</h1>
            <p className="mt-1 text-sm text-[#7b838c]">Monitor suspicious claims and coordinate investigations.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#737b84]"><span className="h-2 w-2 rounded-full bg-[#00b981]" /> Live data · 19 Aug 2026</div>
        </header>

        <section aria-label="Fraud detection metrics" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-[#e8eaed] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(26,36,44,0.025)]">
              <div className="flex items-start justify-between"><p className="text-[11px] text-[#606a73]">{metric.label}</p><span className={`text-[14px] leading-none ${metric.tone === "red" ? "text-[#ef1624]" : "text-[#398bff]"}`}>{metric.icon}</span></div>
              <p className={`mt-1 text-[27px] font-semibold leading-none tracking-[-0.04em] ${metric.tone === "red" ? "text-[#ef1624]" : "text-[#16191d]"}`}>{metric.value}</p>
              <p className="mt-2 text-[10px] text-[#9299a0]">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_2px_10px_rgba(26,36,44,0.02)] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-[#20252a]">Flagged claims</h2><p className="mt-1 text-[11px] text-[#9299a0]">Risk-scored claims requiring investigation</p></div><button type="button" className="rounded-lg border border-[#edf0f2] px-3 py-1.5 text-[11px] font-medium text-[#414850] transition hover:border-[#cad1d7] hover:bg-[#f8fafb]">Export</button></div>
            <div className="overflow-x-auto rounded-xl border border-[#e3e6e9]"><table className="w-full min-w-[650px] border-collapse text-left"><thead className="bg-[#fbfcfd] text-[9px] uppercase tracking-[0.04em] text-[#6d7780]"><tr>{["Claim ID", "Patient name", "Provider", "Risk", "Flag reason", "Date"].map((heading) => <th key={heading} className="px-3 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="text-[11px] text-[#3b4249]">{claims.map((claim) => <tr key={claim.id} className="border-t border-[#e9ebed]"><td className="px-3 py-3 font-semibold text-[#2e353b]">{claim.id}</td><td className="px-3 py-3">{claim.patient}</td><td className="px-3 py-3">{claim.provider}</td><td className="px-3 py-3"><RiskMarker risk={claim.risk} /></td><td className="px-3 py-3"><ReasonBadge reason={claim.reason} risk={claim.risk} /></td><td className="whitespace-nowrap px-3 py-3 text-[#717a83]">{claim.date}</td></tr>)}</tbody></table></div>
          </article>

          <article className="rounded-2xl border border-[#e7e9ec] bg-white p-5 shadow-[0_2px_10px_rgba(26,36,44,0.02)] sm:p-6"><h2 className="text-sm font-semibold text-[#20252a]">Risk distribution</h2><p className="mt-1 text-[11px] text-[#9299a0]">Distribution of claims by risk level</p><div className="mt-6 space-y-5">{riskLevels.map((level) => <div key={level.label}><div className="mb-2 flex justify-between text-[11px] text-[#65707a]"><span>{level.label}</span><span className="font-medium text-[#343b42]">{level.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#f0f1f2]"><div className="h-full rounded-full" style={{ width: level.width, backgroundColor: level.color }} /></div></div>)}</div><div className="mt-6 rounded-xl bg-[#fafafa] px-3 py-3 text-[10px] leading-[1.45] text-[#7b838b]">Claims with repeated billing patterns and mismatched provider codes are automatically escalated for manual review.</div></article>
        </section>
      </div>
    </main>
  );
}