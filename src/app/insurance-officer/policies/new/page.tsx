"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";

export default function NewPolicyPage() {
  const router = useRouter();
  const toast = useToast();

  const [patientId, setPatientId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [coverageAmount, setCoverageAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!patientId.trim() || !providerName.trim() || !policyType.trim()) {
      toast.error("Fill in all required fields");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }
    if (coverageAmount <= 0) {
      toast.error("Enter a valid coverage amount");
      return;
    }

    setSubmitting(true);
    try {
      const policy = await insuranceService.createPolicy({
        patientId, providerName, policyType, coverageAmount, startDate, endDate,
      });
      toast.success(`Policy ${policy.policyNumber} created`);
      router.push(`/insurance-officer/policies/${policy.id}`);
    } catch {
      toast.error("Failed to create policy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="New Policy" userRole="INSURANCE_OFFICER">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Register a New Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <Input label="Provider Name" value={providerName} onChange={e => setProviderName(e.target.value)}
            placeholder="e.g. Ceylinco Life" />
          <Input label="Policy Type" value={policyType} onChange={e => setPolicyType(e.target.value)}
            placeholder="e.g. Health, Family Floater" />
          <Input label="Coverage Amount ($)" type="number" value={coverageAmount}
            onChange={e => setCoverageAmount(Number(e.target.value))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={startDate}
              onChange={e => setStartDate(e.target.value)} />
            <Input label="End Date" type="date" value={endDate}
              onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button isLoading={submitting} onClick={handleSubmit}>Create Policy</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}