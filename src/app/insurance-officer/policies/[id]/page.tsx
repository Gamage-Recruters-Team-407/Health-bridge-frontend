"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsurancePolicy, PolicyStatus } from "@/types/insurance";

const statusVariant: Record<PolicyStatus, "success" | "danger" | "warning"> = {
  ACTIVE: "success",
  EXPIRED: "danger",
  CANCELLED: "danger",
  SUSPENDED: "warning",
};

export default function PolicyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [policy, setPolicy] = useState<InsurancePolicy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insuranceService
      .getPolicyById(id)
      .then(setPolicy)
      .catch(() => toast.error("Failed to load policy"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!policy) return <p className="text-red-500">Policy not found</p>;

  return (
    <DashboardLayout pageTitle={`Policy ${policy.policyNumber}`} userRole="INSURANCE_OFFICER">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {policy.policyNumber}
            <Badge variant={statusVariant[policy.status]}>{policy.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-slate-500">Patient ID</p>
            <p className="font-medium">{policy.patientId}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Provider</p>
            <p className="font-medium">{policy.providerName}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Type</p>
            <p className="font-medium">{policy.policyType}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Coverage Amount</p>
            <p className="font-medium">${policy.coverageAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Coverage Used</p>
            <p className="font-medium">${policy.coverageUsed.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Valid</p>
            <p className="font-medium">
              {new Date(policy.startDate).toLocaleDateString()} – {new Date(policy.endDate).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}