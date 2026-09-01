"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim, ClaimStatus } from "@/types/insurance";
import ClaimDecisionModal from "../ClaimDecisionModal";

const statusVariant: Record<ClaimStatus, "success" | "danger" | "warning" | "primary"> = {
  APPROVED: "success",
  PAID: "primary",
  SUBMITTED: "primary",
  UNDER_REVIEW: "warning",
  REJECTED: "danger",
};

export default function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [claim, setClaim] = useState<InsuranceClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDecision, setShowDecision] = useState(false);

  const loadClaim = () => {
    setLoading(true);
    insuranceService
      .getClaimById(id)
      .then(setClaim)
      .catch(() => toast.error("Failed to load claim"))
      .finally(() => setLoading(false));
  };

  useEffect(loadClaim, [id]);

  if (loading) return <Loader />;
  if (!claim) return <p className="text-red-500">Claim not found</p>;

  const isDecided = claim.status === "APPROVED" || claim.status === "REJECTED" || claim.status === "PAID";

  return (
    <DashboardLayout pageTitle={`Claim ${claim.claimNumber}`} userRole="INSURANCE_OFFICER">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#0A2540]">Claim #{claim.claimNumber}</h2>
          <Badge variant={statusVariant[claim.status]}>{claim.status}</Badge>
        </div>
        {!isDecided && (
          <Button onClick={() => setShowDecision(true)}>Review Decision</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Claim Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-slate-500">Patient ID</p>
                <p className="font-medium">{claim.patientId}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Policy ID</p>
                <p className="font-medium">{claim.policyId}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Claim Amount</p>
                <p className="font-medium">${claim.claimAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Approved Amount</p>
                <p className="font-medium">
                  {claim.approvedAmount !== undefined ? `$${claim.approvedAmount.toFixed(2)}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Submitted</p>
                <p className="font-medium">{new Date(claim.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Reviewed</p>
                <p className="font-medium">
                  {claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString() : "Not yet reviewed"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500 mb-1">Treatment Description</p>
              <p>{claim.treatmentDescription}</p>
            </div>

            {claim.status === "REJECTED" && claim.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs uppercase text-red-600 mb-1">Rejection Reason</p>
                <p className="text-red-700">{claim.rejectionReason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {claim.documentFileIds.length === 0 ? (
              <p className="text-sm text-slate-500">No documents attached</p>
            ) : (
              <ul className="space-y-2">
                {claim.documentFileIds.map(fileId => (
                  <li key={fileId}>
                    <a
                      href={insuranceService.getDocumentUrl(fileId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View document ({fileId.slice(0, 8)}…)
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {showDecision && (
        <ClaimDecisionModal
          claim={claim}
          onClose={() => setShowDecision(false)}
          onDecided={() => {
            setShowDecision(false);
            loadClaim();
          }}
        />
      )}
    </DashboardLayout>
  );
}