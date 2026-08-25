"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PopulationDistributionPoint } from "@/types/analytics";

const colors = ["#2563eb", "#14b8a6", "#f59e0b"];

export default function GenderDistributionChart({ data }: { data: PopulationDistributionPoint[] }) {
  return <div className="flex min-w-0 items-center gap-4"><div className="h-40 w-40 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="count" nameKey="label" innerRadius={45} outerRadius={70} paddingAngle={3} stroke="none">{data.map((entry, index) => <Cell key={entry.label} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value: unknown) => [Number(value ?? 0).toLocaleString(), "Patients"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }} /></PieChart></ResponsiveContainer></div><div className="min-w-0 flex-1 space-y-2.5">{data.map((entry, index) => <div key={entry.label} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />{entry.label}</span><strong className="shrink-0 text-slate-800">{entry.percentage}% <span className="font-normal text-slate-400">({entry.count.toLocaleString()})</span></strong></div>)}</div></div>;
}
