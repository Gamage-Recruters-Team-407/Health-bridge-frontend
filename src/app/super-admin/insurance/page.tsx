"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  TablePagination 
} from "@/components/ui/Table";

import { 
  Shield,
  CheckCircle,
  Clock,
  Ban,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Plus,
  X,
  Sparkles
} from "lucide-react";
import { superAdminService, InsuranceProviderResponseDto } from "@/services/superadmin.service";
import { toast } from "react-hot-toast";

export default function InsuranceManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All providers");
  const [providers, setProviders] = useState<InsuranceProviderResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Dropdown & Modal States
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProviderResponseDto | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [regionFilter, setRegionFilter] = useState("All regions");

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getAllInsuranceProviders();
      setProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch providers", error);
      toast.error("Failed to load providers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      await superAdminService.seedInsuranceProviders();
      toast.success("Demo insurance providers seeded successfully!");
      fetchProviders();
    } catch (error) {
      console.error("Failed to seed providers", error);
      toast.error("Failed to seed provider data");
    } finally {
      setIsSeeding(false);
    }
  };

  const updateProviderStatus = async (providerId: string, status: string) => {
    try {
      await superAdminService.updateInsuranceProviderStatus(providerId, status);
      toast.success(`Provider status updated to ${status}`);
      setOpenDropdownId(null);
      fetchProviders();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update provider status");
    }
  };

  const deleteProvider = async (providerId: string) => {
    try {
      await superAdminService.deleteInsuranceProvider(providerId);
      toast.success("Provider deleted successfully");
      setOpenDropdownId(null);
      fetchProviders();
    } catch (error) {
      console.error("Failed to delete provider", error);
      toast.error("Failed to delete provider");
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    const normalized = status.toUpperCase();
    if (normalized === "APPROVED") return "Approved";
    if (normalized === "PENDING" || normalized === "PENDING_APPROVAL") return "Pending approval";
    if (normalized === "SUSPENDED") return "Suspended";
    return status;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success" dot size="sm">Approved</Badge>;
      case "Pending approval":
        return <Badge variant="warning" dot size="sm">Pending approval</Badge>;
      case "Suspended":
        return <Badge variant="danger" dot size="sm">Suspended</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  // Metric counts
  const totalCount = providers.length;
  const approvedCount = providers.filter((p) => formatStatus(p.status) === "Approved").length;
  const pendingCount = providers.filter((p) => formatStatus(p.status) === "Pending approval").length;
  const suspendedCount = providers.filter((p) => formatStatus(p.status) === "Suspended").length;
  const approvedPercentage = totalCount === 0 ? 0 : ((approvedCount / totalCount) * 100).toFixed(1);

  const tabs = [
    { name: "All providers", count: totalCount.toString() },
    { name: "Approved", count: approvedCount.toString() },
    { name: "Pending approval", count: pendingCount.toString() },
    { name: "Suspended", count: suspendedCount.toString() },
  ];

  // Filtering
  const filteredProviders = providers.filter((provider) => {
    // 1. Tab Filter
    const status = formatStatus(provider.status);
    let tabMatch = true;
    if (activeTab === "Approved") tabMatch = status === "Approved";
    else if (activeTab === "Pending approval") tabMatch = status === "Pending approval";
    else if (activeTab === "Suspended") tabMatch = status === "Suspended";

    // 2. Search Query Filter
    const searchMatch =
      !searchQuery ||
      provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.licenseNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.providerId?.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Status Filter
    const statusMatch =
      statusFilter === "All statuses" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    // 4. Region Filter
    const regionMatch =
      regionFilter === "All regions" ||
      (provider.coverageRegions &&
        provider.coverageRegions.some((r) =>
          r.toLowerCase().includes(regionFilter.toLowerCase())
        ));

    return tabMatch && searchMatch && statusMatch && regionMatch;
  });

  // Pagination
  const itemsPerPage = 8;
  const totalRecords = filteredProviders.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedProviders = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter, regionFilter]);

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white tracking-tight">
              Insurance Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Manage insurance partners, policy coverage verifications, and compliance statuses.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {providers.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles size={14} className="text-amber-500" />}
                onClick={handleSeedData}
                disabled={isSeeding}
                className="text-slate-700 font-semibold border-amber-200 hover:bg-amber-50"
              >
                {isSeeding ? "Seeding..." : "Seed Demo Providers"}
              </Button>
            )}
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => router.push('/super-admin/insurance/add')}
              className="font-bold text-white bg-[#0052CC] hover:bg-blue-700 shadow-md shadow-[#0052CC]/20"
            >
              + Add Provider
            </Button>
          </div>
        </div>

        {/* 4 StatCards (Matching Staff Management) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Providers"
            value={totalCount.toLocaleString()}
            icon={<Shield size={24} />}
            iconBgColor="bg-emerald-50 text-emerald-600"
            trend={{
              value: "100%",
              isPositive: true,
              label: "vs last month",
            }}
          />
          <StatCard
            title="Approved Providers"
            value={approvedCount.toLocaleString()}
            icon={<CheckCircle size={24} />}
            iconBgColor="bg-blue-50 text-blue-600"
            subtitle={`${approvedPercentage}% of total base`}
          />
          <StatCard
            title="Pending Approval"
            value={pendingCount.toLocaleString()}
            icon={<Clock size={24} />}
            iconBgColor="bg-amber-50 text-amber-600"
            subtitle="Requires licensing review"
          />
          <StatCard
            title="Suspended"
            value={suspendedCount.toLocaleString()}
            icon={<Ban size={24} />}
            iconBgColor="bg-rose-50 text-rose-600"
            subtitle="License / compliance hold"
          />
        </div>


        {/* Status Filter Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab.name
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.name}
              <span className="ml-2 text-xs font-medium text-slate-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Bar (Reset Button Removed as requested) */}
        <Card className="p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-end gap-4 bg-white">
          {/* Search Input */}
          <div className="w-full md:flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
              Search Providers
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, license #, or contact..."
              leftIcon={<Search size={16} className="text-slate-400" />}
              className="rounded-xl bg-slate-50 border-slate-200 h-10"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-56">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
            >
              <option value="All statuses">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending approval">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="w-full md:w-56">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
              Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
            >
              <option value="All regions">All Regions</option>
              <option value="North America">North America</option>
              <option value="EU">EU</option>
              <option value="APAC">APAC</option>
              <option value="LATAM">LATAM</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </Card>

        {/* Directory Table Card (Checkbox column removed as requested) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-between overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <TableHeader>
                <TableRow className="border-b border-slate-100 bg-slate-50/50">
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pl-6">
                    Company Name
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">
                    License No.
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">
                    Contact
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">
                    Coverage Regions
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading insurance providers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      <p className="font-semibold text-slate-600">No insurance providers found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try adjusting your filters or click "Add provider" to register a new one.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProviders.map((provider) => (
                    <TableRow
                      key={provider.id || provider.providerId}
                      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Company Name */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                              provider.logoColor || "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {provider.logoText || (provider.name ? provider.name.substring(0, 2).toUpperCase() : "IN")}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0A2540]">{provider.name}</p>
                            <p className="text-[11px] font-medium text-slate-400">
                              ID: {provider.providerId}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* License */}
                      <TableCell className="py-4">
                        <p className="text-sm font-semibold text-[#0A2540]">
                          {provider.licenseNo || "N/A"}
                        </p>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="py-4">
                        <p className="text-sm font-bold text-[#0A2540]">
                          {provider.contactName || "Unassigned"}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {provider.contactRole || "Representative"}
                        </p>
                      </TableCell>

                      {/* Regions */}
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {provider.coverageRegions && provider.coverageRegions.length > 0 ? (
                            provider.coverageRegions.map((region, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                              >
                                {region}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">Global</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {getStatusBadge(formatStatus(provider.status))}
                      </TableCell>

                      {/* Actions: View (Eye), Edit (Edit icon), Dropdown (MoreVertical) */}
                      <TableCell className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedProvider(provider)}
                            className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          <Link
                            href={`/super-admin/insurance/edit/${provider.providerId || provider.id}`}
                            className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors"
                            title="Edit Provider"
                          >
                            <Edit size={16} />
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === provider.providerId
                                    ? null
                                    : provider.providerId
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Actions"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openDropdownId === provider.providerId && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 py-1 text-xs font-semibold">
                                  <button
                                    onClick={() =>
                                      updateProviderStatus(provider.providerId, "Approved")
                                    }
                                    disabled={formatStatus(provider.status) === "Approved"}
                                    className={`w-full text-left px-3 py-2 transition-colors ${
                                      formatStatus(provider.status) === "Approved"
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                  >
                                    ✓ Set as Approved
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateProviderStatus(provider.providerId, "Pending")
                                    }
                                    disabled={formatStatus(provider.status) === "Pending approval"}
                                    className={`w-full text-left px-3 py-2 transition-colors ${
                                      formatStatus(provider.status) === "Pending approval"
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-amber-600 hover:bg-amber-50"
                                    }`}
                                  >
                                    ⚠ Set as Pending
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateProviderStatus(provider.providerId, "Suspended")
                                    }
                                    disabled={formatStatus(provider.status) === "Suspended"}
                                    className={`w-full text-left px-3 py-2 transition-colors ${
                                      formatStatus(provider.status) === "Suspended"
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-rose-600 hover:bg-rose-50"
                                    }`}
                                  >
                                    ✗ Suspend License
                                  </button>
                                  <button
                                    onClick={() => deleteProvider(provider.providerId || provider.id)}
                                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors"
                                  >
                                    🗑 Delete Provider
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </table>
          </div>

          {/* Table Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Provider Details Modal (Slide-over / Modal) */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${
                    selectedProvider.logoColor || "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {selectedProvider.logoText || (selectedProvider.name ? selectedProvider.name.substring(0, 2).toUpperCase() : "IN")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">{selectedProvider.name}</h3>
                  <p className="text-xs font-medium text-slate-500">ID: {selectedProvider.providerId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    License No
                  </p>
                  <p className="text-sm font-bold text-[#0A2540]">{selectedProvider.licenseNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <div>{getStatusBadge(formatStatus(selectedProvider.status))}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Primary Contact
                </p>
                <p className="text-sm font-bold text-[#0A2540]">{selectedProvider.contactName}</p>
                <p className="text-xs font-medium text-slate-500">{selectedProvider.contactRole}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Coverage Regions
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.coverageRegions?.map((r: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#0052CC]/10 text-[#0052CC] text-xs font-bold"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <Link
                href={`/super-admin/insurance/edit/${selectedProvider.providerId || selectedProvider.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052CC] hover:underline"
              >
                <Edit size={14} /> Edit Provider Details
              </Link>
              <Button
                onClick={() => setSelectedProvider(null)}
                variant="outline"
                className="font-bold text-slate-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
