"use client";

import { useState } from "react";
import { operationalAnalyticsMockData } from "@/src/data/operationalAnalyticsMockData";
import type { AnalyticsPeriod } from "@/src/types/analytics";
import AnalyticsHeader from "@/src/components/analytics/AnalyticsHeader";
import AnalyticsKpiCard from "@/src/components/analytics/AnalyticsKpiCard";
import AppointmentEfficiency from "@/src/components/analytics/operational/AppointmentEfficiency";
import BedOccupancyChart from "@/src/components/analytics/operational/BedOccupancyChart";
import CapacityStatus from "@/src/components/analytics/operational/CapacityStatus";
import LabOperationalPerformance from "@/src/components/analytics/operational/LabOperationalPerformance";
import OperationalPanel from "@/src/components/analytics/operational/OperationalPanel";
import OperationalPerformanceTable from "@/src/components/analytics/operational/OperationalPerformanceTable";
import PatientFlowChart from "@/src/components/analytics/operational/PatientFlowChart";
import ResourceUtilizationTrend from "@/src/components/analytics/operational/ResourceUtilizationTrend";
import StaffUtilizationChart from "@/src/components/analytics/operational/StaffUtilizationChart";

export default function OperationalAnalyticsShell() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");
  const data = operationalAnalyticsMockData[period];

  return <main className="min-h-screen overflow-x-hidden bg-[#f7faff] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><AnalyticsHeader period={period} onPeriodChange={setPeriod} title="Operational Analytics" subtitle="Resource utilization, capacity performance, and service efficiency." /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.kpis.map((kpi) => <AnalyticsKpiCard key={kpi.label} kpi={kpi} />)}</div><div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><OperationalPanel title="Resource Utilization Trend" description="Monthly capacity usage across key resources" className="xl:col-span-2"><ResourceUtilizationTrend data={data.resourceTrend} /></OperationalPanel><OperationalPanel title="Bed Occupancy by Department" description="Current bed capacity usage by department"><BedOccupancyChart data={data.bedOccupancy} /></OperationalPanel><OperationalPanel title="Staff Utilization" description="Available and active staff by category"><StaffUtilizationChart data={data.staffUtilization} /></OperationalPanel><OperationalPanel title="Patient Flow" description="Monthly admissions, discharges, and emergency visits"><PatientFlowChart data={data.patientFlow} /></OperationalPanel><OperationalPanel title="Appointment Efficiency" description="Operational performance for the latest selected period"><AppointmentEfficiency data={data.appointmentEfficiency} /></OperationalPanel><OperationalPanel title="Laboratory Operational Performance" description="Testing workflow efficiency and turnaround"><LabOperationalPerformance data={data.labPerformance} /></OperationalPanel><OperationalPanel title="Capacity Status" description="Utilization against operational targets"><CapacityStatus data={data.capacityStatus} /></OperationalPanel></div><OperationalPanel title="Operational Performance Summary" description="Department-level capacity and service efficiency snapshot" className="mt-4"><OperationalPerformanceTable data={data.performance} /></OperationalPanel><p className="mt-5 text-center text-xs text-slate-400">Operational analytics preview uses local mock data and is ready for future API integration.</p></div></main>;
}
