"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination 
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

import { 
  Plus, Shield, Users, Lock, AlertTriangle, Search, Clock, ShieldAlert,
  MoreVertical, Eye, Edit2, Trash2, Ban, CheckCircle, X
} from "lucide-react";
import { superAdminService, RoleResponseDto } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleResponseDto | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await superAdminService.getAllRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await superAdminService.updateRoleStatus(id, newStatus);
      setRoles(roles.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Role status updated to ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update role status`);
    } finally {
      setDropdownOpenId(null);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await superAdminService.deleteRole(id);
        setRoles(roles.filter(r => r.id !== id));
        toast.success("Role deleted successfully");
      } catch (error) {
        toast.error("Failed to delete role");
      } finally {
        setDropdownOpenId(null);
      }
    }
  };

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpenId && !(event.target as Element).closest('.action-dropdown')) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpenId]);

  const isSystemRole = (type?: string) => type?.toUpperCase().includes("SYSTEM");
  const formatRoleType = (type?: string) => isSystemRole(type) ? "System Role" : "Custom Role";

  const filteredRoles = roles.filter(role => {
    const matchesSearch = (role.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (role.roleId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || 
                        (filterType === "System Role" && isSystemRole(role.type)) ||
                        (filterType === "Custom Role" && !isSystemRole(role.type));
    return matchesSearch && matchesType;
  });

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status ? status.toUpperCase() : "UNKNOWN";
    switch (normalizedStatus) {
      case "ACTIVE": return <Badge variant="success" dot size="sm">Active</Badge>;
      case "INACTIVE": return <Badge variant="neutral" dot size="sm">Inactive</Badge>;
      case "SUSPENDED": return <Badge variant="danger" dot size="sm">Suspended</Badge>;
      default: return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  const totalRoles = roles.length;
  const activeUsersCount = roles.reduce((sum, role) => sum + (role.userCount || 0), 0);
  const customRoles = roles.filter(r => !isSystemRole(r.type)).length;
  const highRiskRoles = roles.filter(r => r.riskLevel?.toUpperCase() === "HIGH").length;

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white">
              Roles & Permissions
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Manage system roles, access levels, and permissions across all healthcare modules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/super-admin/roles/add">
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
                Add Role
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Row (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          <StatCard
            title="Total Roles"
            value={totalRoles.toString()}
            icon={<Shield size={24} />}
            iconBgColor="bg-blue-50 text-[#0052CC] dark:bg-blue-950/50 dark:text-blue-400"
            trend={{ value: "Live", isPositive: true, label: "from database" }}
          />
          <StatCard
            title="Active Users"
            value={activeUsersCount.toString()}
            icon={<Users size={24} />}
            iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            subtitle="Users assigned to roles"
          />
          <StatCard
            title="Custom Roles"
            value={customRoles.toString()}
            icon={<Lock size={24} />}
            iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
            subtitle="Created manually"
          />
          <StatCard
            title="High-Risk Permissions"
            value={highRiskRoles.toString()}
            icon={<AlertTriangle size={24} />}
            iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
            subtitle="Need review"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-2 mt-4">
          <div className="w-full md:w-96">
            <Input 
              placeholder="Search by role name or ID..." 
              leftIcon={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            >
              <option value="All Types">All Types</option>
              <option value="System Role">System Role</option>
              <option value="Custom Role">Custom Role</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-between">
          <table className="w-full text-left text-sm text-slate-600">
            <TableHeader>
              <TableRow>
                <TableHead>Role ID</TableHead>
                <TableHead>Role Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading roles...</TableCell>
                </TableRow>
              ) : paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No roles found matching your filters.</TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-[#0A2540] dark:text-white">
                      {role.roleId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0A2540] dark:text-white">{role.name}</span>
                        {role.riskLevel === "HIGH" && (
                          <AlertTriangle size={14} className="text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSystemRole(role.type) ? "primary" : "neutral"} size="sm">
                        {formatRoleType(role.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users size={14} />
                        <span className="font-medium">{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(role.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-1 action-dropdown">
                        <button 
                          onClick={() => setViewingRole(role)}
                          className="p-2 text-slate-400 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <Link href={`/super-admin/roles/edit/${role.id}`}>
                          <button 
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setDropdownOpenId(dropdownOpenId === role.id ? null : role.id)}
                            className={`p-2 rounded-lg transition-colors ${dropdownOpenId === role.id ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {dropdownOpenId === role.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 overflow-hidden">
                              <button 
                                onClick={() => handleUpdateStatus(role.id, "Inactive")}
                                disabled={role.status === "Inactive"}
                                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                  role.status === "Inactive"
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-amber-600 hover:bg-amber-50"
                                }`}
                              >
                                Deactivate
                              </button>
                              
                              <button 
                                onClick={() => handleUpdateStatus(role.id, "Active")}
                                disabled={role.status === "Active"}
                                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                  role.status === "Active"
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                Reactivate
                              </button>

                              <button 
                                onClick={() => handleDeleteRole(role.id)}
                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </table>
          
          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRoles.length / itemsPerPage)}
            totalRecords={filteredRoles.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* View Role Drawer */}
      {viewingRole && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setViewingRole(null)} 
          />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A2540]">Role Details</h2>
              <button 
                onClick={() => setViewingRole(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {viewingRole.riskLevel === "HIGH" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-start gap-3">
                    <ShieldAlert size={16} className="text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-red-700 mb-1">AI Access Risk Analysis: HIGH</h3>
                      <p className="text-xs font-medium text-red-600">{viewingRole.riskRecommendations}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Role Name</label>
                  <p className="text-sm font-bold text-[#0A2540]">{viewingRole.name}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Role ID</label>
                  <p className="text-sm font-medium text-slate-600">{viewingRole.roleId}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Type</label>
                  <div>
                    <Badge variant={isSystemRole(viewingRole.type) ? "primary" : "neutral"} size="sm">
                      {formatRoleType(viewingRole.type)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <div>{getStatusBadge(viewingRole.status)}</div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Assigned Users</label>
                  <p className="text-sm font-medium text-slate-600">{viewingRole.userCount}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Last Updated</label>
                  <p className="text-sm font-medium text-slate-600">
                    {Array.isArray(viewingRole.updatedAt) 
                      ? new Date(viewingRole.updatedAt[0], viewingRole.updatedAt[1]-1, viewingRole.updatedAt[2]).toLocaleDateString()
                      : new Date(viewingRole.updatedAt || Date.now()).toLocaleDateString()
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Link href={`/super-admin/roles/edit/${viewingRole.id}`}>
                <Button variant="primary" leftIcon={<Edit2 size={16} />}>
                  Edit Permissions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
