"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim } from "@/types/insurance";

export default function InsuranceOfficerDashboard() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    insuranceService
      .getAllClaims()
      .then(setClaims)
      .catch(() => setError("Failed to load claims"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  const approved = claims.filter(c => c.status === "APPROVED" || c.status === "PAID").length;
  const pending = claims.filter(c => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW").length;
  const rejected = claims.filter(c => c.status === "REJECTED").length;
  const approvalRate = claims.length ? ((approved / claims.length) * 100).toFixed(0) : "0";

  return (
    <DashboardLayout pageTitle="Insurance Dashboard" userRole="INSURANCE_OFFICER">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Claims" value={claims.length} />
        <StatCard
          title="Approved"
          value={approved}
          trend={{ value: `${approvalRate}%`, isPositive: true, label: "approval rate" }}
        />
        <StatCard title="Pending Review" value={pending} />
        <StatCard title="Rejected" value={rejected} />
      </div>
    </DashboardLayout>
  );
}