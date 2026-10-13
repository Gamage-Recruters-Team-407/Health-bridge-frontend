"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "@/components/ui/Table";

import { useRouter } from "next/navigation";
import { 
  Building2,
  CheckCircle,
  Clock,
  Ban,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Plus,
  X
} from "lucide-react";
import { superAdminService, LaboratoryResponseDto } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function LaboratoryRegistrationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All laboratories");
  const [laboratories, setLaboratories] = useState<LaboratoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<LaboratoryResponseDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const router = useRouter();

  const fetchLaboratories = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getAllLaboratories();
      setLaboratories(data);
    } catch (error) {
      console.error("Failed to fetch laboratories", error);
      toast.error("Failed to fetch laboratories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratories();
  }, []);

  const updateLabStatus = async (id: string, status: string) => {
    try {
      await superAdminService.updateLaboratoryStatus(id, status);
      toast.success(`Laboratory marked as ${status}`);
      setOpenDropdownId(null);
      fetchLaboratories();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    const normalized = status.toUpperCase();
    if (normalized === "APPROVED") return "Approved";
    if (normalized === "REJECTED") return "Rejected";
    if (normalized === "PENDING" || normalized === "PENDING_APPROVAL") return "Pending approval";
    return status;
  };

  const tabs = [
    { name: "All laboratories", count: laboratories.length.toString(), href: null },
    { name: "Pending approval", count: laboratories.filter(l => formatStatus(l.status) === "Pending approval").length.toString(), href: null },
    { name: "Approved", count: laboratories.filter(l => formatStatus(l.status) === "Approved").length.toString(), href: null },
    { name: "Rejected", count: laboratories.filter(l => formatStatus(l.status) === "Rejected").length.toString(), href: null },
  ];

  const filteredLaboratories = laboratories.filter(lab => {
    // 1. Tab Filtering
    const status = formatStatus(lab.status);
    let tabMatch = true;
    if (activeTab === "Approved") tabMatch = status === "Approved";
    else if (activeTab === "Pending approval") tabMatch = status === "Pending approval";
    else if (activeTab === "Rejected") tabMatch = status === "Rejected";
    
    // 2. Search Query Filtering
    const searchMatch = !searchQuery || 
      (lab.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.license || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    // 3. Status Filtering
    const statusMatch = statusFilter === "All statuses" || 
      status.toLowerCase() === statusFilter.toLowerCase();
      
    return tabMatch && searchMatch && statusMatch;
  });

  const itemsPerPage = 8;
  const totalRecords = filteredLaboratories.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedLaboratories = filteredLaboratories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge variant="success" dot size="sm">Approved</Badge>;
      case "Pending approval": return <Badge variant="warning" dot size="sm">Pending approval</Badge>;
      case "Rejected": return <Badge variant="danger" dot size="sm">Rejected</Badge>;
      default: return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  const totalCount = laboratories.length;
  const approvedCount = laboratories.filter(l => formatStatus(l.status) === "Approved").length;
  const pendingCount = laboratories.filter(l => formatStatus(l.status) === "Pending approval").length;
  const rejectedCount = laboratories.filter(l => formatStatus(l.status) === "Rejected").length;
  const approvedPercentage = totalCount === 0 ? 0 : ((approvedCount / totalCount) * 100).toFixed(1);

  const trend = {
    value: "100%",
    isPositive: true,
    label: "vs last month"
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white tracking-tight">
              Laboratory Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Manage medical laboratory registrations, licensing verifications, and operating statuses.
            </p>
          </div>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />} 
            onClick={() => router.push('/super-admin/laboratories/add')}
            className="font-bold text-white bg-[#0052CC] hover:bg-blue-700 shadow-md shadow-[#0052CC]/20"
          >
            + Add Laboratory
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Laboratories"
            value={totalCount.toLocaleString()}
            icon={<Building2 size={24} />}
            iconBgColor="bg-emerald-50 text-emerald-600 "
            trend={trend}
          />
          <StatCard
            title="Approved Laboratories"
            value={approvedCount.toLocaleString()}
            icon={<CheckCircle size={24} />}
            iconBgColor="bg-blue-50 text-blue-600 "
            subtitle={`${approvedPercentage}% of total base`}
          />
          <StatCard
            title="Pending Approval"
            value={pendingCount.toLocaleString()}
            icon={<Clock size={24} />}
            iconBgColor="bg-amber-50 text-amber-600 "
            subtitle="Needs registration review"
          />
          <StatCard
            title="Rejected"
            value={rejectedCount.toLocaleString()}
            icon={<Ban size={24} />}
            iconBgColor="bg-rose-50 text-rose-600 "
            subtitle="Registration denied"
          />
        </div>


        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                if (tab.href) {
                  router.push(tab.href);
                } else {
                  setActiveTab(tab.name);
                }
              }}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab.name
                  ? "text-emerald-600 "
                  : "text-slate-500 hover:text-slate-700 :text-slate-200"
              }`}
            >
              {tab.name}
              <span className="ml-2 text-xs font-medium text-slate-400">
                {tab.count}
              </span>
              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <Input 
              placeholder="Search by name, email or license..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-100 :ring-blue-900 flex-1 md:w-40"
            >
              <option>All statuses</option>
              <option>Approved</option>
              <option>Pending approval</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-between">
          <table className="w-full text-left text-sm text-slate-600">
            <TableHeader>
              <TableRow>
              <TableHead className="w-12 text-center">ON</TableHead>
              <TableHead>LABORATORY</TableHead>
              <TableHead>LICENSE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>OWNER</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>REQUESTED</TableHead>
              <TableHead>APPROVED</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">Loading laboratories...</TableCell>
              </TableRow>
            ) : paginatedLaboratories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">No laboratories found.</TableCell>
              </TableRow>
            ) : paginatedLaboratories.map((lab, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm mx-auto`}>
                    {(lab.name || "LB").substring(0, 2).toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-bold text-[#0A2540] ">{lab.name}</p>
                    <p className="text-xs text-slate-500">{lab.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{lab.license || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">{lab.category || "General"}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-[#0A2540] font-medium">{lab.owner || "Unknown"}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(formatStatus(lab.status))}
                </TableCell>
                <TableCell>
                  <span className="text-[#0A2540] font-medium">
                    {lab.requestDate ? lab.requestDate : "Unknown"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[#0A2540] font-medium">
                    {lab.approvedDate ? lab.approvedDate : "Unknown"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedLab(lab)} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <Link href={`/super-admin/laboratories/edit/${lab.labId || lab.id}`} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                      <Edit size={16} />
                    </Link>
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === (lab.labId || lab.id) ? null : (lab.labId || lab.id))}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {openDropdownId === (lab.labId || lab.id) && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-40 flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                            <button 
                              onClick={() => {
                                updateLabStatus(lab.labId || lab.id, "Rejected");
                              }}
                              disabled={formatStatus(lab.status) === "Rejected"}
                              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                formatStatus(lab.status) === "Rejected"
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-amber-600 hover:bg-amber-50"
                              }`}
                            >
                              Reject Laboratory
                            </button>
                            
                            <button 
                              onClick={() => {
                                updateLabStatus(lab.labId || lab.id, "Approved");
                              }}
                              disabled={formatStatus(lab.status) === "Approved"}
                              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                formatStatus(lab.status) === "Approved"
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              Approve Laboratory
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>

        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>

      {/* Drawer Panel */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedLab(null)} 
          />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A2540]">Laboratory Details</h2>
              <button 
                onClick={() => setSelectedLab(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                  {(selectedLab.name || "LB").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#0A2540]">{selectedLab.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedLab.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">License Number</p>
                  <p className="font-medium text-[#0A2540]">{selectedLab.license || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Category</p>
                  <div><Badge variant="neutral">{selectedLab.category || "General"}</Badge></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Status</p>
                  <div>{getStatusBadge(formatStatus(selectedLab.status))}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Owner</p>
                  <p className="font-medium text-[#0A2540]">{selectedLab.owner || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Requested Date</p>
                  <p className="font-medium text-[#0A2540]">
                    {selectedLab.requestDate ? selectedLab.requestDate : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Approved Date</p>
                  <p className="font-medium text-[#0A2540]">
                    {selectedLab.approvedDate ? selectedLab.approvedDate : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
              {formatStatus(selectedLab.status) === "Pending approval" && (
                <Button 
                  onClick={() => {
                    updateLabStatus(selectedLab.labId || selectedLab.id, 'Approved');
                    setSelectedLab(null);
                  }}
                  className="w-full bg-[#0052CC] hover:bg-blue-700 text-white justify-center"
                >
                  Approve Registration
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedLab(null)} className="w-full justify-center bg-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
