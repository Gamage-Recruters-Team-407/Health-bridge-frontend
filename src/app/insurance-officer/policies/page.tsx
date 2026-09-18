"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsurancePolicy, PolicyStatus } from "@/types/insurance";

const statusVariant: Record<PolicyStatus, "success" | "danger" | "warning"> = {
  ACTIVE: "success",
  EXPIRED: "danger",
  CANCELLED: "danger",
  SUSPENDED: "warning",
};

export default function PolicyLookupPage() {
  const router = useRouter();
  const toast = useToast();
  const [policyNumber, setPolicyNumber] = useState("");
  const [policy, setPolicy] = useState<InsurancePolicy | null>(null);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (!policyNumber.trim()) return;
    setSearching(true);
    setPolicy(null);
    try {
      const result = await insuranceService.verifyPolicy(policyNumber.trim());
      setPolicy(result);
    } catch {
      toast.error("Error", "Policy not found");
    } finally {
      setSearching(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Policies" userRole="INSURANCE_OFFICER">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 max-w-md flex-1">
          <Input
            placeholder="Search by policy number..."
            value={policyNumber}
            onChange={e => setPolicyNumber(e.target.value)}
          />
          <Button isLoading={searching} onClick={search}>Search</Button>
        </div>
        <Button onClick={() => router.push("/insurance-officer/policies/new")}>
          New Policy
        </Button>
      </div>

      {policy && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {policy.policyNumber}
              <Badge variant={statusVariant[policy.status]}>{policy.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
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
      )}
    </DashboardLayout>
  );
}