"use client";

import { Calendar, Pill, FileText, MessageSquare } from "lucide-react";

export default function PatientDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Upcoming appointments", val: "2", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Active prescriptions", val: "3", icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "New lab reports", val: "1", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "New messages from Insurance", val: "4", icon: MessageSquare, color: "text-rose-600", bg: "bg-rose-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Upcoming appointments</h2>
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline">View all</a>
          </div>
          <div className="space-y-4">
             {/* Appt 1 */}
             <div className="flex items-center justify-between py-3 border-b border-slate-100">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">RP</div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-900">Dr. Ravi Perera</h4>
                   <p className="text-xs text-slate-500">Cardiology · Video consult</p>
                 </div>
               </div>
               <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full">Today, 3:30 PM</span>
             </div>
             {/* Appt 2 */}
             <div className="flex items-center justify-between py-3 border-b border-slate-100">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">NF</div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-900">Dr. Nadia Fonseka</h4>
                   <p className="text-xs text-slate-500">Dermatology · In person</p>
                 </div>
               </div>
               <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full">Fri, 10:00 AM</span>
             </div>
             {/* Appt 3 */}
             <div className="flex items-center justify-between py-3 border-slate-100">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">KM</div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-900">Dr. Kavindu Mendis</h4>
                   <p className="text-xs text-slate-500">General physician · Video consult</p>
                 </div>
               </div>
               <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full">Mon, 9:15 AM</span>
             </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Vitals this week</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Blood pressure</span>
                <span className="text-sm font-bold text-slate-900">118/76 mmHg</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Heart rate</span>
                <span className="text-sm font-bold text-slate-900">72 bpm</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Weight</span>
                <span className="text-sm font-bold text-slate-900">64 kg</span>
            </div>
            <div className="flex justify-between items-center py-3">
                <span className="text-sm text-slate-500 font-medium">Blood sugar</span>
                <span className="text-sm font-bold text-slate-900">98 mg/dL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Reports */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent lab reports</h2>
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">View all</a>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-200">
              <th className="pb-3 font-medium px-2">Test</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right px-2"></th>
            </tr>
          </thead>
          <tbody>
            {/* Report 1 */}
            <tr className="border-b border-slate-100">
              <td className="py-4 font-medium text-slate-900 px-2">Complete blood count</td>
              <td className="py-4 text-slate-500">Aug 2, 2026</td>
              <td className="py-4"><span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">Normal</span></td>
              <td className="py-4 text-right px-2"><a href="#" className="text-blue-600 hover:underline font-medium">View report</a></td>
            </tr>
            {/* Report 2 */}
            <tr className="border-b border-slate-100">
              <td className="py-4 font-medium text-slate-900 px-2">Lipid profile</td>
              <td className="py-4 text-slate-500">Jul 28, 2026</td>
              <td className="py-4"><span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold">Review needed</span></td>
              <td className="py-4 text-right px-2"><a href="#" className="text-blue-600 hover:underline font-medium">View report</a></td>
            </tr>
            {/* Report 3 */}
            <tr>
              <td className="py-4 font-medium text-slate-900 px-2">Thyroid function test</td>
              <td className="py-4 text-slate-500">Jul 15, 2026</td>
              <td className="py-4"><span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">Normal</span></td>
              <td className="py-4 text-right px-2"><a href="#" className="text-blue-600 hover:underline font-medium">View report</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
