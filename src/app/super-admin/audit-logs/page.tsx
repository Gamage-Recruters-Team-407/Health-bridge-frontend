"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/Table";

import { 
  Download,
  FileBarChart,
  List,
  LogIn,
  UserCog,
  Database,
  ShieldAlert,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

// --- Mock Data ---

const auditLogsData = [
  {
    date: "11 Aug 2026",
    time: "09:42:15",
    user: "Dr. Nimal Perera",
    role: "Doctor",
    event: "Patient Record Access",
    module: "EHR",
    actionDetails: "Viewed patient record",
    refId: "PT-20458",
    ipAddress: "192.168.1.44",
    device: "Desktop",
    status: "Success",
    severity: "Info"
  },
  {
    date: "11 Aug 2026",
    time: "09:38:06",
    user: "admin@healthbridge.lk",
    role: "Super Admin",
    event: "Role Permission Updated",
    module: "Roles & Permissions",
    actionDetails: "Modified doctor permission:",
    refId: "ROLE-DOC-001",
    ipAddress: "Internal",
    device: "Server",
    status: "Success",
    severity: "Medium"
  },
  {
    date: "11 Aug 2026",
    time: "09:31:27",
    user: "Unknown",
    role: "—",
    event: "Failed Login",
    module: "Authentication",
    actionDetails: "Invalid password attempt",
    refId: "—",
    ipAddress: "45.118.xx.xx",
    device: "Mobile",
    status: "Failed",
    severity: "High"
  }
];

export default function AuditLogsPage() {
  
  const renderStatusBadge = (status: string) => {
    if (status === "Success") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-600 text-[10px] font-bold">
          {status}
        </span>
      );
    }
    if (status === "Failed") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
          {status}
        </span>
      );
    }
    return <span className="text-xs">{status}</span>;
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Info":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-[#0052CC] text-[10px] font-bold">
            {severity}
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] text-[10px] font-bold">
            {severity}
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-700 text-white text-[10px] font-bold">
            {severity}
          </span>
        );
      default:
        return <span className="text-xs">{severity}</span>;
    }
  };

  return (
    <>
      <div className="-mt-8 -mx-8 -mb-8 px-6 lg:px-10 py-10 bg-white min-h-[calc(100vh-80px)] font-sans">
        
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-[28px] font-bold text-[#0A2540] dark:text-white tracking-tight mb-2">
                Audit Logs
              </h1>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Review and trace important user, administrative, security, and system activities across the Health Bridge platform.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" leftIcon={<Download size={16} />} className="font-bold text-[#0052CC] border-slate-200 hover:bg-blue-50 px-5 rounded-lg h-11 shadow-sm">
                Export Logs
              </Button>
              <Button variant="primary" leftIcon={<FileBarChart size={16} />} className="font-bold bg-[#0052CC] hover:bg-blue-700 px-5 rounded-lg h-11 shadow-sm">
                Generate Audit Report
              </Button>
            </div>
          </div>

          {/* Metrics Row (6 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <List size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOTAL TODAY</p>
              </div>
              <p className="text-2xl font-bold text-[#0052CC]">8,426</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <LogIn size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AUTH EVENTS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">3,210</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <UserCog size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ADMIN ACTIONS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">842</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RECORD ACCESS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">3,986</p>
            </Card>

            <Card className="p-4 rounded-xl border border-red-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="text-red-500" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">SECURITY</p>
              </div>
              <p className="text-2xl font-bold text-red-500">72</p>
            </Card>

            <Card className="p-4 rounded-xl border border-orange-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-[#C2410C]" />
                <p className="text-[10px] font-bold text-[#C2410C] uppercase tracking-widest">FAILED ACTIONS</p>
              </div>
              <p className="text-2xl font-bold text-[#C2410C]">41</p>
            </Card>

          </div>

          {/* Advanced Filters */}
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-slate-600" />
              <h2 className="text-sm font-bold text-[#0A2540]">Advanced Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Date Range</label>
                <Input placeholder="mm/dd/yyyy" className="h-10 text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Event Category</label>
                <div className="relative">
                  <select className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]">
                    <option>All Categories</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">User Role</label>
                <div className="relative">
                  <select className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]">
                    <option>All Roles</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Severity</label>
                <div className="relative">
                  <select className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]">
                    <option>All Levels</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </Card>

          {/* Data Table */}
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600 pl-6">Timestamp</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">User</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Role</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Event</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Module</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Action / Details</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Ref ID</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">IP / Device</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600">Status</th>
                    <th className="py-4 px-4 text-[11px] font-bold text-slate-600 pr-6">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogsData.map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-b-0">
                      <td className="py-4 px-4 pl-6 align-top">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-700 whitespace-nowrap">{log.date}</span>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">{log.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[12px] font-bold text-[#0A2540]">{log.user}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[12px] text-slate-600 whitespace-pre-wrap">{log.role.replace(" ", "\n")}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[12px] font-medium text-slate-700 whitespace-pre-wrap">{log.event.replace(/ /g, "\n")}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[12px] text-slate-600 whitespace-pre-wrap">{log.module.replace(" & ", " &\n")}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="text-[12px] text-slate-700 max-w-[200px] inline-block">{log.actionDetails}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        {log.refId !== "—" ? (
                          <a href="#" className="text-[12px] font-bold text-[#0052CC] hover:underline whitespace-pre-wrap">
                            {log.refId.replace("-", "-\n")}
                          </a>
                        ) : (
                          <span className="text-[12px] font-bold text-slate-400">{log.refId}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-600">{log.ipAddress}</span>
                          <span className="text-[11px] text-slate-500">{log.device}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        {renderStatusBadge(log.status)}
                      </td>
                      <td className="py-4 px-4 pr-6 align-top">
                        {renderSeverityBadge(log.severity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-t border-slate-200 bg-white">
              <span className="text-xs text-slate-500">Showing 1 to 50 of 8,426 entries</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
                  <ChevronLeft size={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0052CC] text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-slate-600 hover:bg-slate-50 text-xs font-bold">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-slate-600 hover:bg-slate-50 text-xs font-bold">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-slate-400 text-xs">
                  <MoreHorizontal size={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </>
  );
}
