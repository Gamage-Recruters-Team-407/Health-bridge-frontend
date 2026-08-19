"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClinicalActivityPoint } from "@/src/types/healthcareAnalytics";

export default function ClinicalActivityChart({ data }: { data: ClinicalActivityPoint[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} /><Bar dataKey="labTests" name="Lab Tests" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={14} /><Bar dataKey="prescriptions" name="Prescriptions" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={14} /><Bar dataKey="telemedicineSessions" name="Telemedicine" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={14} /></BarChart></ResponsiveContainer></div>;
}