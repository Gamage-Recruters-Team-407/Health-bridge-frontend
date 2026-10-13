"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { superAdminService, AuditLog, AuditLogSummary } from "@/services/superadmin.service";
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
  MoreHorizontal,
  Search
} from "lucide-react";


export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditLogSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Pagination & Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterModule, setFilterModule] = useState("All Modules");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterSeverity, setFilterSeverity] = useState("All Levels");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [logsData, summaryData] = await Promise.all([
          superAdminService.getAllAuditLogs(),
          superAdminService.getAuditLogSummary()
        ]);
        setLogs(logsData.map(log => ({
          ...log,
          severity: log.severity === 'Info' ? 'Normal' : log.severity
        })));
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to fetch audit logs data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      await superAdminService.downloadAuditReport();
    } catch (error) {
      console.error("Failed to download report", error);
    } finally {
      setIsDownloading(false);
    }
  };
  const renderStatusBadge = (status: string) => {
    if (status?.toLowerCase() === "success") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
          Success
        </span>
      );
    }
    if (status?.toLowerCase() === "failed") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
          Failed
        </span>
      );
    }
    return <span className="text-xs text-slate-600 font-medium">{status}</span>;
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "normal":
      case "info":
      case "low":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
            Normal
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
            Medium
          </span>
        );
      case "high":
      case "critical":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold">
            High
          </span>
        );
      default:
        return <span className="text-xs text-slate-600 font-medium">{severity}</span>;
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchUser = log.user?.toLowerCase().includes(q);
      const matchAction = log.actionDetails?.toLowerCase().includes(q);
      const matchEvent = log.event?.toLowerCase().includes(q);
      const matchRef = log.refId?.toLowerCase().includes(q);
      const matchIp = log.ipDevice?.toLowerCase().includes(q);
      if (!matchUser && !matchAction && !matchEvent && !matchRef && !matchIp) return false;
    }
    if (filterDate && !log.timestamp?.startsWith(filterDate)) return false;
    if (filterModule !== "All Modules" && log.module !== filterModule) return false;
    if (filterRole !== "All Roles" && log.role !== filterRole) return false;
    if (filterSeverity !== "All Levels" && log.severity?.toLowerCase() !== filterSeverity.toLowerCase()) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic filter options
  const modules = ["All Modules", ...Array.from(new Set(logs.map(l => l.module).filter(Boolean)))];
  const roles = ["All Roles", ...Array.from(new Set(logs.map(l => l.role).filter(Boolean)))];
  const severities = ["All Levels", ...Array.from(new Set(logs.map(l => l.severity).filter(Boolean)))];

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Comprehensive security trails, administrative activities, and system transactions across all nodes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              {isDownloading ? "Generating Report..." : "Generate Report"}
            </button>
          </div>
        </div>

        <div className="w-full space-y-6">

          {/* Metrics Row (6 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <List size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOTAL TODAY</p>
              </div>
              <p className="text-2xl font-bold text-[#0052CC]">{summary?.totalToday.toLocaleString() || '0'}</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <LogIn size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AUTH EVENTS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">{summary?.authEvents.toLocaleString() || '0'}</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <UserCog size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ADMIN ACTIONS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">{summary?.adminActions.toLocaleString() || '0'}</p>
            </Card>

            <Card className="p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RECORD ACCESS</p>
              </div>
              <p className="text-2xl font-bold text-[#0A2540]">{summary?.recordAccess.toLocaleString() || '0'}</p>
            </Card>

            <Card className="p-4 rounded-xl border border-red-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="text-red-500" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">SECURITY</p>
              </div>
              <p className="text-2xl font-bold text-red-500">{summary?.securityEvents.toLocaleString() || '0'}</p>
            </Card>

            <Card className="p-4 rounded-xl border border-orange-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-[#C2410C]" />
                <p className="text-[10px] font-bold text-[#C2410C] uppercase tracking-widest">FAILED ACTIONS</p>
              </div>
              <p className="text-2xl font-bold text-[#C2410C]">{summary?.failedActions.toLocaleString() || '0'}</p>
            </Card>

          </div>

          {/* Advanced Filters */}
          <Card className="p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-slate-600" />
              <h2 className="text-sm font-bold text-[#0A2540]">Advanced Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Search Logs</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search user, action, IP..."
                    className="h-10 text-sm w-full pl-9" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                  <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Date Filter</label>
                <Input 
                  type="date" 
                  className="h-10 text-sm w-full" 
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Module</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
                    value={filterModule}
                    onChange={(e) => { setFilterModule(e.target.value); setCurrentPage(1); }}
                  >
                    {modules.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">User Role</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Severity</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 px-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg appearance-none outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
                    value={filterSeverity}
                    onChange={(e) => { setFilterSeverity(e.target.value); setCurrentPage(1); }}
                  >
                    {severities.map(sev => (
                      <option key={sev} value={sev}>{sev}</option>
                    ))}
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
                  {paginatedLogs.map((log) => {
                    const dateObj = new Date(log.timestamp);
                    const dateStr = dateObj.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
                    const timeStr = dateObj.toLocaleTimeString("en-GB", { hour12: false });
                    
                    return (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-b-0">
                        <td className="py-4 px-4 pl-6 align-top">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-slate-800 whitespace-nowrap">{dateStr}</span>
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">{timeStr}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[12px] font-bold text-[#0A2540]">{log.user}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[12px] font-medium text-slate-600 whitespace-nowrap">{log.role}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[12px] font-semibold text-slate-900">{log.event}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[12px] font-medium text-slate-600">{log.module}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[12px] text-slate-700 max-w-[280px] inline-block leading-relaxed">{log.actionDetails}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          {log.refId && log.refId !== "—" ? (
                            <span className="text-[12px] font-bold font-mono text-[#0052CC]">
                              {log.refId}
                            </span>
                          ) : (
                            <span className="text-[12px] font-bold text-slate-400">{log.refId || "—"}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 align-top">
                          <span className="text-[11px] text-slate-500 font-mono">{log.ipDevice || "Unknown"}</span>
                        </td>
                        <td className="py-4 px-4 align-top">
                          {renderStatusBadge(log.status)}
                        </td>
                        <td className="py-4 px-4 pr-6 align-top">
                          {renderSeverityBadge(log.severity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-t border-slate-200 bg-white">
              <span className="text-xs text-slate-500">
                Showing {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page if there are many pages
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${
                        currentPage === pageNum 
                          ? 'bg-[#0052CC] text-white' 
                          : 'border border-transparent text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-slate-400 text-xs disabled">
                    <MoreHorizontal size={14} />
                  </button>
                )}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
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
