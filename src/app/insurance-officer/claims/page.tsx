"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim, ClaimStatus } from "@/types/insurance";
import ClaimDecisionModal from "./ClaimDecisionModal";

const statusVariant: Record<ClaimStatus, "success" | "danger" | "warning" | "primary"> = {
  APPROVED: "success",
  PAID: "primary",
  SUBMITTED: "primary",
  UNDER_REVIEW: "warning",
  REJECTED: "danger",
};

export default function ClaimsListPage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeClaim, setActiveClaim] = useState<InsuranceClaim | null>(null);
  const toast = useToast();
  const router = useRouter();

  const loadClaims = () => {
    setLoading(true);
    insuranceService
      .getAllClaims()
      .then(setClaims)
      .catch(() => toast.error("Failed to load claims"))
      .finally(() => setLoading(false));
  };

  useEffect(loadClaims, []);

  const filtered = useMemo(
    () =>
      claims.filter(
        c =>
          c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.patientId.toLowerCase().includes(search.toLowerCase())
      ),
    [claims, search]
  );

  if (loading) return <Loader />;

  return (
    <DashboardLayout pageTitle="Claims" userRole="INSURANCE_OFFICER">
      <div className="mb-4">
        <Input
          placeholder="Search by claim ID or patient..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableEmpty colSpan={5} message="No claims found" />
          ) : (
            filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.claimNumber}</TableCell>
                <TableCell>{c.patientId}</TableCell>
                <TableCell>${c.claimAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/insurance-officer/claims/${c.id}`)}>
                      View
                    </Button>
                    <Button size="sm" onClick={() => setActiveClaim(c)}>
                      Review
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {activeClaim && (
        <ClaimDecisionModal
          claim={activeClaim}
          onClose={() => setActiveClaim(null)}
          onDecided={() => {
            setActiveClaim(null);
            loadClaims();
          }}
        />
      )}
    </DashboardLayout>
  );
}