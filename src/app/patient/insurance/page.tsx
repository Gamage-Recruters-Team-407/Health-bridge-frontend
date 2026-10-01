"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Download,
  DollarSign,
  Building2,
  Calendar,
  User,
  ArrowUpRight,
  RefreshCw,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Lock,
  Bell,
  Sparkles,
  Printer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
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
import Loader from "@/components/ui/Loader";
import { insuranceService } from "@/services/insuranceService";
import { InsuranceClaim, InsurancePolicy, ClaimStatus } from "@/types/insurance";
import { generatePatientStatementPdf } from "@/lib/insurancePdfGenerator";

const statusVariant: Record<ClaimStatus, "success" | "danger" | "warning" | "primary"> = {
  APPROVED: "success",
  PAID: "primary",
  SUBMITTED: "primary",
  UNDER_REVIEW: "warning",
  REJECTED: "danger",
};

export default function PatientInsurancePage() {
  const router = useRouter();

  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("This year");

  // Interactive notification toggles
  const [notifyStatusUpdates, setNotifyStatusUpdates] = useState(true);
  const [notifyBillingReminders, setNotifyBillingReminders] = useState(false);
  const [notifyStatements, setNotifyStatements] = useState(true);

  // Notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [policiesData, claimsData] = await Promise.all([
        insuranceService.getMyPolicies(),
        insuranceService.getMyClaims(),
      ]);
      setPolicies(policiesData);
      setClaims(claimsData);
      setErrorMessage(null);
    } catch {
      showError("Failed to load your insurance information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activePolicy = useMemo(
    () => policies.find((p) => p.status === "ACTIVE") || policies[0] || null,
    [policies]
  );

  const remainingCoverage = useMemo(() => {
    if (!activePolicy) return 0;
    return Math.max(0, (activePolicy.coverageAmount || 0) - (activePolicy.coverageUsed || 0));
  }, [activePolicy]);

  const coveragePercent = useMemo(() => {
    if (!activePolicy || !activePolicy.coverageAmount) return 0;
    return Math.min(
      100,
      Math.round(((activePolicy.coverageUsed || 0) / activePolicy.coverageAmount) * 100)
    );
  }, [activePolicy]);

  // Live Metrics (from dynamic claim database records)
  const metrics = useMemo(() => {
    const totalFiled = claims.length;
    const approvedCount = claims.filter(
      (c) => c.status === "APPROVED" || c.status === "PAID"
    ).length;
    const pendingCount = claims.filter(
      (c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW"
    ).length;
    const totalReimbursed = claims
      .filter((c) => c.status === "APPROVED" || c.status === "PAID")
      .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);

    return {
      totalFiled,
      approvedCount,
      pendingCount,
      totalReimbursed,
    };
  }, [claims]);

  // Filtered Claims for table
  const filteredClaims = useMemo(() => {
    if (!searchQuery.trim()) return claims;
    const q = searchQuery.toLowerCase();
    return claims.filter(
      (c) =>
        c.claimNumber.toLowerCase().includes(q) ||
        (c.providerName && c.providerName.toLowerCase().includes(q)) ||
        (c.treatmentDescription && c.treatmentDescription.toLowerCase().includes(q))
    );
  }, [claims, searchQuery]);

  // Export Statement as PDF
  const handleExportStatement = () => {
    try {
      const pdfBlob = generatePatientStatementPdf(activePolicy, claims, metrics);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Insurance_Statement_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess("Insurance statement downloaded as PDF.");
    } catch {
      showError("Failed to generate insurance statement PDF.");
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
            Insurance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your coverage, claims, and medical bills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="gap-1.5 text-slate-600"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/patient/insurance/submit-claim")}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Claim</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banners */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top 4 Live Metric Cards (Matching Figma Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Claims Filed"
          value={metrics.totalFiled.toString()}
          subtitle="Submitted by you"
          icon={<FileText className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Claims Approved"
          value={metrics.approvedCount.toString()}
          subtitle="Paid to you"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Pending Claims"
          value={metrics.pendingCount.toString()}
          subtitle="Being reviewed"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Amount Reimbursed"
          value={`Rs. ${metrics.totalReimbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Total paid back"
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Coverage Card & My Claims Table) */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Coverage Card (Matching Figma Design) */}
          <Card className="p-6 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0A2540]">My Coverage</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View your plan details, deductible status, and out-of-pocket max.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleExportStatement} className="gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/patient/insurance/submit-claim")}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Claim</span>
                </Button>
              </div>
            </div>

            {/* 3 Mini Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Plan Status
                </span>
                <p className="text-sm font-extrabold text-emerald-600">
                  {activePolicy ? activePolicy.status : "No Active Plan"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activePolicy?.endDate
                    ? `Active until ${new Date(activePolicy.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}`
                    : "No expiration set"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Coverage Used
                </span>
                <p className="text-sm font-extrabold text-slate-900">
                  Rs. {(activePolicy?.coverageUsed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-500">
                  of Rs. {(activePolicy?.coverageAmount || 0).toLocaleString()} annual limit
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Remaining Balance
                </span>
                <p className="text-sm font-extrabold text-blue-600">
                  Rs. {remainingCoverage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-500">Remaining this year</p>
              </div>
            </div>

            {/* Progress Bar */}
            {activePolicy && (
              <div className="mt-4 pt-2 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Coverage Pool Utilization</span>
                  <span className="font-bold text-slate-700">{coveragePercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      coveragePercent > 80
                        ? "bg-red-500"
                        : coveragePercent > 50
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${coveragePercent}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* My Claims Table Card (Matching Figma Design) */}
          <Card className="shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-[#0A2540]">
                    My Claims
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track your claims and see what&apos;s next.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredClaims.length === 0 ? (
                <Table>
                  <TableBody>
                    <TableEmpty
                      colSpan={7}
                      message="No claims found"
                      description={
                        searchQuery
                          ? "No claims match your search query."
                          : "You have not submitted any insurance claims yet."
                      }
                    />
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim #</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map((c) => (
                      <TableRow key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Claim # */}
                        <TableCell>
                          <Link
                            href={`/patient/insurance/claims/${c.id}`}
                            className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            <span>{c.claimNumber}</span>
                          </Link>
                        </TableCell>

                        {/* Provider */}
                        <TableCell className="text-xs font-semibold text-slate-800">
                          {c.providerName || activePolicy?.providerName || "Ceylinco Life"}
                        </TableCell>

                        {/* Service */}
                        <TableCell className="text-xs text-slate-600 max-w-[140px] truncate">
                          {c.treatmentDescription || "Medical Service"}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-slate-500">
                          {c.submittedAt
                            ? new Date(c.submittedAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-xs font-bold text-slate-900">
                          Rs. {c.claimAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={statusVariant[c.status]}>
                            {c.status === "UNDER_REVIEW" ? "In Review" : c.status}
                          </Badge>
                        </TableCell>

                        {/* Actions (View and Track buttons) */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/patient/insurance/claims/${c.id}`)}
                              className="h-7 text-xs px-2.5"
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => router.push(`/patient/insurance/claims/${c.id}`)}
                              className="h-7 text-xs px-2.5 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Track
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Claim Help, FAQs, Billing Summary) */}
        <div className="space-y-6">
          {/* Claim Help Card */}
          <Card className="p-5 bg-white shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">Claim Help</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit a claim, upload documents, and contact support.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/80 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">Submit New Claim</p>
                  <p className="text-[11px] text-slate-400">Upload a bill and submit for reimbursement</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/patient/insurance/submit-claim")}
                  className="h-7 text-xs px-2.5"
                >
                  <span>Start claim</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="font-bold text-slate-800">Upload Documents</p>
                  <p className="text-[11px] text-slate-400">Add receipts and medical bills</p>
                </div>
                <div className="w-8 h-4 rounded-full bg-blue-600 relative cursor-pointer">
                  <div className="w-3.5 h-3.5 rounded-full bg-white absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="font-bold text-slate-800">Contact Support</p>
                  <p className="text-[11px] text-slate-400">Message support or call for help</p>
                </div>
                <div className="w-8 h-4 rounded-full bg-blue-600 relative cursor-pointer">
                  <div className="w-3.5 h-3.5 rounded-full bg-white absolute right-0.5 top-0.5" />
                </div>
              </div>
            </div>
          </Card>

          {/* FAQs Card (Matching Figma Design) */}
          <Card className="p-5 bg-white shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">FAQs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick answers about claims and billing.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <details className="group p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 open:bg-blue-50/40">
                <summary className="font-semibold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                  <span>How claims work</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  Submit your hospital bills and prescriptions. An insurance officer verifies coverage and issues payment directly to your account.
                </p>
              </details>

              <details className="group p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 open:bg-blue-50/40">
                <summary className="font-semibold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                  <span>What to upload</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  Upload itemized invoices, payment receipts, diagnostic lab reports, and doctor referrals in PDF or image format.
                </p>
              </details>

              <details className="group p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 open:bg-blue-50/40">
                <summary className="font-semibold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                  <span>Payment timeline</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  Most claims are adjudicated within 24 to 48 hours of submission.
                </p>
              </details>
            </div>
          </Card>

          {/* Billing Summary Card */}
          <Card className="p-5 bg-white shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">Billing Summary</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                View statements and payment history.
              </p>
            </div>

            <div className="space-y-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="This year">This year</option>
                <option value="2025">2025</option>
                <option value="All Time">All Time</option>
              </select>

              <Button
                onClick={handleExportStatement}
                className="w-full text-xs font-semibold py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                Download Statement (PDF)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Notifications & Activity History (Matching Figma Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Preferences Card */}
        <Card className="p-5 bg-white shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0A2540] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Notifications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Get notified when your claim status changes.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div>
                <p className="font-bold text-slate-800">Claim status updates</p>
                <p className="text-[11px] text-slate-400">Submitted, approved, paid, or denied</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyStatusUpdates(!notifyStatusUpdates)}
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  notifyStatusUpdates ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    notifyStatusUpdates ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div>
                <p className="font-bold text-slate-800">Billing reminders</p>
                <p className="text-[11px] text-slate-400">Payment due and statement ready</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyBillingReminders(!notifyBillingReminders)}
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  notifyBillingReminders ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    notifyBillingReminders ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div>
                <p className="font-bold text-slate-800">Statements</p>
                <p className="text-[11px] text-slate-400">Get statements and payment confirmations</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyStatements(!notifyStatements)}
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  notifyStatements ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    notifyStatements ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Activity History Card (Matching Figma Design) */}
        <Card className="p-5 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0A2540]">Activity History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                What happened with your claims.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <Lock className="w-3 h-3" />
              <span>Claims Protected</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {claims.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-400 text-center text-xs">
                No recent claim activity yet.
              </div>
            ) : (
              claims.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">
                      {c.status === "APPROVED"
                        ? `Claim ${c.claimNumber} was approved`
                        : c.status === "REJECTED"
                        ? `Claim ${c.claimNumber} was declined`
                        : `You submitted claim ${c.claimNumber}`}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          c.status === "APPROVED" || c.status === "PAID"
                            ? "text-emerald-600"
                            : c.status === "REJECTED"
                            ? "text-rose-600"
                            : "text-amber-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {c.submittedAt
                      ? new Date(c.submittedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "Recent"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}