import type { AnalyticsKpi, AnalyticsPeriod } from "@/src/types/analytics";

export type HealthcarePatientGrowthPoint = {
  month: string;
  totalPatients: number;
  newPatients: number;
};

export type AppointmentAnalyticsPoint = {
  month: string;
  booked: number;
  completed: number;
  cancelled: number;
  noShow: number;
  consultations: number;
};

export type ClinicalActivityPoint = {
  month: string;
  labTests: number;
  prescriptions: number;
  telemedicineSessions: number;
};

export type DemographicPoint = {
  label: string;
  value: number;
};

export type DepartmentHealthcareActivity = {
  department: string;
  patients: number;
  consultations: number;
  completionRate: number;
  status: "Healthy" | "Watch" | "Attention";
};

export type HealthcarePerformanceRow = {
  department: string;
  patients: number;
  appointments: number;
  consultations: number;
  completionRate: number;
  status: "Healthy" | "Watch" | "Attention";
};

export type HealthcareAnalyticsData = {
  kpis: AnalyticsKpi[];
  patientGrowth: HealthcarePatientGrowthPoint[];
  appointments: AppointmentAnalyticsPoint[];
  clinicalActivity: ClinicalActivityPoint[];
  ageGroups: DemographicPoint[];
  genderDistribution: DemographicPoint[];
  departments: DepartmentHealthcareActivity[];
  performance: HealthcarePerformanceRow[];
};

export type HealthcareAnalyticsByPeriod = Record<AnalyticsPeriod, HealthcareAnalyticsData>;