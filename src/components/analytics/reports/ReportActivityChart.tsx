"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReportActivityPoint } from "@/types/analytics";

export default function ReportActivityChart({ data }: { data: ReportActivityPoint[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={2}><CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip formatter={(value: unknown, name: string | number | undefined) => [Number(value ?? 0).toLocaleString(), name ?? "Reports"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "#eff6ff" }} /><Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} /><Bar dataKey="healthcare" name="Healthcare" fill="#2563eb" radius={[3, 3, 0, 0]} /><Bar dataKey="financial" name="Financial" fill="#0d9488" radius={[3, 3, 0, 0]} /><Bar dataKey="operational" name="Operational" fill="#f59e0b" radius={[3, 3, 0, 0]} /><Bar dataKey="populationHealth" name="Population Health" fill="#8b5cf6" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
