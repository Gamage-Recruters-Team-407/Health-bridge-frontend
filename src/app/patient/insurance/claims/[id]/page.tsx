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

const statusVariant: Record<ClaimStatus, "success" | "danger" | "warning" | "primary"> = {
  APPROVED: "success",
  PAID: "primary",
  SUBMITTED: "primary",
  UNDER_REVIEW: "warning",
  REJECTED: "danger",
};

const statusSteps: ClaimStatus[] = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "PAID"];

export default function PatientClaimTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [claim, setClaim] = useState<InsuranceClaim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insuranceService
      .getClaimById(id)
      .then(setClaim)
      .catch(() => toast.error("Error", "Failed to load claim"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!claim) return <p className="text-red-500">Claim not found</p>;

  const isRejected = claim.status === "REJECTED";
  const currentStepIndex = statusSteps.indexOf(claim.status);

  return (
    <DashboardLayout pageTitle={`Claim ${claim.claimNumber}`} userRole="PATIENT">
      <Button variant="outline" onClick={() => router.push("/patient/insurance")} className="mb-4">
        Back to My Insurance
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Claim #{claim.claimNumber}
            <Badge variant={statusVariant[claim.status]}>{claim.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {/* Status tracker */}
          {!isRejected ? (
            <div className="flex items-center">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      i <= currentStepIndex ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                  {i < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        i < currentStepIndex ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs uppercase text-red-600 mb-1">Rejection Reason</p>
              <p className="text-red-700">{claim.rejectionReason ?? "No reason provided"}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
              <p className="text-xs uppercase text-slate-500">Last Updated</p>
              <p className="font-medium">
                {claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString() : "Pending review"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500 mb-1">Description</p>
            <p>{claim.treatmentDescription}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500 mb-1">Documents</p>
            {claim.documentFileIds.length === 0 ? (
              <p className="text-slate-500">No documents attached</p>
            ) : (
              <ul className="space-y-1">
                {claim.documentFileIds.map(fileId => (
                  <li key={fileId}>
                    <a
                      href={insuranceService.getDocumentUrl(fileId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View document ({fileId.slice(0, 8)}…)
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}