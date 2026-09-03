"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim, InsurancePolicy, ClaimStatus } from "@/types/insurance";

const statusVariant: Record<ClaimStatus, "success" | "danger" | "warning" | "primary"> = {
  APPROVED: "success",
  PAID: "primary",
  SUBMITTED: "primary",
  UNDER_REVIEW: "warning",
  REJECTED: "danger",
};

export default function PatientInsurancePage() {
  const router = useRouter();
  const toast = useToast();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([insuranceService.getMyPolicies(), insuranceService.getMyClaims()])
      .then(([p, c]) => {
        setPolicies(p);
        setClaims(c);
      })
      .catch(() => toast.error("Failed to load insurance data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const activePolicy = policies.find(p => p.status === "ACTIVE");
  const remaining = activePolicy ? activePolicy.coverageAmount - activePolicy.coverageUsed : 0;

  return (
    <DashboardLayout pageTitle="My Insurance" userRole="PATIENT">
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.push("/patient/insurance/submit-claim")}>
          Submit New Claim
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Policy Status"
          value={activePolicy ? activePolicy.status : "No active policy"}
        />
        <StatCard
          title="Coverage Used"
          value={activePolicy ? `$${activePolicy.coverageUsed.toFixed(2)}` : "—"}
        />
        <StatCard
          title="Coverage Remaining"
          value={activePolicy ? `$${remaining.toFixed(2)}` : "—"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.length === 0 ? (
                <TableEmpty colSpan={4} message="No claims submitted yet" />
              ) : (
                claims.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.claimNumber}</TableCell>
                    <TableCell>${c.claimAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(c.submittedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}