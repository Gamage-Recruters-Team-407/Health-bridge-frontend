export default function RegisterIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[540px] aspect-[4/3] select-none ${className}`}>
      {/* Background soft glow with gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100/70 via-blue-50/60 to-emerald-50/50 rounded-3xl -z-10" />

      {/* Main Digital Health Card / Onboarding Hub Screen */}
      <div className="absolute top-[8%] left-[6%] right-[6%] bottom-[8%] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Window Top Bar */}
        <div className="h-9 bg-slate-50 border-b border-slate-100 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] font-medium text-slate-400 tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            New Member Setup • Health Bridge
          </div>
          <div className="w-10" />
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
          {/* Top Patient ID Preview */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-3 text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
            {/* Background subtle watermark icon */}
            <div className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10 text-white pointer-events-none">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* User Avatar with verified ring */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center font-bold text-sm text-white shadow-inner">
                    ✨
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wide">
                    Digital Patient Passport
                  </div>
                  <div className="text-[10px] text-cyan-100 font-mono flex items-center gap-1 mt-0.5">
                    <span>ID: HB-2026-NEW</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px]">
                      Instant Activation
                    </span>
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold border border-white/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                <span>Ready to Join</span>
              </div>
            </div>
          </div>

          {/* 3 Quick-Start Features */}
          <div className="grid grid-cols-3 gap-2">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 flex flex-col justify-between hover:bg-blue-50/50 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800">1-Click Booking</div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                  Instant doctor slots
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 flex flex-col justify-between hover:bg-cyan-50/50 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800">Cloud Records</div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                  Unified health history
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 flex flex-col justify-between hover:bg-emerald-50/50 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800">24/7 Smart SOS</div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                  Emergency dispatch
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Onboarding Checklist / Progress Bar */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Account Setup Progress
              </span>
              <span className="text-blue-600 font-bold">1 Step Away • 90%</span>
            </div>
            {/* Animated shimmer progress bar */}
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 w-[90%] rounded-full relative">
                <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Welcome Badge Top Right */}
      <div className="absolute top-1 right-3 bg-white/95 backdrop-blur shadow-lg border border-cyan-100 p-2.5 rounded-2xl flex items-center gap-2 animate-bounce [animation-duration:4s]">
        <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/30">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="pr-1">
          <div className="text-[11px] font-bold text-slate-800">500+ Verified Doctors</div>
          <div className="text-[9px] text-slate-400">Available 24/7</div>
        </div>
      </div>

      {/* Floating Privacy & Security Badge Bottom Left */}
      <div className="absolute bottom-1 left-3 bg-white/95 backdrop-blur shadow-lg border border-emerald-100 p-2.5 rounded-2xl flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
        </div>
        <div className="pr-1">
          <div className="text-[11px] font-bold text-slate-800">100% Encrypted & Safe</div>
          <div className="text-[9px] text-slate-400">HIPAA & GDPR Compliant</div>
        </div>
      </div>
    </div>
  );
}
