export type AnalyticsPeriod = "today" | "week" | "month" | "year";

export type TrendDirection = "up" | "down";

export type AnalyticsKpi = {
  label: string;
  value: string;
  change: string;
  direction: TrendDirection;
  comparison: string;
  icon: string;
  accent: string;
};

export type PatientTrendPoint = {
  month: string;
  patients: number;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type ResourceUtilizationPoint = {
  resource: string;
  utilization: number;
  capacity: number;
};

export type DepartmentPerformance = {
  department: string;
  patients: number;
  appointments: number;
  utilization: number;
  revenue: number;
  status: "Healthy" | "Watch" | "Attention";
};

export type AnalyticsDashboardData = {
  kpis: AnalyticsKpi[];
  patientTrends: PatientTrendPoint[];
  revenue: RevenuePoint[];
  resources: ResourceUtilizationPoint[];
  departments: DepartmentPerformance[];
};