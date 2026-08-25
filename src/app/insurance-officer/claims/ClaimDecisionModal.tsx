"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim } from "@/types/insurance";

interface ClaimDecisionModalProps {
  claim: InsuranceClaim;
  onClose: () => void;
  onDecided: () => void;
}

export default function ClaimDecisionModal({ claim, onClose, onDecided }: ClaimDecisionModalProps) {
  const [approvedAmount, setApprovedAmount] = useState(claim.claimAmount);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const submit = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setSubmitting(true);
    try {
      await insuranceService.decideClaim(claim.id, {
        status,
        approvedAmount: status === "APPROVED" ? approvedAmount : undefined,
        rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
      });
      toast.success(`Claim ${status.toLowerCase()}`);
      onDecided();
    } catch {
      toast.error("Failed to submit decision");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Review claim ${claim.claimNumber}`}
      description={claim.treatmentDescription}
      footer={
        <>
          <Button variant="success" isLoading={submitting} onClick={() => submit("APPROVED")}>
            Approve
          </Button>
          <Button variant="danger" isLoading={submitting} onClick={() => submit("REJECTED")}>
            Reject
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-slate-600">
        Requested amount: <span className="font-semibold">${claim.claimAmount.toFixed(2)}</span>
      </p>
      <div className="space-y-4">
        <Input
          label="Approved amount"
          type="number"
          value={approvedAmount}
          onChange={e => setApprovedAmount(Number(e.target.value))}
        />
        <Input
          label="Rejection reason (if rejecting)"
          value={rejectionReason}
          onChange={e => setRejectionReason(e.target.value)}
        />
      </div>
    </Modal>
  );
}