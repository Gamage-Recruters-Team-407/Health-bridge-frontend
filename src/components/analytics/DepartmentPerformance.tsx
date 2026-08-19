"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DepartmentPerformance as DepartmentPerformanceData } from "@/src/types/analytics";

export default function DepartmentPerformance({ data }: { data: DepartmentPerformanceData[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}><CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} /><XAxis type="number" domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis type="category" dataKey="department" width={92} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} /><Tooltip formatter={(value: unknown) => [`${Number(value ?? 0)}%`, "Utilization"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }} /><Bar dataKey="utilization" fill="#2563eb" radius={[0, 5, 5, 0]} barSize={18} /></BarChart></ResponsiveContainer></div>;
}