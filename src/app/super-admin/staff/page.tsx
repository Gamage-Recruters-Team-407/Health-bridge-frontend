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
  Users,
  CheckCircle,
  Clock,
  Ban,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Download,
  UserPlus,
  Filter,
  X
} from "lucide-react";
import { superAdminService, UserProfileResponse } from "@/services/superadmin.service";
import toast from "react-hot-toast";

export default function StaffManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All staff");
  const [users, setUsers] = useState<UserProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfileResponse | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getAllStaff();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (id: string, status: string) => {
    try {
      await superAdminService.updateUserStatus(id, status);
      toast.success(`User status updated to ${status}`);
      setOpenDropdownId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleExportList = () => {
    toast.success("Downloading staff list...");
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Role,Status\n" 
        + users.map(u => `${u.fullName || (u.firstName ? u.firstName + ' ' + u.lastName : 'Unknown')},${u.email},${u.role},${formatStatus(u.accountStatus)}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "staff_list.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, 1000);
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    const normalized = status.toUpperCase();
    if (normalized === "ACTIVE") return "Active";
    if (normalized === "SUSPENDED") return "Suspended";
    if (normalized === "PENDING" || normalized === "PENDING_APPROVAL") return "Pending approval";
    return status;
  };

  const recentlyAddedFilter = (user: UserProfileResponse) => {
    if (!user.createdAt) return false;
    const createdAt = new Date(user.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdAt >= sevenDaysAgo;
  };

  const tabs = [
    { name: "All staff", count: users.length.toString(), href: null },
    { name: "Pending approval", count: users.filter(u => formatStatus(u.accountStatus) === "Pending approval").length.toString(), href: null },
    { name: "Suspended", count: users.filter(u => formatStatus(u.accountStatus) === "Suspended").length.toString(), href: null },
    { name: "Recently added", count: users.filter(recentlyAddedFilter).length.toString(), href: null },
  ];

  const filteredUsers = users.filter(user => {
    // 1. Tab Filtering
    const status = formatStatus(user.accountStatus);
    let tabMatch = true;
    if (activeTab === "Suspended") tabMatch = status === "Suspended";
    else if (activeTab === "Pending approval") tabMatch = status === "Pending approval";
    else if (activeTab === "Recently added") tabMatch = recentlyAddedFilter(user);
    
    // 2. Search Query Filtering
    const searchMatch = !searchQuery || 
      (user.fullName || (user.firstName ? user.firstName + " " + user.lastName : "")).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.staffId || user.id || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    // 3. Role Filtering
    const roleMatch = roleFilter === "All roles" || 
      (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());
      
    // 4. Status Filtering
    const statusMatch = statusFilter === "All statuses" || 
      status.toLowerCase() === statusFilter.toLowerCase();
      
    return tabMatch && searchMatch && roleMatch && statusMatch;
  });

  const itemsPerPage = 8;
  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getRoleBadge = (role: string) => {
    if (!role) return <Badge variant="neutral">Unknown</Badge>;
    const normalized = role.toUpperCase();
    switch (normalized) {
      case "DOCTOR": return <Badge variant="primary">Doctor</Badge>;
      case "PATIENT": return <Badge variant="neutral">Patient</Badge>;
      case "PHARMACIST": return <Badge variant="success">Pharmacist</Badge>;
      case "LAB_OFFICER": return <Badge variant="purple">Lab Technician</Badge>;
      case "INSURANCE_OFFICER": return <Badge variant="warning">Insurance Officer</Badge>;
      case "ADMIN": return <Badge variant="info">Hospital Admin</Badge>;
      case "SUPER_ADMIN": return <Badge variant="danger">Super Admin</Badge>;
      default: return <Badge variant="neutral">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge variant="success" dot size="sm">Active</Badge>;
      case "Pending approval": return <Badge variant="warning" dot size="sm">Pending approval</Badge>;
      case "Suspended": return <Badge variant="danger" dot size="sm">Suspended</Badge>;
      default: return <Badge variant="neutral" dot size="sm">{status}</Badge>;
    }
  };

  const activeCount = users.filter(u => formatStatus(u.accountStatus) === "Active").length;
  const pendingCount = users.filter(u => formatStatus(u.accountStatus) === "Pending approval").length;
  const suspendedCount = users.filter(u => formatStatus(u.accountStatus) === "Suspended").length;
  const totalCount = users.length;
  const activePercentage = totalCount === 0 ? 0 : ((activeCount / totalCount) * 100).toFixed(1);

  // Calculate dynamic trend for Total Staff (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newStaffThisMonth = users.filter(u => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo).length;
  const totalStaffLastMonth = totalCount - newStaffThisMonth;
  
  let staffGrowthPercent = 0;
  if (totalStaffLastMonth === 0) {
    staffGrowthPercent = newStaffThisMonth > 0 ? 100 : 0;
  } else {
    staffGrowthPercent = (newStaffThisMonth / totalStaffLastMonth) * 100;
  }
  
  const trend = {
    value: `${Math.abs(Number(staffGrowthPercent.toFixed(1)))}%`,
    isPositive: staffGrowthPercent >= 0,
    label: "vs last month"
  };

  return (
    <>
      {/* Header Section Removed as requested */}
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Staff"
          value={totalCount.toLocaleString()}
          icon={<Users size={24} />}
          iconBgColor="bg-emerald-50 text-emerald-600 "
          trend={trend}
        />
        <StatCard
          title="Active Accounts"
          value={activeCount.toLocaleString()}
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-blue-50 text-blue-600 "
          subtitle={`${activePercentage}% of total base`}
        />
        <StatCard
          title="Pending Approval"
          value={pendingCount.toLocaleString()}
          icon={<Clock size={24} />}
          iconBgColor="bg-amber-50 text-amber-600 "
          subtitle="Needs registration review"
        />
        <StatCard
          title="Suspended"
          value={suspendedCount.toLocaleString()}
          icon={<Ban size={24} />}
          iconBgColor="bg-rose-50 text-rose-600 "
          subtitle="Flagged for security review"
        />
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={() => router.push('/super-admin/staff/add')}>
          Add staff
        </Button>
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
            placeholder="Search by name, email or user ID..." 
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-100 :ring-blue-900 flex-1 md:w-40"
          >
            <option>All roles</option>
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Hospital Admin</option>
            <option>Lab Officer</option>
            <option>Pharmacist</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-100 :ring-blue-900 flex-1 md:w-40"
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Pending approval</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">ON</TableHead>
            <TableHead>USER</TableHead>
            <TableHead>USER ID</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>INSTITUTION</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>REGISTERED</TableHead>
            <TableHead>LAST LOGIN</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">Loading staff...</TableCell>
            </TableRow>
          ) : paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">No staff found.</TableCell>
            </TableRow>
          ) : paginatedUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm mx-auto`}>
                  {(user.fullName || (user.firstName ? user.firstName + " " + user.lastName : "HB")).substring(0, 2).toUpperCase()}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-bold text-[#0A2540] ">{user.fullName || (user.firstName + " " + user.lastName)}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{user.id ? user.id.substring(0, 8) : "N/A"}</span>
              </TableCell>
              <TableCell>
                {getRoleBadge(user.role)}
              </TableCell>
              <TableCell>
                <span className="text-[#0A2540] font-medium">—</span>
              </TableCell>
              <TableCell>
                {getStatusBadge(formatStatus(user.accountStatus))}
              </TableCell>
              <TableCell>
                <span className="text-[#0A2540] font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Unknown"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[#0A2540] font-medium">Unknown</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => setSelectedUser(user)} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <Link href={`/super-admin/staff/edit/${user.id}`} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                    <Edit size={16} />
                  </Link>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {openDropdownId === user.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-40 flex flex-col bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                          <button 
                            onClick={() => updateUserStatus(user.id, "SUSPENDED")}
                            disabled={formatStatus(user.accountStatus) === "Suspended" || formatStatus(user.accountStatus) === "Pending approval"}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                              formatStatus(user.accountStatus) === "Suspended" || formatStatus(user.accountStatus) === "Pending approval"
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-amber-600 hover:bg-amber-50"
                            }`}
                          >
                            Suspend Staff
                          </button>
                          
                          <button 
                            onClick={() => updateUserStatus(user.id, "ACTIVE")}
                            disabled={formatStatus(user.accountStatus) !== "Suspended"}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                              formatStatus(user.accountStatus) !== "Suspended"
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            Reactivate Staff
                          </button>

                          <button 
                            onClick={() => { setOpenDropdownId(null); toast.error("Delete staff not implemented yet"); }}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                          >
                            Delete Staff
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
      </Table>
      
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      </div>
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedUser(null)} 
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A2540]">Staff Details</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                  {(selectedUser.fullName || (selectedUser.firstName ? selectedUser.firstName + " " + selectedUser.lastName : "HB")).substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#0A2540]">{selectedUser.fullName || (selectedUser.firstName ? selectedUser.firstName + " " + selectedUser.lastName : "Unknown")}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">User ID</p>
                  <p className="font-medium text-[#0A2540]">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Role</p>
                  <div>{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Status</p>
                  <div>{getStatusBadge(formatStatus(selectedUser.accountStatus))}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Registered</p>
                  <p className="font-medium text-[#0A2540]">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
              {formatStatus(selectedUser.accountStatus) !== "Active" && (
                <Button 
                  onClick={() => {
                    updateUserStatus(selectedUser.id, 'ACTIVE');
                    setSelectedUser(null);
                  }}
                  className="w-full bg-[#0052CC] hover:bg-blue-700 text-white justify-center"
                >
                  Approve Account
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedUser(null)} className="w-full justify-center bg-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
