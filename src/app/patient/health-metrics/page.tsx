"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, AuthUser } from "@/lib/auth";
import { Navbar } from "@/components/ui/Navbar";
import { Activity, HeartPulse, Scale, Droplet, Plus, X } from "lucide-react";
import api from "@/lib/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HealthMetricsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ metricType: "Heart Rate", value: "", unit: "bpm" });
  
  // State for chart tabs and live validation errors
  const [activeChart, setActiveChart] = useState("Heart Rate");
  const [timeRange, setTimeRange] = useState("1M"); // New Time Range Filter (Default to 1 Month)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(storedUser);
      fetchMetrics(storedUser.id);
    }
  }, [router]);

  const fetchMetrics = async (patientId: string) => {
    try {
      const data = await api.get<any[]>(`/health-metrics/patient/${patientId}`);
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load metrics", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const type = formData.metricType;
    const val = formData.value.trim();

    // Strict Input Validation - setting error state instead of popups
    if (type === "Blood Pressure") {
      const bpRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!bpRegex.test(val)) {
        setError("Format must be like '120/80'.");
        return;
      }
      const [sys, dia] = val.split("/");
      if (Number(sys) < 70 || Number(sys) > 250 || Number(dia) < 40 || Number(dia) > 150) {
        setError("Out of safe human range (Sys: 70-250, Dia: 40-150).");
        return;
      }
    } else {
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < 0) {
        setError("Value must be a positive number.");
        return;
      }
      if (type === "Heart Rate" && (numVal < 30 || numVal > 250)) {
        setError("Heart Rate is out of safe human range (30-250 bpm).");
        return;
      }
      if (type === "Weight" && (numVal < 2 || numVal > 300)) {
        setError("Weight is out of safe human range (2-300 kg).");
        return;
      }
      if (type === "Blood Sugar" && (numVal < 20 || numVal > 600)) {
        setError("Blood Sugar is out of safe human range (20-600 mg/dL).");
        return;
      }
    }

    try {
      await api.post("/health-metrics", { ...formData, patientId: user?.id });
      setShowModal(false);
      setFormData({ metricType: "Heart Rate", value: "", unit: "bpm" });
      setError(null);
      if (user) fetchMetrics(user.id);
    } catch (err) {
      setError("Failed to save metric to the database.");
    }
  };

  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse";
    switch (type) {
      case "Heart Rate": return <HeartPulse className={`${iconClass} text-red-500`} />;
      case "Blood Pressure": return <Activity className={`${iconClass} text-blue-500`} />;
      case "Weight": return <Scale className={`${iconClass} text-purple-500`} />;
      case "Blood Sugar": return <Droplet className={`${iconClass} text-emerald-500`} />;
      default: return <Activity className={`${iconClass} text-slate-500`} />;
    }
  };

  const getChartData = (type: string) => {
    // 1. Calculate Cutoff Date based on Time Range Filter
    const now = new Date().getTime();
    let cutoff = 0; // "All"
    if (timeRange === "1W") cutoff = now - 7 * 24 * 60 * 60 * 1000;
    if (timeRange === "1M") cutoff = now - 30 * 24 * 60 * 60 * 1000;
    if (timeRange === "6M") cutoff = now - 180 * 24 * 60 * 60 * 1000;

    // 2. Filter by Type AND Cutoff Date
    const filtered = metrics.filter(m => {
      if (m.metricType !== type) return false;
      if (new Date(m.recordedAt).getTime() < cutoff) return false;
      return true;
    });

    // 3. Sort oldest to newest for the chart timeline
    const sorted = filtered.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    
    return sorted.map(m => {
      const dateObj = new Date(m.recordedAt);
      const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
      
      if (type === "Blood Pressure") {
        let sys = 0, dia = 0;
        if (m.value && m.value.includes("/")) {
          const parts = m.value.split("/");
          sys = parseInt(parts[0].trim()) || 0;
          dia = parseInt(parts[1].trim()) || 0;
        } else {
          sys = parseInt(m.value) || 0;
        }
        return { date: formattedDate, systolic: sys, diastolic: dia };
      }
      
      return { date: formattedDate, value: parseFloat(m.value) || 0 };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Health Metrics" userName={user?.fullName || "User"} userRole={user?.role || "PATIENT"} />

      <main className="flex-1 p-6 sm:p-10 w-full relative">
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Your Health Metrics</h1>
              <p className="text-sm text-slate-500 mt-1">Track and monitor your vital signs over time.</p>
            </div>
            <button 
              onClick={() => { setShowModal(true); setError(null); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log New Metric
            </button>
          </div>

          {/* Top 4 Permanent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {["Heart Rate", "Blood Pressure", "Weight", "Blood Sugar"].map((type) => {
              const latest = metrics.find(m => m.metricType === type);
              return (
                <div key={type} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      {getIcon(type)}
                    </div>
                    <h3 className="font-semibold text-slate-700">{type}</h3>
                  </div>
                  {latest ? (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-900">{latest.value}</span>
                        <span className="text-sm text-slate-500 mb-1">{latest.unit}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-medium">
                        Last logged: {new Date(latest.recordedAt).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-300">--</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-medium">
                        Not logged yet
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* New Interactive Trends Chart Section */}
          <div className="mt-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Health Trends</h2>
                {/* NEW TIME RANGE FILTER */}
                <div className="flex items-center gap-1.5 mt-2">
                  {["1W", "1M", "6M", "All"].map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                        timeRange === range 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto mt-4 sm:mt-0">
                {["Heart Rate", "Blood Pressure", "Weight", "Blood Sugar"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      activeChart === tab 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full mt-8">
              {getChartData(activeChart).length === 0 ? (
                <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-medium">No data found for this time period.</p>
                  <button onClick={() => setTimeRange("All")} className="text-xs text-blue-600 font-semibold hover:underline">View All Time</button>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === "Blood Pressure" ? (
                    <LineChart data={getChartData(activeChart)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Systolic (Top)" />
                      <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Diastolic (Bottom)" />
                    </LineChart>
                  ) : (
                    <LineChart data={getChartData(activeChart)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={activeChart === "Heart Rate" ? "#ef4444" : activeChart === "Weight" ? "#a855f7" : "#10b981"} 
                        strokeWidth={3} 
                        dot={{r: 4, fill: '#fff', strokeWidth: 2}} 
                        activeDot={{r: 6}} 
                        name={activeChart}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Log New Metric</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Metric Type</label>
                  <select 
                    value={formData.metricType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      let autoUnit = "";
                      if (newType === "Heart Rate") autoUnit = "bpm";
                      if (newType === "Blood Pressure") autoUnit = "mmHg";
                      if (newType === "Weight") autoUnit = "kg";
                      if (newType === "Blood Sugar") autoUnit = "mg/dL";
                      
                      setFormData({ ...formData, metricType: newType, unit: autoUnit });
                      setError(null);
                    }}
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 outline-none transition bg-white"
                  >
                    <option>Heart Rate</option>
                    <option>Blood Pressure</option>
                    <option>Weight</option>
                    <option>Blood Sugar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Value</label>
                  <input 
                    type="text" required 
                    placeholder={
                      formData.metricType === "Blood Pressure" ? "e.g. 120/80" :
                      formData.metricType === "Weight" ? "e.g. 70.5" :
                      formData.metricType === "Blood Sugar" ? "e.g. 95" :
                      "e.g. 72"
                    }
                    value={formData.value}
                    onChange={(e) => {
                      setFormData({ ...formData, value: e.target.value });
                      setError(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border outline-none transition ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500/30' : 'border-slate-200 focus:ring-2 focus:ring-blue-600/30'}`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                  <input 
                    type="text" required readOnly
                    value={formData.unit}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                  Save to Dashboard
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
