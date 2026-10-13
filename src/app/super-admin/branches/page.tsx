"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { superAdminService, BranchResponseDto } from "@/services/superadmin.service";
import toast from "react-hot-toast";

import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Activity,
  MoreVertical
} from "lucide-react";

const StatCard = ({ title, value, icon, trend, trendLabel, color }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-[#0A2540]">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
    </div>
    {(trend || trendLabel) && (
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{trend}</span>
        <span className="text-xs text-slate-500 font-medium">{trendLabel}</span>
      </div>
    )}
  </div>
);

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<BranchResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [activeTab, setActiveTab] = useState("All");

  const [selectedBranch, setSelectedBranch] = useState<BranchResponseDto | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getAllBranches();
      setBranches(data);
    } catch (error) {
      toast.error("Failed to fetch branches.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranchStatus = async (branchId: string, newStatus: string) => {
    try {
      const branchToUpdate = branches.find(b => b.id === branchId);
      if (branchToUpdate) {
        await superAdminService.updateBranch(branchId, { ...branchToUpdate, status: newStatus });
        toast.success(`Branch marked as ${newStatus}`);
        fetchBranches();
        setSelectedBranch(null);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteBranch = async (branchId: string, branchName?: string) => {
    if (!window.confirm(`Are you sure you want to delete branch "${branchName || branchId}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await superAdminService.deleteBranch(branchId);
      toast.success("Branch deleted successfully");
      if (selectedBranch?.id === branchId) {
        setSelectedBranch(null);
      }
      fetchBranches();
    } catch (error) {
      console.error("Failed to delete branch", error);
      toast.error("Failed to delete branch");
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return "Pending approval";
    const normalized = status.toUpperCase();
    if (normalized === "ACTIVE") return "Approved";
    if (normalized === "PENDING" || normalized === "PENDING_APPROVAL") return "Pending approval";
    if (normalized === "INACTIVE" || normalized === "REJECTED") return "Rejected";
    return status;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge variant="success" dot size="sm" className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>;
      case "Pending approval": return <Badge variant="warning" dot size="sm" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case "Rejected": return <Badge variant="danger" dot size="sm" className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>;
      default: return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  const filteredBranches = branches.filter(h => {
    const status = formatStatus(h.status);
    const matchesSearch = 
      (h.branchName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (h.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.branchCode || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === "All statuses" || status === statusFilter;
    const matchesTab = activeTab === "All" || status === activeTab;

    return matchesSearch && matchesFilter && matchesTab;
  });

  const tabs = [
    { name: "All", count: branches.length },
    { name: "Approved", count: branches.filter(h => formatStatus(h.status) === "Approved").length },
    { name: "Pending approval", count: branches.filter(h => formatStatus(h.status) === "Pending approval").length }
  ];

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A2540]">Hospital Branch Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and monitor registered healthcare branches.</p>
          </div>
          <Link href="/super-admin/branches/add">
            <Button variant="primary" leftIcon={<Plus size={16} />} className="shrink-0 font-bold bg-[#0052CC] hover:bg-blue-700 shadow-sm rounded-xl px-6 py-2.5 h-auto transition-all">
              Add Branch
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Branches" 
            value={branches.length.toString()} 
            icon={<Building2 size={24} />} 
            color="blue"
            trend="+1" trendLabel="this month"
          />
          <StatCard 
            title="Active Facilities" 
            value={branches.filter(h => formatStatus(h.status) === "Approved").length.toString()} 
            icon={<Activity size={24} />} 
            color="emerald"
          />
          <StatCard 
            title="Pending Approval" 
            value={branches.filter(h => formatStatus(h.status) === "Pending approval").length.toString()} 
            icon={<Clock size={24} />} 
            color="amber"
          />
          <StatCard 
            title="Inactive" 
            value={branches.filter(h => formatStatus(h.status) === "Rejected").length.toString()} 
            icon={<CheckCircle2 size={24} />} 
            color="red"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab.name 
                  ? "text-[#0052CC]" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.name ? "bg-blue-100 text-[#0052CC]" : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </div>
              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0052CC] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
          <div className="w-full md:w-96">
            <Input 
              placeholder="Search by name, email or ID..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 flex-1 md:w-40"
            >
              <option>All statuses</option>
              <option>Approved</option>
              <option>Pending approval</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">ON</TableHead>
              <TableHead>BRANCH NAME</TableHead>
              <TableHead>BRANCH CODE</TableHead>
              <TableHead>CITY</TableHead>
              <TableHead>CONTACT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading branches...</TableCell>
              </TableRow>
            ) : filteredBranches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">No branches found.</TableCell>
              </TableRow>
            ) : filteredBranches.map((h, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm mx-auto`}>
                    {(h.branchName || "BR").substring(0, 2).toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-bold text-[#0A2540]">{h.branchName}</p>
                    <p className="text-xs text-slate-500">{h.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2 py-1 rounded-md">{h.branchCode || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600 font-medium text-sm">{h.city || "Unknown"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600 font-medium text-sm">{h.phone || "N/A"}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(formatStatus(h.status))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedBranch(h)} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <Link href={`/super-admin/branches/edit/${h.id}`} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteBranch(h.id, h.branchName)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Branch"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>

      {/* Slide-out Drawer for Branch Details */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedBranch(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-[#0A2540]">Branch Details</h2>
              <button onClick={() => setSelectedBranch(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-2xl flex items-center justify-center shadow-sm">
                  {(selectedBranch.branchName || "BR").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A2540]">{selectedBranch.branchName}</h3>
                  <p className="text-sm text-slate-500">{selectedBranch.branchCode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                  {getStatusBadge(formatStatus(selectedBranch.status))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={18} className="text-[#0052CC]" /> Contact Information
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                  <div className="flex items-center gap-3 p-4">
                    <Mail size={16} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Email Address</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedBranch.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <Phone size={16} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedBranch.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <MapPin size={16} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">City</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedBranch.city || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              {formatStatus(selectedBranch.status) !== "Approved" && (
                <Button 
                  variant="primary" 
                  className="w-full font-bold bg-[#0052CC] hover:bg-blue-700 py-6 text-base shadow-sm"
                  onClick={() => updateBranchStatus(selectedBranch.id, "ACTIVE")}
                >
                  Approve Branch
                </Button>
              )}
              {formatStatus(selectedBranch.status) !== "Rejected" && (
                <Button 
                  variant="danger" 
                  className="w-full font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 py-6 text-base"
                  onClick={() => updateBranchStatus(selectedBranch.id, "INACTIVE")}
                >
                  Reject Branch
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 py-6 text-base"
                onClick={() => handleDeleteBranch(selectedBranch.id, selectedBranch.branchName)}
              >
                Delete Branch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
