"use client";

import React, { useState } from "react";
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
  ChevronRight,
  Home,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  UserCog,
  MoreVertical,
  ChevronLeft
} from "lucide-react";

// Mock Data
const mockProviders = [
  {
    id: "PRV-84920",
    logoText: "BC",
    logoColor: "bg-indigo-100 text-indigo-700",
    name: "BlueCross Health",
    license: "LCN-2023-A991",
    contactName: "Sarah Jenkins",
    contactRole: "Compliance Officer",
    regions: ["North America", "EU"],
    status: "Approved"
  },
  {
    id: "PRV-84921",
    logoText: "MN",
    logoColor: "bg-orange-100 text-orange-700",
    name: "MediNet Global",
    license: "LCN-2023-B442",
    contactName: "David Chen",
    contactRole: "Director of Ops",
    regions: ["APAC"],
    status: "Pending"
  },
  {
    id: "PRV-84918",
    logoText: "UA",
    logoColor: "bg-red-100 text-red-700",
    name: "United Assurance",
    license: "LCN-2022-X109",
    contactName: "Robert Vance",
    contactRole: "Legal Rep",
    regions: ["North America", "LATAM"],
    status: "Suspended"
  },
  {
    id: "PRV-84955",
    logoText: "AE",
    logoColor: "bg-blue-100 text-blue-700",
    name: "Aetna Equinox",
    license: "LCN-2024-C881",
    contactName: "Maria Gonzalez",
    contactRole: "VP Relations",
    regions: ["Global"],
    status: "Approved"
  }
];

export default function InsuranceRegistryPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === mockProviders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockProviders.map(p => p.id));
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] font-bold text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* We apply bg-[#F8FAFC] explicitly here to ensure the full page background matches the Figma design */}
      <div className="-mt-8 -mx-8 -mb-8 px-8 py-8 bg-[#F8FAFC] dark:bg-slate-950 min-h-[calc(100vh-80px)] font-sans">
        
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="w-full">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Home size={12} />
                <Link href="/super-admin/dashboard" className="hover:text-[#0052CC] transition-colors">Dashboard</Link>
                <ChevronRight size={12} />
                <span className="text-[#0A2540] dark:text-slate-200">Insurance Registry</span>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#0A2540] dark:text-white tracking-tight mb-2">
                    Insurance Provider Registry
                  </h1>
                  <p className="text-sm font-medium text-slate-500">
                    Manage onboarded insurance companies, verify licenses, and monitor coverage statuses.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="outline" leftIcon={<Download size={16} />} className="font-bold text-[#0052CC] border-[#0052CC] hover:bg-blue-50 px-5">
                    Export CSV
                  </Button>
                  <Button variant="primary" leftIcon={<Plus size={16} />} className="font-bold bg-[#0052CC] hover:bg-blue-700 px-5">
                    Onboard Provider
                  </Button>
                </div>
              </div>

              {/* Module Navigation Tabs */}
              <div className="flex items-center gap-6 mt-6 border-b border-slate-100">
                <Link href="/super-admin/insurance" className="pb-3 text-sm font-bold text-[#0052CC] border-b-2 border-[#0052CC]">
                  Provider Registry
                </Link>
                <Link href="/super-admin/insurance/approvals" className="pb-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Pending Approvals
                </Link>
                <Link href="/super-admin/insurance/claims" className="pb-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Claims & Fraud
                </Link>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar Card */}
          <Card className="p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-end gap-4">
            
            {/* Search Input */}
            <div className="w-full md:w-[40%]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Search Providers</label>
              <Input 
                placeholder="Search by name, license #, or region..." 
                leftIcon={<Search size={16} className="text-slate-400" />}
                className="rounded-xl bg-slate-50 border-slate-200 h-10"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Status</label>
              <div className="relative">
                <select className="w-full h-10 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]">
                  <option>All Statuses</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Region Filter */}
            <div className="w-full md:w-48">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Region</label>
              <div className="relative">
                <select className="w-full h-10 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]">
                  <option>All Regions</option>
                  <option>North America</option>
                  <option>EU</option>
                  <option>APAC</option>
                  <option>LATAM</option>
                  <option>Global</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* More Filters */}
            <div className="w-full md:w-auto shrink-0">
              <Button variant="outline" leftIcon={<Filter size={16} />} className="w-full font-bold text-slate-600 border-slate-200 hover:bg-slate-50 h-10 px-5 rounded-xl">
                More Filters
              </Button>
            </div>

          </Card>

          {/* Directory Table Card */}
          <Card className="rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden bg-white">
            
            {/* Table Header Area */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A2540] dark:text-white">Provider Directory</h2>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">2,405 Total Records</span>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="w-12 pl-6">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-[#0052CC] focus:ring-[#0052CC]" 
                          checked={selectedRows.length === mockProviders.length}
                          onChange={toggleAllRows}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Company Name</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">License No.</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Contact</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Coverage Regions</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Status</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProviders.map((provider) => (
                    <TableRow key={provider.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Checkbox */}
                      <TableCell className="pl-6">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-[#0052CC] focus:ring-[#0052CC]" 
                            checked={selectedRows.includes(provider.id)}
                            onChange={() => toggleRowSelection(provider.id)}
                          />
                        </div>
                      </TableCell>

                      {/* Company Name */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${provider.logoColor}`}>
                            {provider.logoText}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0A2540]">{provider.name}</p>
                            <p className="text-[11px] font-medium text-slate-400">ID: {provider.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* License */}
                      <TableCell className="py-4">
                        <p className="text-sm font-bold text-[#0A2540] w-32">{provider.license}</p>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="py-4">
                        <p className="text-sm font-bold text-[#0A2540]">{provider.contactName}</p>
                        <p className="text-[11px] font-medium text-slate-500">{provider.contactRole}</p>
                      </TableCell>

                      {/* Coverage Regions */}
                      <TableCell className="py-4">
                        <div className="flex flex-wrap items-center gap-1.5 w-40">
                          {provider.regions.map((region, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                              {region}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {renderStatusBadge(provider.status)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition-colors">
                            <UserCog size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs font-medium text-slate-500 mb-4 sm:mb-0">
                Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">4</span> of <span className="font-bold text-slate-700">2,405</span> entries
              </p>
              
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-[#0052CC] text-xs font-bold transition-colors">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">
                  3
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold">
                  ...
                </span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">
                  241
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </Card>

        </div>
      </div>
    </>
  );
}
