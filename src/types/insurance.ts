export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
export type ClaimStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  patientId: string;
  providerName: string;
  policyType: string;
  coverageAmount: number;
  coverageUsed: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  patientId: string;
  treatmentDescription: string;
  claimAmount: number;
  approvedAmount?: number;
  documentFileIds: string[];
  status: ClaimStatus;
  reviewedByOfficerId?: string;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ClaimDecisionRequest {
  status: 'APPROVED' | 'REJECTED';
  approvedAmount?: number;
  rejectionReason?: string;
}