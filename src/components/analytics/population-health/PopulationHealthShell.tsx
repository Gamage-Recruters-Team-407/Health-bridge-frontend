"use client";

import { useState } from "react";
import { populationHealthMockData } from "@/data/populationHealthMockData";
import type { AnalyticsPeriod } from "@/types/analytics";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsKpiCard from "@/components/analytics/AnalyticsKpiCard";
import AgeDistributionChart from "@/components/analytics/population-health/AgeDistributionChart";
import CommonConditionsChart from "@/components/analytics/population-health/CommonConditionsChart";
import GenderDistributionChart from "@/components/analytics/population-health/GenderDistributionChart";
import HealthcareUtilizationByAge from "@/components/analytics/population-health/HealthcareUtilizationByAge";
import HealthRiskDistribution from "@/components/analytics/population-health/HealthRiskDistribution";
import PopulationGrowthChart from "@/components/analytics/population-health/PopulationGrowthChart";
import PopulationHealthPanel from "@/components/analytics/population-health/PopulationHealthPanel";
import PopulationHealthSummaryTable from "@/components/analytics/population-health/PopulationHealthSummaryTable";
import PreventiveCareTrend from "@/components/analytics/population-health/PreventiveCareTrend";
import RegionalHealthPatterns from "@/components/analytics/population-health/RegionalHealthPatterns";

export default function PopulationHealthShell() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");
  const data = populationHealthMockData[period];

  return <main className="min-h-screen overflow-x-hidden bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><AnalyticsHeader period={period} onPeriodChange={setPeriod} title="Population Health" subtitle="Demographic trends, health patterns, and population-level insights." /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.kpis.map((kpi) => <AnalyticsKpiCard key={kpi.label} kpi={kpi} />)}</div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><PopulationHealthPanel title="Population Growth Trend" description="Registered population and new-patient growth over time" className="xl:col-span-2"><PopulationGrowthChart data={data.populationGrowth} /></PopulationHealthPanel><PopulationHealthPanel title="Age Distribution" description="Population share by age group"><AgeDistributionChart data={data.ageDistribution} /></PopulationHealthPanel><PopulationHealthPanel title="Gender Distribution" description="Population share by gender"><GenderDistributionChart data={data.genderDistribution} /></PopulationHealthPanel><PopulationHealthPanel title="Common Health Conditions" description="Mock population-level prevalence indicators"><CommonConditionsChart data={data.commonConditions} /></PopulationHealthPanel><PopulationHealthPanel title="Health Risk Distribution" description="Population share by risk segment"><HealthRiskDistribution data={data.healthRisk} /></PopulationHealthPanel><PopulationHealthPanel title="Healthcare Utilization by Age" description="Appointments, consultations, and lab tests by age group"><HealthcareUtilizationByAge data={data.utilizationByAge} /></PopulationHealthPanel><PopulationHealthPanel title="Preventive Care Trend" description="Screenings, routine checkups, and follow-up completion"><PreventiveCareTrend data={data.preventiveCare} /></PopulationHealthPanel><PopulationHealthPanel title="Regional Health Patterns" description="Mock area-level population health indicators" className="xl:col-span-2"><RegionalHealthPatterns data={data.regionalPatterns} /></PopulationHealthPanel></div><PopulationHealthPanel title="Population Health Summary" description="Population-group snapshot for the selected period" className="mt-4"><PopulationHealthSummaryTable data={data.summary} /></PopulationHealthPanel><p className="mt-5 text-center text-xs text-slate-400">Population health analytics preview uses local mock data and is ready for future API integration.</p></div></main>;
}
