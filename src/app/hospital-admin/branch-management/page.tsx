"use client";

import React, { useEffect, useState, useCallback } from "react";
import { branchService, Branch, BranchInput } from "@/services/branchService";
import {
  Landmark,
  Plus,
  Search,
  RefreshCw,
  Building2,
  MapPin,
  Phone,
  Mail,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  ShieldCheck,
  Sparkles,
  X,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteModalBranch, setDeleteModalBranch] = useState<Branch | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form State
  const [formData, setFormData] = useState<BranchInput>({
    branchCode: "",
    branchName: "",
    hospitalId: "HOSP-001",
    address: "",
    city: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    totalBeds: 50,
    emergencyReady: true,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBranches = useCallback(async () => {
    try {
      console.log("📥 Loading hospital branches from backend...");
      const data = await branchService.getAllBranches();
      setBranches(data);
    } catch (err) {
      console.error("❌ Failed to fetch branches:", err);
      showToast("Failed to connect to branch service", "error");
    }
  }, []);

  useEffect(() => {
    loadBranches().finally(() => setLoading(false));
  }, [loadBranches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBranches();
    setRefreshing(false);
    showToast("Branch list synchronized", "success");
  };

  const handleOpenCreateModal = () => {
    setEditingBranch(null);
    setFormData({
      branchCode: "",
      branchName: "",
      hospitalId: "HOSP-001",
      address: "",
      city: "",
      phone: "",
      email: "",
      status: "ACTIVE",
      totalBeds: 50,
      emergencyReady: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      branchCode: branch.branchCode || "",
      branchName: branch.branchName || "",
      hospitalId: branch.hospitalId || "HOSP-001",
      address: branch.address || "",
      city: branch.city || "",
      phone: branch.phone || "",
      email: branch.email || "",
      status: branch.status || "ACTIVE",
      totalBeds: branch.totalBeds ?? 0,
      emergencyReady: branch.emergencyReady ?? false,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchName.trim()) {
      showToast("Branch Name is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingBranch) {
        await branchService.updateBranch(editingBranch.id, formData);
        showToast(`Branch "${formData.branchName}" updated successfully`, "success");
      } else {
        await branchService.createBranch(formData);
        showToast(`Branch "${formData.branchName}" created successfully`, "success");
      }
      setIsModalOpen(false);
      await loadBranches();
    } catch (err: unknown) {
      console.error("Save branch failed:", err);
      showToast(err instanceof Error ? err.message : "Failed to save branch", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (branch: Branch) => {
    const newStatus = branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await branchService.updateBranch(branch.id, { status: newStatus });
      showToast(`Branch "${branch.branchName}" set to ${newStatus}`, "success");
      await loadBranches();
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalBranch) return;
    setSubmitting(true);
    try {
      await branchService.deleteBranch(deleteModalBranch.id);
      showToast(`Branch "${deleteModalBranch.branchName}" deleted successfully`, "success");
      setDeleteModalBranch(null);
      await loadBranches();
    } catch (err) {
      showToast("Failed to delete branch", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered branches
  const filteredBranches = branches.filter((b) => {
    const matchesSearch =
      b.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.branchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Telemetry Metrics
  const totalBedsCount = branches.reduce((acc, b) => acc + (b.totalBeds || 0), 0);
  const activeCount = branches.filter((b) => b.status === "ACTIVE").length;
  const emergencyCount = branches.filter((b) => b.emergencyReady).length;

  if (loading) {
    return (
      <div>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-semibold">Loading Hospital Branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Notification Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transition ${
            toast.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-700"
              : "bg-rose-950 text-rose-100 border-rose-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="space-y-6 pb-12">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Hospital Network Facilities
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Hospital Branch Management
              </h1>
              <p className="mt-1 text-slate-300 text-sm max-w-xl">
                Configure, monitor, and manage regional hospital branches, emergency facilities, and bed capacities.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                title="Refresh Branch Data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Add Hospital Branch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Branches</span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900">{branches.length}</div>
              <p className="text-xs text-slate-500 mt-0.5">Across all locations</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Operational</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900">{activeCount}</div>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                {branches.length > 0 ? `${Math.round((activeCount / branches.length) * 100)}% Operational` : "0% Operational"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bed Capacity</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Bed className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900">{totalBedsCount.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-0.5">Combined hospital beds</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Services</span>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900">{emergencyCount}</div>
              <p className="text-xs text-rose-600 font-medium mt-0.5">24/7 ER Ready Centers</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search branch by name, code, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === "ALL" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({branches.length})
              </button>
              <button
                onClick={() => setStatusFilter("ACTIVE")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === "ACTIVE" ? "bg-white text-emerald-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter("INACTIVE")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === "INACTIVE" ? "bg-white text-rose-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Inactive ({branches.length - activeCount})
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "table" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Branch Listing Content */}
        {filteredBranches.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {branch.branchCode}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">{branch.branchName}</h3>
                        {branch.city && (
                          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{branch.city}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleStatus(branch)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 border ${
                          branch.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {branch.status}
                      </button>
                    </div>

                    {/* Details List */}
                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                      {branch.address && (
                        <div className="flex items-start gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{branch.address}</span>
                        </div>
                      )}
                      {branch.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                      {branch.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{branch.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Badges */}
                    <div className="flex items-center justify-between pt-4 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-purple-600" />
                        <span>{branch.totalBeds || 0} Beds</span>
                      </div>

                      {branch.emergencyReady ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> 24/7 ER Ready
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Standard Outpatient</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditModal(branch)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteModalBranch(branch)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Branch Name</th>
                      <th className="px-6 py-4">City & Contact</th>
                      <th className="px-6 py-4">Beds</th>
                      <th className="px-6 py-4">Emergency Services</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredBranches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                            {branch.branchCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{branch.branchName}</div>
                          <div className="text-slate-400 text-[11px]">{branch.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{branch.city || "N/A"}</div>
                          <div className="text-slate-400">{branch.phone || branch.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-purple-700">{branch.totalBeds || 0}</td>
                        <td className="px-6 py-4">
                          {branch.emergencyReady ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Ready
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(branch)}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer border ${
                              branch.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {branch.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(branch)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModalBranch(branch)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3 shadow-sm">
            <Building2 className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Hospital Branches Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No branch facilities match your search query or status filter. Click below to add a new hospital branch.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" /> Add First Branch
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {editingBranch ? "Edit Hospital Branch" : "Add New Hospital Branch"}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {editingBranch ? `Updating branch #${editingBranch.branchCode}` : "Register a new branch in your hospital network"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo Central Branch"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo, Kandy, Galle"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +94-11-2345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. branch@healthbridge.lk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Bed Capacity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.totalBeds}
                    onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE (Operational)</option>
                    <option value="INACTIVE">INACTIVE (Temporarily Closed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
                <textarea
                  rows={2}
                  placeholder="Street address details..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <input
                  type="checkbox"
                  id="emergencyReady"
                  checked={formData.emergencyReady}
                  onChange={(e) => setFormData({ ...formData, emergencyReady: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="emergencyReady" className="text-xs font-bold text-emerald-900 cursor-pointer">
                  24/7 Emergency & ICU Services Ready
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingBranch ? "Save Changes" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Hospital Branch?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong>"{deleteModalBranch.branchName}"</strong> (#{deleteModalBranch.branchCode})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalBranch(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Delete Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
