"use client";

import React from "react";
import Link from "next/link";
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
  Search,
  ChevronRight,
  Bell,
  HelpCircle,
  FileText,
  BadgeCheck,
  ShieldAlert,
  AlertTriangle
} from "lucide-react";

// Mock Data for Alerts
const mockAlerts = [
  {
    id: "#CLM-99201",
    provider: "Apex Medical Group",
    amount: "$45,200",
    riskScore: 98,
    isCritical: true
  },
  {
    id: "#CLM-98402",
    provider: "Dr. J. Smith Diagnostics",
    amount: "$12,500",
    riskScore: 82,
    isCritical: false
  },
  {
    id: "#CLM-97110",
    provider: "Valley View Rehab",
    amount: "$89,000",
    riskScore: 95,
    isCritical: true
  },
  {
    id: "#CLM-96500",
    provider: "City General Pharmacy",
    amount: "$3,400",
    riskScore: 75,
    isCritical: false
  }
];

// Mock Data for Chart
const chartData = [
  { company: "Blue Cross", approved: 35, pending: 45 },
  { company: "Aetna", approved: 15, pending: 35 },
  { company: "Cigna", approved: 25, pending: 60 },
  { company: "United", approved: 15, pending: 30 }
];

export default function ClaimsOversightPage() {

  const renderRiskBadge = (score: number, isCritical: boolean) => {
    if (isCritical) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold shadow-sm">
          <AlertTriangle size={12} strokeWidth={3} /> {score}/100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-bold shadow-sm">
        <span className="text-[10px] font-black">!</span> {score}/100
      </span>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Simulated Top Navbar */}
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="w-[450px]">
            <Input 
              placeholder="Claim ID number....." 
              leftIcon={<Search size={16} className="text-slate-400" />}
              className="rounded-full bg-slate-50 border-slate-100 h-10"
            />
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button className="hover:text-slate-700 transition-colors"><Bell size={20} /></button>
            <button className="hover:text-slate-700 transition-colors"><HelpCircle size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
               <span className="text-xs font-bold text-slate-500">JD</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2">
                <Link href="/super-admin/dashboard" className="hover:text-[#0052CC] transition-colors">Dashboard</Link>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-[#0052CC]">Claims Oversight</span>
              </div>
              <h1 className="text-[32px] font-bold text-[#0A2540] dark:text-white tracking-tight">
                Claims & Fraud Oversight
              </h1>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Claims Card */}
              <Card className="p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute right-6 top-6 opacity-10">
                  <FileText size={64} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Claims (MTD)</h3>
                  <p className="text-4xl font-bold text-[#0A2540] mb-2">124,592</p>
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    <span>+4.2% vs Last Month</span>
                  </div>
                </div>
              </Card>

              {/* Approval Rate Card */}
              <Card className="p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute right-6 top-6 opacity-10">
                  <BadgeCheck size={64} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Approval Rate</h3>
                  <p className="text-4xl font-bold text-[#0A2540] mb-2">91.8%</p>
                  <p className="text-xs font-bold text-slate-400">— Stable</p>
                </div>
              </Card>

              {/* Fraud Flag Card */}
              <Card className="p-6 rounded-2xl border-none shadow-sm bg-[#FEE2E2] relative overflow-hidden">
                <div className="absolute right-6 top-6 opacity-10 text-red-900">
                  <ShieldAlert size={64} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-2">Flagged for Fraud</h3>
                  <p className="text-4xl font-bold text-red-600 mb-2">1,403</p>
                  <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                    <AlertTriangle size={14} strokeWidth={2.5} />
                    <span>Requires Immediate Action</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Split Content Area */}
            <div className="flex flex-col xl:flex-row gap-6">
              
              {/* Left Column: Alerts Table (approx 65%) */}
              <div className="w-full xl:w-[65%]">
                <Card className="rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white">
                  
                  {/* Table Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} className="text-red-500" />
                      <h2 className="text-lg font-bold text-[#0A2540]">Recent Suspicious Alerts</h2>
                    </div>
                    <a href="#" className="text-sm font-bold text-[#0052CC] hover:underline">View All</a>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                          <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pl-6">Claim ID</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Provider</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Amount</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Risk Score</TableHead>
                          <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 text-right pr-6">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAlerts.map((alert, idx) => (
                          <TableRow key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="pl-6 py-5">
                              <p className="text-sm font-bold text-[#0A2540]">{alert.id}</p>
                            </TableCell>
                            <TableCell className="py-5">
                              <p className="text-sm font-medium text-slate-600 max-w-[150px] truncate">{alert.provider}</p>
                            </TableCell>
                            <TableCell className="py-5">
                              <p className="text-sm font-bold text-[#0A2540]">{alert.amount}</p>
                            </TableCell>
                            <TableCell className="py-5">
                              {renderRiskBadge(alert.riskScore, alert.isCritical)}
                            </TableCell>
                            <TableCell className="pr-6 py-5 text-right">
                              <Button variant="outline" className="h-8 px-4 text-xs font-bold text-[#0052CC] border-[#0052CC]/20 hover:bg-blue-50 bg-white">
                                Investigate
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>

              {/* Right Column: Tracking Chart (approx 35%) */}
              <div className="w-full xl:flex-1">
                <Card className="p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white h-full flex flex-col">
                  
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#0A2540] mb-1">Claims Tracking (Volume by Co.)</h2>
                    <p className="text-xs font-medium text-slate-500">Top 4 Insurers by submission volume.</p>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 flex flex-col relative min-h-[250px]">
                    
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                      <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                      <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                      <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                      <div className="w-full h-[1px] bg-slate-200"></div> {/* Baseline */}
                    </div>

                    {/* Bars Container */}
                    <div className="relative z-10 flex-1 flex items-end justify-around pb-8 px-4">
                      {chartData.map((data, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 w-12 relative group">
                          
                          {/* Tooltip (Hidden by default) */}
                          <div className="absolute -top-10 bg-[#0A2540] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            {data.approved + data.pending}k Total
                          </div>

                          {/* Stacked Bar */}
                          <div className="w-8 flex flex-col justify-end h-[200px]">
                            {/* Pending Segment (Top) */}
                            <div 
                              className="w-full bg-blue-200 transition-all duration-500 rounded-t-sm hover:brightness-95"
                              style={{ height: `${data.pending}%` }}
                            ></div>
                            {/* Approved Segment (Bottom) */}
                            <div 
                              className="w-full bg-[#0052CC] transition-all duration-500 hover:brightness-110"
                              style={{ height: `${data.approved}%` }}
                            ></div>
                          </div>
                          
                          {/* Label */}
                          <span className="text-[10px] font-bold text-slate-500 text-center truncate w-full">
                            {data.company}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0052CC]"></div>
                      <span className="text-xs font-bold text-[#0A2540]">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-200 border border-blue-300"></div>
                      <span className="text-xs font-bold text-slate-500">Pending/Flagged</span>
                    </div>
                  </div>

                </Card>
              </div>

            </div>

          </div>
        </div>

      </div>
    </>
  );
}
