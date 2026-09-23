import api from "@/lib/axios";

export type FraudRecord = Record<string, unknown>;

export interface FraudAlert extends FraudRecord {
  id?: string | number;
  alertId?: string | number;
  claimId?: string | number;
  title?: string;
  description?: string;
  severity?: string;
  status?: string;
  createdAt?: string;
  provider?: string;
}

export interface FraudList<T extends FraudRecord = FraudRecord> {
  items: T[];
  count: number;
}

export interface FraudReviewRequest {
  status: "CONFIRMED_FRAUD" | "FALSE_POSITIVE" | "ESCALATED";
  reviewNotes: string;
}

function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data: T }).data;
  }
  return value as T;
}

function listFrom<T extends FraudRecord>(value: unknown, keys: string[]): FraudList<T> {
  const unwrapped = unwrap<unknown>(value);
  if (Array.isArray(unwrapped)) return { items: unwrapped as T[], count: unwrapped.length };

  if (unwrapped && typeof unwrapped === "object") {
    const record = unwrapped as Record<string, unknown>;
    const items = keys.find((key) => Array.isArray(record[key]));
    if (items) {
      const list = record[items] as T[];
      return { items: list, count: typeof record.count === "number" ? record.count : list.length };
    }
  }

  return { items: [], count: 0 };
}

export const fraudDetectionService = {
  async getPendingAlerts(): Promise<FraudList<FraudAlert>> {
    return listFrom(await api.get("/fraud/alerts/pending"), ["alerts", "content", "items"]);
  },

  async getHighRiskAlerts(): Promise<FraudList<FraudAlert>> {
    return listFrom(await api.get("/fraud/alerts/high-risk"), ["alerts", "content", "items"]);
  },

  async getRecentAlerts(days = 7): Promise<FraudList<FraudAlert>> {
    return listFrom(await api.get("/fraud/alerts/recent", { params: { days } }), ["alerts", "content", "items"]);
  },

  async getAlertStatistics(): Promise<FraudRecord> {
    return unwrap<FraudRecord>(await api.get("/fraud/alerts/statistics"));
  },

  async reviewAlert(alertId: string | number, request: FraudReviewRequest): Promise<FraudRecord> {
    return unwrap<FraudRecord>(await api.put(`/fraud/alerts/${alertId}/review`, request));
  },

  async getRiskScoreStatistics(): Promise<FraudRecord> {
    return unwrap<FraudRecord>(await api.get("/fraud/risk-scores/statistics"));
  },

  async getHighRiskPatients(): Promise<FraudList> {
    return listFrom(await api.get("/fraud/risk-scores/high-risk/patients"), ["patients", "riskScores", "content", "items"]);
  },

  async getHighRiskDoctors(): Promise<FraudList> {
    return listFrom(await api.get("/fraud/risk-scores/high-risk/doctors"), ["doctors", "riskScores", "content", "items"]);
  },

  async getIncreasingRiskPatients(): Promise<FraudList> {
    return listFrom(await api.get("/fraud/risk-scores/increasing-risk/patients"), ["patients", "riskScores", "content", "items"]);
  },

  async getSuspiciousDoctors(): Promise<FraudList> {
    return listFrom(await api.get("/fraud/risk-scores/suspicious/doctors"), ["doctors", "riskScores", "content", "items"]);
  },

  async analyzeClaim(claimId: string | number): Promise<FraudRecord> {
    return unwrap<FraudRecord>(await api.post(`/fraud/alerts/analyze/${claimId}`));
  },
};