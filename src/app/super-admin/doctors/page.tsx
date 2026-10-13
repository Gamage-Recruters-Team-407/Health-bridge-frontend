"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from "@/components/ui/Table";
import { superAdminService, DoctorProfileResponse } from "@/services/superadmin.service";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  Users,
  Clock,
  CalendarOff,
  AlertTriangle,
  Search,
  Edit,
  Trash2,
  Check,
  UserPlus,
  MoreVertical,
  Eye,
  Ban,
  Filter,
  X
} from "lucide-react";

export default function DoctorManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All doctors");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [branchFilter, setBranchFilter] = useState("All branches");

  const [doctors, setDoctors] = useState<DoctorProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfileResponse | null>(null);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const updateDoctorStatus = async (id: string, status: string) => {
    try {
      await superAdminService.updateDoctorStatus(id, status);
      toast.success(`Doctor status updated to ${status}`);
      setOpenDropdownId(null);
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteDoctor = async (id: string, name?: string) => {
    if (!window.confirm(`Are you sure you want to delete doctor "${name || id}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await superAdminService.deleteDoctor(id);
      toast.success("Doctor deleted successfully");
      setOpenDropdownId(null);
      if (selectedDoctor?.id === id) {
        setSelectedDoctor(null);
      }
      fetchDoctors();
    } catch (error) {
      console.error("Failed to delete doctor", error);
      toast.error("Failed to delete doctor");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "DR";
    const parts = name.split(' ').filter(p => p.length > 0 && p.toLowerCase() !== 'dr' && p.toLowerCase() !== 'dr.');
    if (parts.length === 0) return "DR";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const tabs = [
    { name: "All doctors", count: doctors.length.toString() },
    { name: "Pending approval", count: doctors.filter(d => d.accountStatus === "Pending").length.toString() },
    { name: "Suspended", count: doctors.filter(d => d.accountStatus === "Suspended").length.toString() },
  ];

  const filteredDoctors = doctors.filter(doc => {
    let tabMatch = true;
    if (activeTab === "Suspended") tabMatch = doc.accountStatus === "Suspended";
    else if (activeTab === "Pending approval") tabMatch = doc.accountStatus === "Pending";
    
    const searchMatch = !searchQuery || 
      (doc.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.doctorId && doc.doctorId.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const deptMatch = deptFilter === "All departments" || doc.department === deptFilter;
    const statusMatch = statusFilter === "All statuses" || doc.accountStatus === statusFilter;
    const branchMatch = branchFilter === "All branches" || doc.branchId === branchFilter;
      
    return tabMatch && searchMatch && deptMatch && statusMatch && branchMatch;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white">
              Doctor Management
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Oversee registered doctors, departments, credentials, and account statuses.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/super-admin/doctors/add">
              <Button variant="primary" size="sm" leftIcon={<UserPlus size={16} />}>
                Add Doctor
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Row (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          <StatCard
            title="Total Doctors"
            value={doctors.length.toString()}
            icon={<Users size={24} />}
            iconBgColor="bg-blue-50 text-[#0052CC] dark:bg-blue-950/50 dark:text-blue-400"
          />
          <StatCard
            title="Active Doctors"
            value={doctors.filter(d => d.accountStatus === "Active").length.toString()}
            icon={<CheckCircle2 size={24} />}
            iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            subtitle="Currently active"
          />
          <StatCard
            title="Suspended Doctors"
            value={doctors.filter(d => d.accountStatus === "Suspended").length.toString()}
            icon={<Ban size={24} />}
            iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
            subtitle="Currently suspended"
          />
          <StatCard
            title="Pending Approvals"
            value={doctors.filter(d => d.accountStatus === "Pending").length.toString()}
            icon={<AlertTriangle size={24} />}
            iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
            subtitle="Awaiting review"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }}
              className={`pb-3 px-1 mr-6 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.name
                  ? "text-[#0052CC] dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.name}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.name 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052CC] dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-2 mt-2">
          <div className="w-full md:w-96">
            <Input 
              placeholder="Search by name or ID..." 
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All statuses">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select 
              className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40"
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All departments">All departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
            </select>

            <select 
              className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40"
              value={branchFilter}
              onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All branches">All branches</option>
              {Array.from(new Set(doctors.map(d => d.branchId).filter(Boolean))).map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Data Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-between">
          <table className="w-full text-left text-sm text-slate-600">
            <TableHeader>
              <TableRow>
                <TableHead>DOCTOR</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>BRANCH</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading doctors...</TableCell>
                </TableRow>
              ) : paginatedDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No doctors found.</TableCell>
                </TableRow>
              ) : (
                paginatedDoctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0052CC] font-bold text-xs shrink-0">
                          {getInitials(doc.name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#0A2540] dark:text-white text-sm whitespace-nowrap">{doc.name || "Unknown"}</p>
                          <p className="text-xs font-medium text-slate-500">{doc.doctorId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="font-bold text-[#0A2540] dark:text-white">{doc.department || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-[#0A2540] dark:text-white text-sm">{doc.branchId || "-"}</p>
                      <p className="text-xs font-medium text-slate-500">{doc.branchCode || "-"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-slate-600">{doc.email || "-"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.accountStatus === "Active" ? "success" : doc.accountStatus === "Suspended" ? "danger" : "neutral"} dot size="sm">
                        {doc.accountStatus || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedDoctor(doc)} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors" title="View Profile">
                          <Eye size={16} />
                        </button>
                        <Link href={`/super-admin/doctors/edit/${doc.id}`} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                          <Edit size={16} />
                        </Link>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {openDropdownId === doc.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-40 flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                                <button 
                                  onClick={() => updateDoctorStatus(doc.id, "Suspended")}
                                  disabled={doc.accountStatus === "Suspended" || doc.accountStatus === "Pending"}
                                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                    doc.accountStatus === "Suspended" || doc.accountStatus === "Pending"
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "text-amber-600 hover:bg-amber-50"
                                  }`}
                                >
                                  Suspend Doctor
                                </button>
                                
                                <button 
                                  onClick={() => updateDoctorStatus(doc.id, "Active")}
                                  disabled={doc.accountStatus !== "Suspended"}
                                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                    doc.accountStatus !== "Suspended"
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  Reactivate Doctor
                                </button>

                                <button 
                                  onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                                >
                                  Delete Doctor
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
          
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Global click handler to close dropdowns */}
      {openDropdownId && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      {/* Slide-out Drawer for Doctor Details */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedDoctor(null)} 
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A2540]">Doctor Profile</h2>
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                  {getInitials(selectedDoctor.name)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#0A2540]">{selectedDoctor.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedDoctor.email || "No email"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Doctor ID</p>
                  <p className="font-medium text-[#0A2540]">{selectedDoctor.doctorId || selectedDoctor.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Department</p>
                  <p className="font-medium text-[#0A2540]">{selectedDoctor.department || "General Medical"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Hospital / Branch</p>
                  <p className="font-medium text-[#0A2540]">{selectedDoctor.branchId || "General HQ"} {selectedDoctor.branchCode ? `(${selectedDoctor.branchCode})` : ""}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Account Status</p>
                  <div>
                    <Badge variant={selectedDoctor.accountStatus === "Active" ? "success" : selectedDoctor.accountStatus === "Suspended" ? "danger" : "neutral"} dot size="sm">
                      {selectedDoctor.accountStatus || "Unknown"}
                    </Badge>
                  </div>
                </div>
                {selectedDoctor.createdAt && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Registered</p>
                    <p className="font-medium text-[#0A2540]">
                      {new Date(selectedDoctor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
              {selectedDoctor.accountStatus !== "Active" && (
                <Button 
                  onClick={() => {
                    updateDoctorStatus(selectedDoctor.id, 'Active');
                    setSelectedDoctor(null);
                  }}
                  className="w-full bg-[#0052CC] hover:bg-blue-700 text-white justify-center"
                >
                  Approve / Activate Doctor
                </Button>
              )}
              {selectedDoctor.accountStatus === "Active" && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    updateDoctorStatus(selectedDoctor.id, 'Suspended');
                    setSelectedDoctor(null);
                  }}
                  className="w-full text-amber-600 border-amber-200 hover:bg-amber-50 justify-center"
                >
                  Suspend Doctor
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  handleDeleteDoctor(selectedDoctor.id, selectedDoctor.name);
                }}
                className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 justify-center"
              >
                Delete Doctor
              </Button>
              <Button variant="outline" onClick={() => setSelectedDoctor(null)} className="w-full justify-center bg-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
