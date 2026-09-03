import api from "@/lib/axios";
import { InsuranceClaim, InsurancePolicy, ClaimDecisionRequest } from "@/types/insurance";

const BASE = "/insurance";

export const insuranceService = {
  // --- patient-facing ---
  getMyPolicies: async (): Promise<InsurancePolicy[]> => {
    const res = await api.get(`${BASE}/policies/my`);
    return res.data;
  },
  getMyClaims: async (): Promise<InsuranceClaim[]> => {
    const res = await api.get(`${BASE}/claims/my`);
    return res.data;
  },
  submitClaim: async (
    claim: { policyId: string; treatmentDescription: string; claimAmount: number },
    documents: File[]
  ): Promise<InsuranceClaim> => {
    const formData = new FormData();
    formData.append("claim", new Blob([JSON.stringify(claim)], { type: "application/json" }));
    documents.forEach(file => formData.append("documents", file));
    const res = await api.post(`${BASE}/claims`, formData);
    return res.data;
  },

  // --- admin/insurer-facing ---
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