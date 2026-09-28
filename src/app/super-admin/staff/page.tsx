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
  Filter
} from "lucide-react";
import { superAdminService, UserProfileResponse } from "@/services/superadmin.service";

export default function StaffManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All staff");
  const [users, setUsers] = useState<UserProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    const normalized = status.toUpperCase();
    if (normalized === "ACTIVE") return "Active";
    if (normalized === "SUSPENDED") return "Suspended";
    if (normalized === "PENDING" || normalized === "PENDING_APPROVAL") return "Pending approval";
    return status;
  };

  const tabs = [
    { name: "All staff", count: users.length.toString(), href: null },
    { name: "Pending approval", count: users.filter(u => formatStatus(u.accountStatus) === "Pending approval").length.toString(), href: "/super-admin/users/pending" },
    { name: "Suspended", count: users.filter(u => formatStatus(u.accountStatus) === "Suspended").length.toString(), href: null },
    { name: "Recently added", count: "-", href: null },
  ];

  // Filter the actual data based on the active tab
  const filteredUsers = users.filter(user => {
    const status = formatStatus(user.accountStatus);
    if (activeTab === "Suspended") return status === "Suspended";
    if (activeTab === "Pending approval") return status === "Pending approval";
    return true; // "All staff"
  });

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

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Staff Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            Create, verify and govern every account on Health Bridge — patients, clinicians,
            hospital staff and partner organisations — from one place.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Export list
          </Button>
          <Button variant="primary" leftIcon={<UserPlus size={16} />}>
            Add staff
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Staff"
          value="1,248"
          icon={<Users size={24} />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          trend={{ value: "4.2%", isPositive: true, label: "vs last month" }}
        />
        <StatCard
          title="Active Accounts"
          value="1,096"
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          subtitle="87.8% of total base"
        />
        <StatCard
          title="Pending Approval"
          value="94"
          icon={<Clock size={24} />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          subtitle="Needs registration review"
        />
        <StatCard
          title="Suspended"
          value="58"
          icon={<Ban size={24} />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
          subtitle="Flagged for security review"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-6">
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
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.name}
            <span className="ml-2 text-xs font-medium text-slate-400">
              {tab.count}
            </span>
            {activeTab === tab.name && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />
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
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40">
            <option>All roles</option>
            <option>Doctor</option>
            <option>Patient</option>
            <option>Pharmacist</option>
          </select>
          <select className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-40">
            <option>All statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <select className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#0A2540] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 flex-1 md:w-48">
            <option>All institutions</option>
            <option>Colombo General Hospital</option>
            <option>Asiri Medical Group</option>
          </select>
        </div>
        <Button variant="outline" leftIcon={<Filter size={16} />} className="ml-auto w-full md:w-auto">
          More filters
        </Button>
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
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">No staff found.</TableCell>
            </TableRow>
          ) : filteredUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm mx-auto`}>
                  {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : "HB"}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-bold text-[#0A2540] dark:text-white">{user.fullName}</p>
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
                <span className="text-[#0A2540] dark:text-slate-300 font-medium">—</span>
              </TableCell>
              <TableCell>
                {getStatusBadge(formatStatus(user.accountStatus))}
              </TableCell>
              <TableCell>
                <span className="text-[#0A2540] dark:text-slate-300 font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Unknown"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[#0A2540] dark:text-slate-300 font-medium">Unknown</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/users/${user.id}`} className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                    <Eye size={16} />
                  </Link>
                  <button className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#EBF3FF] rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination 
        currentPage={currentPage}
        totalPages={156}
        totalRecords={1248}
        pageSize={8}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
