"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  getInventoryByPharmacy, 
  getLowStockAlerts, 
  getDeliveriesByPharmacy
} from "@/services/pharmacyService";
import { superAdminService, PharmacyBranch } from "@/services/superadmin.service";
import type { InventoryItem, Delivery } from "@/types/pharmacy";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Hexagon, 
  AlertTriangle, 
  Clock, 
  Truck, 
  ArrowUp, 
  Pill,
  ChevronDown,
  Building2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Power
} from "lucide-react";
import toast from "react-hot-toast";

const chartData = [
  { name: "Mon", dispensed: 30, reorders: 10 },
  { name: "Tue", dispensed: 40, reorders: 12 },
  { name: "Wed", dispensed: 35, reorders: 15 },
  { name: "Thu", dispensed: 60, reorders: 12 },
  { name: "Fri", dispensed: 50, reorders: 25 },
  { name: "Sat", dispensed: 70, reorders: 20 },
  { name: "Sun", dispensed: 55, reorders: 28 },
];

export default function PharmacyManagementPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "branches">("overview");
  const [pharmacies, setPharmacies] = useState<PharmacyBranch[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setIsLoading(true);
    try {
      const branchList = await superAdminService.getAllPharmacyBranches();
      const branchArr = Array.isArray(branchList) ? branchList : [];
      setPharmacies(branchArr);
      
      if (branchArr.length > 0) {
        const firstId = branchArr[0].id;
        setSelectedPharmacyId(firstId);
        await loadPharmacyData(firstId);
      }
    } catch (e) {
      console.error("Error fetching pharmacies", e);
      toast.error("Failed to load pharmacy network");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPharmacyData = async (pharmacyId: string) => {
    try {
      const [invRes, lowRes, delRes] = await Promise.all([
        getInventoryByPharmacy(pharmacyId).catch(() => []),
        getLowStockAlerts(pharmacyId).catch(() => []),
        getDeliveriesByPharmacy(pharmacyId).catch(() => [])
      ]);
      setInventory(Array.isArray(invRes) ? invRes : []);
      setLowStock(Array.isArray(lowRes) ? lowRes : []);
      setDeliveries(Array.isArray(delRes) ? delRes : []);
    } catch (e) {
      console.error("Error fetching pharmacy metrics", e);
    }
  };

  const handleBranchChange = async (pharmacyId: string) => {
    setSelectedPharmacyId(pharmacyId);
    if (pharmacyId) {
      setIsLoading(true);
      await loadPharmacyData(pharmacyId);
      setIsLoading(false);
    }
  };

  const handleApprovePharmacy = async (pharmacyId: string) => {
    setActionLoadingId(pharmacyId);
    try {
      await superAdminService.approvePharmacy(pharmacyId);
      toast.success("Pharmacy branch approved successfully");
      setPharmacies(prev => 
        prev.map(p => p.id === pharmacyId ? { ...p, approved: true } : p)
      );
    } catch (err) {
      toast.error("Failed to approve pharmacy branch");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (pharmacy: PharmacyBranch) => {
    setActionLoadingId(pharmacy.id);
    const nextStatus = !pharmacy.active;
    try {
      await superAdminService.setPharmacyActive(pharmacy.id, nextStatus);
      toast.success(nextStatus ? "Pharmacy activated" : "Pharmacy deactivated");
      setPharmacies(prev => 
        prev.map(p => p.id === pharmacy.id ? { ...p, active: nextStatus } : p)
      );
    } catch (err) {
      toast.error("Failed to update pharmacy status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalStock = inventory.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const lowStockCount = lowStock.length;
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const expiringCount = inventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    return expiry <= thirtyDaysFromNow && expiry >= new Date();
  }).length;

  const activeDeliveriesCount = deliveries.filter(d => d.status !== "DELIVERED" && d.status !== "CANCELLED").length;

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white tracking-tight">
            Pharmacy Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Network-wide overview of active pharmacies, inventory reserves, consumption trends, and critical stock alerts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-[#0052CC] text-[#0052CC] dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Pill size={16} />
          Network Overview
        </button>
        <button
          onClick={() => setActiveTab("branches")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "branches"
              ? "border-[#0052CC] text-[#0052CC] dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Building2 size={16} />
          Registered Pharmacies
          {pharmacies.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {pharmacies.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* Pharmacy Branch Selector Bar */}
          {pharmacies.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Building2 size={18} className="text-[#0052CC]" />
                <span className="font-semibold">Selected Branch:</span>
              </div>
              <div className="relative min-w-[260px]">
                <select
                  value={selectedPharmacyId}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 appearance-none outline-none focus:border-[#0052CC] transition-colors"
                >
                  {pharmacies.map((pharm) => (
                    <option key={pharm.id} value={pharm.id}>
                      {pharm.name} ({pharm.city || "Branch"})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <Hexagon size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Medicines in stock</p>
                <p className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">
                  {isLoading ? "..." : totalStock.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <ArrowUp size={12} /> Live update
                </p>
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Low-stock items</p>
                <p className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">
                  {isLoading ? "..." : lowStockCount}
                </p>
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                  Requires attention
                </p>
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Expiring in 30 days</p>
                <p className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">
                  {isLoading ? "..." : expiringCount}
                </p>
                <p className="text-[10px] font-bold text-amber-600">
                  Review recommended
                </p>
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Active Deliveries</p>
                <p className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">
                  {isLoading ? "..." : activeDeliveriesCount}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  In progress
                </p>
              </div>
            </Card>

          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Span 2): Drug consumption trend */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-[#0A2540] dark:text-white">Drug consumption trend</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#0052CC]">
                    Last 7 days
                  </div>
                </div>

                {/* Custom Legend */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#1B5E20]"></div>
                    <span className="text-[11px] font-semibold text-slate-500">Dispensed units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#E65100]"></div>
                    <span className="text-[11px] font-semibold text-slate-500">Reorders raised</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={false}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="dispensed" 
                        stroke="#1B5E20" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6, fill: '#1B5E20' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reorders" 
                        stroke="#E65100" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6, fill: '#E65100' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Right Column (Span 1): Stock alerts */}
            <div className="lg:col-span-1">
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-[#0A2540] dark:text-white">Stock alerts</h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {lowStock.length} items
                  </span>
                </div>

                <div className="flex-1 space-y-0 overflow-y-auto max-h-[400px]">
                  {isLoading ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-medium">Loading stock alerts...</div>
                  ) : lowStock.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-medium">No active stock alerts for this pharmacy</div>
                  ) : (
                    lowStock.slice(0, 6).map((item, idx, arr) => (
                      <div key={item.id} className={`flex items-center justify-between py-3.5 ${idx !== arr.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-4 h-6 rounded-sm bg-slate-200 flex flex-col justify-end overflow-hidden shrink-0">
                            <div className={`w-full ${item.quantity === 0 ? 'bg-red-500 h-0' : item.quantity < (item.minimumStock / 2) ? 'bg-red-500 h-1/4' : 'bg-amber-500 h-2/4'}`}></div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0A2540] dark:text-white mb-0.5">{item.itemName}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                              BATCH {item.batchNumber} <span className="mx-1">•</span> {item.quantity} UNITS LEFT
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${item.quantity === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {item.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

          </div>

        </div>
      )}

      {activeTab === "branches" && (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Pharmacy Name</th>
                  <th className="px-6 py-4">Reg & License</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Approval</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Loading pharmacy branches...
                    </td>
                  </tr>
                ) : pharmacies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No pharmacy branches registered yet in the system.
                    </td>
                  </tr>
                ) : (
                  pharmacies.map((pharm) => (
                    <tr key={pharm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0A2540] dark:text-white">
                          {pharm.name}
                        </div>
                        {pharm.operatingHours && (
                          <div className="text-xs text-slate-400 font-medium mt-0.5">
                            {pharm.operatingHours}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {pharm.registrationNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Lic: {pharm.licenseNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {pharm.contactPerson || "N/A"}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          {pharm.phoneNumber && <span>{pharm.phoneNumber}</span>}
                          {pharm.email && <span>• {pharm.email}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {pharm.city || "—"}
                        </div>
                        <div className="text-slate-400 line-clamp-1">
                          {pharm.address || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {pharm.approved ? (
                          <Badge variant="success" size="sm">Approved</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {pharm.active ? (
                          <Badge variant="primary" size="sm">Active</Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!pharm.approved && (
                            <button
                              onClick={() => handleApprovePharmacy(pharm.id)}
                              disabled={actionLoadingId === pharm.id}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleActive(pharm)}
                            disabled={actionLoadingId === pharm.id}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 ${
                              pharm.active
                                ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40"
                                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40"
                            }`}
                          >
                            {pharm.active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
}
