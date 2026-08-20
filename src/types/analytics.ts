export type AnalyticsPeriod = "today" | "week" | "month" | "year";

export type TrendDirection = "up" | "down";
export type TrendImpact = "positive" | "negative" | "neutral";

export type AnalyticsKpi = {
  label: string;
  value: string;
  change: string;
  direction: TrendDirection;
  trendPositive?: boolean;
  trendImpact?: TrendImpact;
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

export type OperationalResourceTrendPoint = {
  month: string;
  beds: number;
  staff: number;
  equipment: number;
  laboratory: number;
};

export type OperationalBedOccupancy = {
  department: string;
  occupancy: number;
  status: "Healthy" | "Watch" | "Critical";
};

export type OperationalStaffUtilization = {
  category: string;
  available: number;
  active: number;
  utilization: number;
};

export type OperationalPatientFlowPoint = {
  month: string;
  admissions: number;
  discharges: number;
  emergencyVisits: number;
};

export type OperationalAppointmentEfficiency = {
  month: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  averageWait: number;
  onTimeRate: number;
};

export type OperationalLabPerformance = {
  month: string;
  testsReceived: number;
  completedTests: number;
  pendingTests: number;
  criticalResults: number;
  averageTurnaround: number;
};

export type OperationalCapacityStatus = {
  resource: string;
  utilization: number;
  target: number;
  status: "Healthy" | "Watch" | "Capacity Pressure";
};

export type OperationalPerformanceRow = {
  department: string;
  bedOccupancy: number;
  staffUtilization: number;
  averageWait: number;
  appointmentCompletion: number;
  labTurnaround: number;
  status: "Healthy" | "Watch" | "Attention" | "Capacity Pressure";
};

export type OperationalAnalyticsData = {
  kpis: AnalyticsKpi[];
  resourceTrend: OperationalResourceTrendPoint[];
  bedOccupancy: OperationalBedOccupancy[];
  staffUtilization: OperationalStaffUtilization[];
  patientFlow: OperationalPatientFlowPoint[];
  appointmentEfficiency: OperationalAppointmentEfficiency[];
  labPerformance: OperationalLabPerformance[];
  capacityStatus: OperationalCapacityStatus[];
  performance: OperationalPerformanceRow[];
};

export type OperationalAnalyticsByPeriod = Record<AnalyticsPeriod, OperationalAnalyticsData>;

export type PopulationGrowthPoint = {
  month: string;
  totalPopulation: number;
  newPatients: number;
};

export type PopulationDistributionPoint = {
  label: string;
  count: number;
  percentage: number;
};

export type PopulationConditionPoint = {
  condition: string;
  affectedPatients: number;
  prevalence: number;
};

export type PopulationRiskPoint = {
  risk: "Low Risk" | "Moderate Risk" | "High Risk";
  count: number;
  percentage: number;
};

export type PopulationUtilizationPoint = {
  ageGroup: string;
  appointments: number;
  consultations: number;
  labTests: number;
};

export type RegionalHealthPoint = {
  region: string;
  registeredPatients: number;
  highRiskRate: number;
  screeningRate: number;
};

export type PreventiveCarePoint = {
  month: string;
  screenings: number;
  routineCheckups: number;
  followUpCompletion: number;
};

export type PopulationHealthSummaryRow = {
  populationGroup: string;
  patients: number;
  highRisk: number;
  chronicConditions: number;
  screeningRate: number;
  healthcareUtilization: number;
  status: "Healthy" | "Stable" | "Watch" | "Attention";
};

export type PopulationHealthAnalyticsData = {
  kpis: AnalyticsKpi[];
  populationGrowth: PopulationGrowthPoint[];
  ageDistribution: PopulationDistributionPoint[];
  genderDistribution: PopulationDistributionPoint[];
  commonConditions: PopulationConditionPoint[];
  healthRisk: PopulationRiskPoint[];
  utilizationByAge: PopulationUtilizationPoint[];
  regionalPatterns: RegionalHealthPoint[];
  preventiveCare: PreventiveCarePoint[];
  summary: PopulationHealthSummaryRow[];
};

export type PopulationHealthAnalyticsByPeriod = Record<AnalyticsPeriod, PopulationHealthAnalyticsData>;

export type ReportCategory = "Healthcare" | "Financial" | "Operational" | "Population Health" | "Hospital Performance" | "Laboratory Performance" | "Executive Summary";
export type ReportFormat = "PDF" | "Excel";
export type ReportStatus = "Completed" | "Generating" | "Failed" | "Scheduled";
export type ReportPeriod = "Today" | "This Week" | "This Month" | "This Quarter" | "This Year" | "Custom Range";

export type AnalyticsReport = {
  id: string;
  name: string;
  category: ReportCategory;
  period: ReportPeriod;
  generatedDate: string;
  format: ReportFormat;
  status: ReportStatus;
  summary: string;
  metrics: { label: string; value: string }[];
};

export type ScheduledAnalyticsReport = {
  id: string;
  report: string;
  frequency: string;
  nextRun: string;
  status: "Active" | "Paused";
};

export type ReportActivityPoint = {
  month: string;
  healthcare: number;
  financial: number;
  operational: number;
  populationHealth: number;
};