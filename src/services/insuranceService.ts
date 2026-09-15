import api from "@/lib/axios";
import { InsuranceClaim, InsurancePolicy, ClaimDecisionRequest } from "@/types/insurance";

const BASE = "/insurance";

export const insuranceService = {
  // --- patient-facing ---
  getMyPolicies: async (): Promise<InsurancePolicy[]> => {
    const res: any = await api.get(`${BASE}/policies/my`);
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  getMyClaims: async (): Promise<InsuranceClaim[]> => {
    const res: any = await api.get(`${BASE}/claims/my`);
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  submitClaim: async (
    claim: { policyId: string; treatmentDescription: string; claimAmount: number },
    documents: File[]
  ): Promise<InsuranceClaim> => {
    const formData = new FormData();
    formData.append("claim", new Blob([JSON.stringify(claim)], { type: "application/json" }));
    documents.forEach(file => formData.append("documents", file));
    const res: any = await api.post(`${BASE}/claims`, formData);
    return res?.data ?? res;
  },

  // --- admin/insurer-facing ---
  getAllClaims: async (): Promise<InsuranceClaim[]> => {
    const res: any = await api.get(`${BASE}/claims`);
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  getClaimById: async (id: string): Promise<InsuranceClaim> => {
    const res: any = await api.get(`${BASE}/claims/${id}`);
    return res?.data ?? res;
  },
  decideClaim: async (id: string, decision: ClaimDecisionRequest): Promise<InsuranceClaim> => {
    const res: any = await api.patch(`${BASE}/claims/${id}/decision`, decision);
    return res?.data ?? res;
  },
  getPolicyById: async (id: string): Promise<InsurancePolicy> => {
    const res: any = await api.get(`${BASE}/policies/${id}`);
    return res?.data ?? res;
  },
  createPolicy: async (payload: {
    patientId: string;
    providerName: string;
    policyType: string;
    coverageAmount: number;
    startDate: string;
    endDate: string;
  }): Promise<InsurancePolicy> => {
    const res: any = await api.post(`${BASE}/policies`, payload);
    return res?.data ?? res;
  },
  verifyPolicy: async (policyNumber: string): Promise<InsurancePolicy> => {
    const res: any = await api.get(`${BASE}/policies/verify/${policyNumber}`);
    return res?.data ?? res;
  },
  getDocumentUrl: (fileId: string) => `${BASE}/documents/${fileId}`,
};