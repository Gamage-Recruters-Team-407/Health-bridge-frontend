"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsurancePolicy } from "@/types/insurance";

export default function SubmitClaimPage() {
  const router = useRouter();
  const toast = useToast();

  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [policyId, setPolicyId] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    insuranceService
      .getMyPolicies()
      .then(all => {
        const active = all.filter(p => p.status === "ACTIVE");
        setPolicies(active);
        if (active.length > 0) setPolicyId(active[0].id);
      })
      .catch(() => toast.error("Failed to load your policies"))
      .finally(() => setLoadingPolicies(false));
  }, []);

  const handleSubmit = async () => {
    if (!policyId) {
      toast.error("Select a policy");
      return;
    }
    if (!treatmentDescription.trim()) {
      toast.error("Description is required");
      return;
    }
    if (claimAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (files.length === 0) {
      toast.error("At least one supporting document is required");
      return;
    }

    setSubmitting(true);
    try {
      await insuranceService.submitClaim({ policyId, treatmentDescription, claimAmount }, files);
      toast.success("Claim submitted");
      router.push("/patient/insurance");
    } catch {
      toast.error("Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPolicies) return <Loader />;

  if (policies.length === 0) {
    return (
      <DashboardLayout pageTitle="Submit New Claim" userRole="PATIENT">
        <p className="text-slate-500">You have no active policy to claim against.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Submit New Claim" userRole="PATIENT">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Claim Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs uppercase text-slate-500 font-semibold">Policy</label>
            <select
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
              value={policyId}
              onChange={e => setPolicyId(e.target.value)}
            >
              {policies.map(p => (
                <option key={p.id} value={p.id}>
                  {p.policyNumber} — {p.providerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase text-slate-500 font-semibold">
              Description of Service / Incident
            </label>
            <textarea
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
              rows={4}
              value={treatmentDescription}
              onChange={e => setTreatmentDescription(e.target.value)}
              placeholder="Briefly describe the reason for visit and services received..."
            />
          </div>

          <Input
            label="Claim Amount ($)"
            type="number"
            value={claimAmount}
            onChange={e => setClaimAmount(Number(e.target.value))}
          />

          <div>
            <label className="text-xs uppercase text-slate-500 font-semibold">
              Documents (PDF, JPG, PNG — max 10MB each)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full mt-1 text-sm"
              onChange={e => setFiles(Array.from(e.target.files ?? []))}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push("/patient/insurance")}>
              Cancel
            </Button>
            <Button isLoading={submitting} onClick={handleSubmit}>
              Submit Claim
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}