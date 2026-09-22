"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
  Filter,
  DollarSign,
  Building2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { insuranceService } from "@/services/insuranceService";
import { InsurancePolicy, PolicyStatus } from "@/types/insurance";

const statusVariant: Record<PolicyStatus, "success" | "danger" | "warning" | "neutral"> = {
  ACTIVE: "success",
  EXPIRED: "neutral",
  CANCELLED: "danger",
  SUSPENDED: "warning",
};

export default function PolicyDirectoryPage() {
  const router = useRouter();

  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");

  // Quick verify modal/box
  const [quickSearchNumber, setQuickSearchNumber] = useState("");
  const [quickSearchLoading, setQuickSearchLoading] = useState(false);
  const [quickSearchResult, setQuickSearchResult] = useState<InsurancePolicy | null>(null);

  // Feedback notifications
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

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await insuranceService.getAllPolicies();
      setPolicies(data);
      setErrorMessage(null);
    } catch {
      showError("Failed to fetch policies from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // Quick verify lookup
  const handleQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchNumber.trim()) return;
    setQuickSearchLoading(true);
    setQuickSearchResult(null);
    try {
      const result = await insuranceService.verifyPolicy(quickSearchNumber.trim());
      setQuickSearchResult(result);
      showSuccess(`Policy ${result.policyNumber} is verified and ACTIVE!`);
    } catch {
      showError(`Policy "${quickSearchNumber}" was not found or is currently inactive.`);
    } finally {
      setQuickSearchLoading(false);
    }
  };

  // Status transition handler
  const handleStatusChange = async (policyId: string, newStatus: PolicyStatus) => {
    setUpdatingId(policyId);
    try {
      const updated = await insuranceService.updatePolicyStatus(policyId, newStatus);
      setPolicies((prev) =>
        prev.map((p) => (p.id === policyId ? { ...p, status: updated.status } : p))
      );
      showSuccess(`Policy status updated to ${newStatus}`);
    } catch {
      showError(`Failed to update policy status to ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Unique provider list
  const uniqueProviders = useMemo(() => {
    const set = new Set<string>();
    policies.forEach((p) => {
      if (p.providerName) set.add(p.providerName);
    });
    return Array.from(set).sort();
  }, [policies]);

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch =
        p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.providerName && p.providerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.policyType && p.policyType.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      const matchesProvider =
        providerFilter === "ALL" || p.providerName === providerFilter;

      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [policies, searchQuery, statusFilter, providerFilter]);

  // Live Metrics
  const metrics = useMemo(() => {
    const total = policies.length;
    const active = policies.filter((p) => p.status === "ACTIVE").length;
    const suspended = policies.filter((p) => p.status === "SUSPENDED").length;
    const totalCoverage = policies.reduce((acc, p) => acc + (p.coverageAmount || 0), 0);
    const totalUsed = policies.reduce((acc, p) => acc + (p.coverageUsed || 0), 0);
    const utilizationRate =
      totalCoverage > 0 ? ((totalUsed / totalCoverage) * 100).toFixed(1) : "0.0";

    return {
      total,
      active,
      suspended,
      totalCoverage,
      totalUsed,
      utilizationRate,
    };
  }, [policies]);

  return (
    <DashboardLayout pageTitle="Policy Directory" userRole="INSURANCE_OFFICER">
      <div className="space-y-6">
        {/* Header and Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <span>Insurance</span>
              <span>/</span>
              <span className="text-slate-400">Policy Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              Insurance Policy Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage registered patient policies, monitor coverage utilization, track renewals, and verify eligibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPolicies}
              className="gap-1.5 text-slate-600"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/insurance-officer/policies/new")}
              className="gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Policy</span>
            </Button>
          </div>
        </div>

        {/* Tab Sub-Navigation (Matching Suite Design) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl w-fit max-w-full overflow-x-auto border border-slate-200/60 text-xs font-semibold">
          <Link
            href="/insurance-officer/dashboard"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-[#0A2540] hover:bg-white/80 transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/insurance-officer/claims"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-[#0A2540] hover:bg-white/80 transition-all"
          >
            Claims
          </Link>
          <Link
            href="/insurance-officer/policies"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow-sm transition-all"
          >
            Policies
          </Link>
          <Link
            href="/fraud-detection"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-[#0A2540] hover:bg-white/80 transition-all"
          >
            Fraud Detection
          </Link>
          <Link
            href="/insurance-officer/reports"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-[#0A2540] hover:bg-white/80 transition-all"
          >
            Reports
          </Link>
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

        {/* Live Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Policies"
            value={metrics.total.toString()}
            subtitle="Registered insurance policies"
            icon={<Shield className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            title="Active Policies"
            value={metrics.active.toString()}
            subtitle={`${metrics.suspended} currently suspended`}
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Total Coverage Pool"
            value={`Rs. ${metrics.totalCoverage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Underwritten liability limit"
            icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Utilized Coverage"
            value={`Rs. ${metrics.totalUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`${metrics.utilizationRate}% overall pool utilization`}
            icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
          />
        </div>

        {/* Instant Policy Verification Bar */}
        <Card className="p-4 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white border border-blue-100/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540]">Instant Policy Verification</h3>
                <p className="text-xs text-slate-500">
                  Quickly check active status and remaining balance by policy number.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickVerify} className="flex items-center gap-2 max-w-md w-full">
              <Input
                placeholder="Enter Policy Number (e.g. POL-1001)..."
                value={quickSearchNumber}
                onChange={(e) => setQuickSearchNumber(e.target.value)}
                className="bg-white text-xs"
              />
              <Button
                type="submit"
                size="sm"
                isLoading={quickSearchLoading}
                className="flex-shrink-0"
              >
                Verify
              </Button>
            </form>
          </div>

          {quickSearchResult && (
            <div className="mt-4 p-3.5 bg-white rounded-xl border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-bold text-[#0A2540]">{quickSearchResult.policyNumber}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{quickSearchResult.providerName}</span>
                <span className="text-slate-400">•</span>
                <Badge variant={statusVariant[quickSearchResult.status]}>
                  {quickSearchResult.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>
                  Limit: <strong className="text-slate-900">Rs. {quickSearchResult.coverageAmount?.toFixed(2)}</strong>
                </span>
                <span>
                  Used: <strong className="text-amber-600">Rs. {quickSearchResult.coverageUsed?.toFixed(2)}</strong>
                </span>
                <span>
                  Remaining:{" "}
                  <strong className="text-emerald-600">
                    Rs. {(quickSearchResult.coverageAmount - quickSearchResult.coverageUsed).toFixed(2)}
                  </strong>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/insurance-officer/policies/${quickSearchResult.id}`)}
                  className="h-7 text-xs px-2.5"
                >
                  View Details
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Directory Search & Filter Controls */}
        <Card className="p-4 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by policy #, patient ID, provider, or plan type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {["ALL", "ACTIVE", "SUSPENDED", "EXPIRED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      statusFilter === status
                        ? "bg-white text-blue-600 shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status === "ALL" ? "All Statuses" : status}
                  </button>
                ))}
              </div>

              {/* Provider Dropdown */}
              {uniqueProviders.length > 0 && (
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Providers</option>
                  {uniqueProviders.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </Card>

        {/* Policies Directory Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-[#0A2540]">
                Policy Directory Listing
              </CardTitle>
              <Badge variant="primary" className="text-xs">
                {filteredPolicies.length} {filteredPolicies.length === 1 ? "Policy" : "Policies"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader />
              </div>
            ) : filteredPolicies.length === 0 ? (
              <Table>
                <TableBody>
                  <TableEmpty
                    colSpan={7}
                    message="No policies found"
                    description={
                      searchQuery || statusFilter !== "ALL" || providerFilter !== "ALL"
                        ? "No policies match the current search filters."
                        : "No insurance policies are currently registered in the database."
                    }
                  />
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Provider & Type</TableHead>
                    <TableHead>Coverage & Utilization</TableHead>
                    <TableHead>Validity Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((p) => {
                    const usedPercent =
                      p.coverageAmount > 0
                        ? Math.min(100, Math.round(((p.coverageUsed || 0) / p.coverageAmount) * 100))
                        : 0;

                    const isExpired = new Date(p.endDate) < new Date();
                    const remaining = Math.max(0, (p.coverageAmount || 0) - (p.coverageUsed || 0));

                    return (
                      <TableRow key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Policy Number */}
                        <TableCell>
                          <Link
                            href={`/insurance-officer/policies/${p.id}`}
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 group"
                          >
                            <Shield className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span>{p.policyNumber}</span>
                          </Link>
                        </TableCell>

                        {/* Patient ID */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-slate-700">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{p.patientId}</span>
                          </div>
                        </TableCell>

                        {/* Provider & Type */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{p.providerName || "N/A"}</span>
                            </div>
                            <span className="inline-block text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                              {p.policyType || "General Health"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Coverage Utilization Bar */}
                        <TableCell className="min-w-[180px]">
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-semibold text-slate-700">
                                Rs. {(p.coverageUsed || 0).toLocaleString()} / Rs. {p.coverageAmount?.toLocaleString()}
                              </span>
                              <span
                                className={`font-bold ${
                                  usedPercent > 80
                                    ? "text-red-600"
                                    : usedPercent > 50
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {usedPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usedPercent > 80
                                    ? "bg-red-500"
                                    : usedPercent > 50
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${usedPercent}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Remaining: Rs. {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </TableCell>

                        {/* Validity Dates */}
                        <TableCell>
                          <div className="text-xs space-y-0.5 text-slate-600">
                            <div className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</span>
                            </div>
                            {isExpired && p.status === "ACTIVE" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                                <AlertTriangle className="w-2.5 h-2.5" /> Expired Term
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/insurance-officer/policies/${p.id}`)}
                              className="h-8 text-xs px-2.5 gap-1"
                            >
                              <span>View</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Button>

                            {/* Status Toggle Quick Buttons */}
                            {p.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === p.id}
                                onClick={() => handleStatusChange(p.id, "SUSPENDED")}
                                className="h-8 text-xs px-2 text-amber-700 hover:bg-amber-50 border-amber-200"
                                title="Suspend Policy"
                              >
                                <PauseCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {p.status === "SUSPENDED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === p.id}
                                onClick={() => handleStatusChange(p.id, "ACTIVE")}
                                className="h-8 text-xs px-2 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                title="Reactivate Policy"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {(p.status === "ACTIVE" || p.status === "SUSPENDED") && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === p.id}
                                onClick={() => handleStatusChange(p.id, "CANCELLED")}
                                className="h-8 text-xs px-2 text-rose-700 hover:bg-rose-50 border-rose-200"
                                title="Cancel Policy"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}