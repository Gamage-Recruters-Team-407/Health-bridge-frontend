"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  Stethoscope,
  Heart,
  Activity,
} from "lucide-react";

interface MemberActivity {
  id: string;
  name: string;
  role: string;
  action: string;
  time: string;
  initials: string;
  color: string;
  badge: string;
}

const LIVE_MEMBERS: MemberActivity[] = [
  {
    id: "1",
    name: "Kasun Perera",
    role: "Patient",
    action: "Joined Health Bridge & booked consultation",
    time: "Just now",
    initials: "KP",
    color: "from-blue-600 to-cyan-500",
    badge: "General Care",
  },
  {
    id: "2",
    name: "Dr. Nilanthi Senanayake",
    role: "Doctor",
    action: "Joined Cardiology Specialist Network",
    time: "2m ago",
    initials: "NS",
    color: "from-emerald-500 to-teal-500",
    badge: "Cardiologist",
  },
  {
    id: "3",
    name: "Amaya De Silva",
    role: "Patient",
    action: "Activated Digital EHR & Family Pass",
    time: "5m ago",
    initials: "AD",
    color: "from-indigo-600 to-blue-500",
    badge: "Digital Passport",
  },
];

export default function RegisterIllustration({
  className = "",
}: {
  className?: string;
}) {
  const [activeUserIndex, setActiveUserIndex] = useState(0);

  // Subtle periodic rotation to simulate live user registration flow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUserIndex((prev) => (prev + 1) % LIVE_MEMBERS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full max-w-[560px] min-h-[480px] p-2 flex flex-col justify-between select-none ${className}`}
    >
      {/* Background Soft Ambient Blur & Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/70 via-cyan-50/50 to-indigo-100/60 rounded-3xl -z-10 blur-xl opacity-80" />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl border border-blue-200/60 shadow-xl shadow-blue-500/5 -z-10" />

      {/* Header Bar of Community Hub */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Health Bridge Community</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Live Patient & Doctor Registrations
            </div>
          </div>
        </div>

        {/* Live Counter Badge */}
        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>1,420+ Joined Today</span>
        </div>
      </div>

      {/* Main Glassmorphic Active Feed Card */}
      <div className="my-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-4 shadow-lg shadow-blue-500/5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Recent Registrations Stream</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Real-time sync</span>
        </div>

        {/* Member Stream Cards with subtle entrance animation */}
        <div className="space-y-2.5">
          {LIVE_MEMBERS.map((member, idx) => {
            const isHighlight = idx === activeUserIndex;
            return (
              <div
                key={member.id}
                className={`p-2.5 rounded-xl border transition-all duration-500 flex items-center justify-between ${
                  isHighlight
                    ? "bg-gradient-to-r from-blue-50/90 to-cyan-50/70 border-blue-300/80 shadow-md shadow-blue-500/10 scale-[1.01]"
                    : "bg-slate-50/60 border-slate-100 hover:bg-slate-50 opacity-80"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Bubble */}
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${member.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                    >
                      {member.initials}
                    </div>
                    {isHighlight && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Member info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {member.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          member.role === "Doctor"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>{member.action}</span>
                    </div>
                  </div>
                </div>

                {/* Right time & badge */}
                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] font-mono text-slate-400">
                    {member.time}
                  </span>
                  <span className="mt-0.5 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[9px] font-medium shadow-2xs">
                    {member.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Proof & Quick Benefits Footer */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex items-center justify-between">
        {/* Decorative Wave Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white">
            <circle cx="80" cy="50" r="40" />
          </svg>
        </div>

        <div className="flex items-center gap-3.5 z-10">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-400 flex items-center justify-center text-[10px] font-bold shadow-sm">
              🧑🏽‍⚕️
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-400 flex items-center justify-center text-[10px] font-bold shadow-sm">
              👩🏻
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-cyan-400 flex items-center justify-center text-[10px] font-bold shadow-sm">
              👨🏾
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-white text-blue-700 flex items-center justify-center text-[9px] font-extrabold shadow-sm">
              +12k
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold tracking-tight">
              Join 12,000+ Happy Patients
            </div>
            <div className="text-[10px] text-cyan-100 flex items-center gap-1.5 mt-0.5">
              <span>⭐️ 4.9/5 Rating</span>
              <span>•</span>
              <span>Instant Digital Passport</span>
            </div>
          </div>
        </div>

        {/* Small Action Indicator */}
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur transition cursor-pointer text-white">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Floating Interactive Badge Top Right */}
      <div className="absolute -top-3 right-4 bg-white/95 backdrop-blur shadow-lg border border-blue-100 px-3 py-1.5 rounded-full flex items-center gap-2 animate-bounce [animation-duration:5s]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-bold text-slate-800">
          🎉 Fast 30s Sign Up
        </span>
      </div>

      {/* Floating Interactive Badge Bottom Left */}
      <div className="absolute -bottom-3 left-4 bg-white/95 backdrop-blur shadow-lg border border-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-[11px] font-bold text-slate-800">
          HIPAA & GDPR Encrypted
        </span>
      </div>
    </div>
  );
}
