"use client";

import { useState } from "react";
import { healthcareAnalyticsMockData } from "@/data/healthcareAnalyticsMockData";
import type { AnalyticsPeriod } from "@/types/analytics";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsKpiCard from "@/components/analytics/AnalyticsKpiCard";
import AppointmentAnalyticsChart from "@/components/analytics/healthcare/AppointmentAnalyticsChart";
import ClinicalActivityChart from "@/components/analytics/healthcare/ClinicalActivityChart";
import DepartmentHealthcareActivity from "@/components/analytics/healthcare/DepartmentHealthcareActivity";
import HealthcarePerformanceTable from "@/components/analytics/healthcare/HealthcarePerformanceTable";
import HealthcarePanel from "@/components/analytics/healthcare/HealthcarePanel";
import PatientDemographics from "@/components/analytics/healthcare/PatientDemographics";
import PatientGrowthChart from "@/components/analytics/healthcare/PatientGrowthChart";

export default function HealthcareAnalyticsShell() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");
  const data = healthcareAnalyticsMockData[period];

  if (!data) {
    return <main className="min-h-screen bg-[#f7faff] px-4 py-6 text-slate-900"><div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><h1 className="text-lg font-bold text-slate-900">Healthcare analytics unavailable</h1><p className="mt-2 text-sm text-slate-500">There is no healthcare data for this period.</p></div></main>;
  }

  return <main className="min-h-screen overflow-x-hidden bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><AnalyticsHeader period={period} onPeriodChange={setPeriod} title="Healthcare Analytics" subtitle="Patient activity, clinical trends, and healthcare service performance." /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.kpis.map((kpi) => <AnalyticsKpiCard key={kpi.label} kpi={kpi} />)}</div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><HealthcarePanel title="Patient Growth" description="New and total patients over time" className="xl:col-span-2"><PatientGrowthChart data={data.patientGrowth} /></HealthcarePanel><HealthcarePanel title="Appointment & Consultation Analytics" description="Monthly appointment outcomes and consultations"><AppointmentAnalyticsChart data={data.appointments} /></HealthcarePanel><HealthcarePanel title="Clinical Activity" description="Laboratory, prescription, and telemedicine activity"><ClinicalActivityChart data={data.clinicalActivity} /></HealthcarePanel><HealthcarePanel title="Patient Demographics" description="Age and gender distribution"><PatientDemographics ageGroups={data.ageGroups} genderDistribution={data.genderDistribution} /></HealthcarePanel><HealthcarePanel title="Department Healthcare Activity" description="Completion rate across healthcare services"><DepartmentHealthcareActivity data={data.departments} /></HealthcarePanel></div><HealthcarePanel title="Healthcare Performance Summary" description="Department-level clinical performance for the selected period" className="mt-4"><HealthcarePerformanceTable data={data.performance} /></HealthcarePanel><p className="mt-5 text-center text-xs text-slate-400">Healthcare analytics preview uses local mock data and is ready for future API integration.</p></div></main>;
}