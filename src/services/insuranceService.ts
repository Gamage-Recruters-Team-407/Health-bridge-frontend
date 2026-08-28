import api from "@/lib/axios";
import { InsuranceClaim, InsurancePolicy, ClaimDecisionRequest } from "@/types/insurance";

const BASE = "/insurance";

export const insuranceService = {
  getAllClaims: async (): Promise<InsuranceClaim[]> => {
    const res = await api.get(`${BASE}/claims`);
    return res.data;
  },
  getClaimById: async (id: string): Promise<InsuranceClaim> => {
    const res = await api.get(`${BASE}/claims/${id}`);
    return res.data;
  },
  decideClaim: async (id: string, decision: ClaimDecisionRequest): Promise<InsuranceClaim> => {
    const res = await api.patch(`${BASE}/claims/${id}/decision`, decision);
    return res.data;
  },
  getPolicyById: async (id: string): Promise<InsurancePolicy> => {
    const res = await api.get(`${BASE}/policies/${id}`);
    return res.data;
  },
  getDocumentUrl: (fileId: string) => `${BASE}/documents/${fileId}`,
};