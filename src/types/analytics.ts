export type AnalyticsPeriod = "today" | "week" | "month" | "year";

export type TrendDirection = "up" | "down";

export type AnalyticsKpi = {
  label: string;
  value: string;
  change: string;
  direction: TrendDirection;
  trendPositive?: boolean;
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

export type FinancialRevenueSource = {
  source: string;
  value: number;
  percentage: number;
};

export type FinancialPaymentStatus = {
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  count: number;
  value: number;
};

export type FinancialRevenueTrendPoint = {
  month: string;
  revenue: number;
  previousRevenue: number;
};

export type FinancialTransactionPoint = {
  month: string;
  successful: number;
  pending: number;
  failed: number;
  refunds: number;
};

export type FinancialDepartmentRevenue = {
  department: string;
  revenue: number;
};

export type FinancialRevenueGrowth = {
  source: string;
  growth: number;
};

export type FinancialPerformanceRow = {
  source: string;
  transactions: number;
  revenue: number;
  pending: number;
  growth: number;
  status: "Strong" | "Stable" | "Watch" | "Attention";
};

export type FinancialAnalyticsData = {
  kpis: AnalyticsKpi[];
  revenueTrend: FinancialRevenueTrendPoint[];
  revenueBySource: FinancialRevenueSource[];
  paymentStatus: FinancialPaymentStatus[];
  transactionActivity: FinancialTransactionPoint[];
  departmentRevenue: FinancialDepartmentRevenue[];
  revenueGrowth: FinancialRevenueGrowth[];
  performance: FinancialPerformanceRow[];
};

export type FinancialAnalyticsByPeriod = Record<AnalyticsPeriod, FinancialAnalyticsData>;