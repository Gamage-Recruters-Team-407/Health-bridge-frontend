"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  Spinner,
  LoadingPage,
  ErrorState,
  useToast,
  ToastProvider,
  Navbar,
  Sidebar,
} from "@/components/ui";
import {
  Heart,
  Trash2,
  CheckCircle,
  Search,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  RefreshCw,
  Sliders,
  Bell,
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  MousePointerClick,
  Table2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const NAV_TABS = [
  { id: "all", label: "All" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Badges" },
  { id: "inputs", label: "Inputs" },
  { id: "cards", label: "Cards" },
  { id: "tables", label: "Tables" },
  { id: "modals", label: "Modals" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
] as const;

type TabId = typeof NAV_TABS[number]["id"];

const sampleTableData = [
  { id: "PAT-001", name: "Eleanor Vance", age: 34, blood: "A+", status: "Active" },
  { id: "PAT-002", name: "Marcus Holloway", age: 29, blood: "O-", status: "Pending" },
  { id: "PAT-003", name: "Sarah Connor", age: 42, blood: "B+", status: "Discharged" },
  { id: "PAT-004", name: "David Kim", age: 51, blood: "AB+", status: "Active" },
];

function UIShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg">("md");
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { success, error, warning, info } = useToast();
  const show = (tab: TabId) => activeTab === "all" || activeTab === tab;

  if (loadingOverlay) {
    return (
      <div className="relative">
        <button
          onClick={() => setLoadingOverlay(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl hover:bg-slate-800 transition-all border border-slate-700"
        >
          ← Back to UI Components
        </button>
        <LoadingPage message="LOADING YOUR HEALTH DASHBOARD..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] font-sans antialiased selection:bg-[#0052CC] selection:text-white flex flex-col">

      {/* ── Header — exact same as WelcomePage ── */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#0052CC] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm1 14h-2v-3H8v-2h3V7h2v3h3v2h-3v3z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
            Health <span className="text-[#0052CC]">Bridge</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052CC] hover:text-[#0047B3] transition-colors group"
          >
            <span>← Home</span>
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ── Hero Section — same style as WelcomePage hero text area ── */}
      <section className="relative w-full border-b border-slate-100 bg-white overflow-hidden">
        {/* Same soft blue atmosphere used by the welcome and loading screens */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EBF3FF]/70 via-white to-[#F8FAFC] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          {/* Badge pill — same as WelcomePage trusted badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3FF] text-[#0052CC] text-xs font-semibold border border-blue-100 mb-6">
            <span className="w-4 h-4 rounded-full bg-[#0052CC] text-white flex items-center justify-center text-[10px]">
              <LayoutGrid className="w-2.5 h-2.5" />
            </span>
            <span>HealthBridge Design System · v1.0</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-4">
            UI Component <br />
            <span className="text-[#0052CC]">Gallery</span>
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg mb-8">
            Every shared, reusable component used across the HealthBridge platform — fully interactive and live. Click, hover, and explore each one.
          </p>

          {/* Tab filter pills — same button style as WelcomePage CTA */}
          <div className="flex flex-wrap gap-2">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0052CC] hover:bg-[#0047B3] text-white shadow-md shadow-blue-500/20"
                    : "bg-white border border-slate-200 text-[#475569] hover:border-[#0052CC] hover:text-[#0052CC] shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content — same grid card style as WelcomePage feature section ── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-16 space-y-16">

        {/* ─── NAVIGATION ─── */}
        {show("navigation") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Navigation</h2>
              <p className="text-sm text-slate-500">Live sidebar navigation and dashboard navbar</p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl">
              <div className="h-[620px] overflow-hidden rounded-xl border border-slate-200/90 bg-[#F8FAFC] flex">
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                  mobileOpen={mobileSidebarOpen}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                  userRole="Design System Admin"
                  userName="UI Gallery User"
                />
                <div className="min-w-0 flex-1 flex flex-col">
                  <Navbar
                    title="Navigation Preview"
                    onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
                    userName="UI Gallery User"
                    userRole="Design System Admin"
                  />
                  <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC]">
                    <div className="max-w-xl rounded-xl border border-dashed border-slate-300 bg-white p-6">
                      <p className="text-sm font-semibold text-slate-700">Dashboard content preview</p>
                      <p className="mt-1 text-xs text-slate-500">Use the sidebar collapse control, navbar notifications, profile menu, and search field above.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4 md:hidden"
                        onClick={() => setMobileSidebarOpen(true)}
                      >
                        Open Mobile Sidebar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── BUTTONS ─── */}
        {show("buttons") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Button</h2>
              <p className="text-sm text-slate-500">7 variants · 4 sizes · loading & disabled states</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">All Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="success" leftIcon={<CheckCircle className="w-4 h-4" />}>Success</Button>
                  <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sizes & States</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="primary">Small</Button>
                  <Button size="md" variant="primary">Medium</Button>
                  <Button size="lg" variant="primary">Large</Button>
                  <Button variant="primary" isLoading={btnLoading} onClick={() => { setBtnLoading(true); setTimeout(() => setBtnLoading(false), 2000); }}>
                    {btnLoading ? "Loading..." : "Click → Loading"}
                  </Button>
                  <Button disabled variant="primary">Disabled</Button>
                  <Button size="icon" variant="outline"><Heart className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── BADGES ─── */}
        {show("badges") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Badge</h2>
              <p className="text-sm text-slate-500">Status indicators with live dot · 8 variants · 3 sizes</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">With Live Dot</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary" dot>Primary</Badge>
                  <Badge variant="success" dot>Active</Badge>
                  <Badge variant="warning" dot>Pending</Badge>
                  <Badge variant="danger" dot>Critical</Badge>
                  <Badge variant="info" dot>Info</Badge>
                  <Badge variant="purple" dot>Specialist</Badge>
                  <Badge variant="neutral" dot>Neutral</Badge>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="success" size="sm">Small</Badge>
                  <Badge variant="primary" size="md">Medium</Badge>
                  <Badge variant="purple" size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── INPUTS ─── */}
        {show("inputs") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Input</h2>
              <p className="text-sm text-slate-500">With icons · helper text · validation error states</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Email Address" placeholder="doctor@hospital.com" leftIcon={<Mail className="w-4 h-4 text-slate-400" />} helperText="Appointment notifications will be sent here." />
                <Input label="Password" type="password" placeholder="••••••••" leftIcon={<Lock className="w-4 h-4 text-slate-400" />} />
                <Input label="Search Records" placeholder="Patient name, MRN, or doctor..." leftIcon={<Search className="w-4 h-4 text-slate-400" />} />
                <Input label="Hospital License No." placeholder="HL-89410" error="Invalid format. Must start with HL-" />
              </div>
            </div>
          </section>
        )}

        {/* ─── CARDS ─── */}
        {show("cards") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Card</h2>
              <p className="text-sm text-slate-500">4 variants: default · bordered · glass · interactive</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Clean shadow-sm border container</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Standard card for dashboards and detail sections.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">Learn More</Button>
                </CardFooter>
              </Card>
              <Card variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Interactive Card</CardTitle>
                    <Badge variant="primary" size="sm">Hover Me</Badge>
                  </div>
                  <CardDescription>Hover lift &amp; border glow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Smooth hover shadow and border transitions.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold text-[#0052CC] flex items-center gap-1">
                    Open Details <ChevronRight className="w-3 h-3" />
                  </span>
                </CardFooter>
              </Card>
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Bordered Card</CardTitle>
                  <CardDescription>High-contrast 2px border</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">For highlighted summaries and tabular sections.</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="success" dot>Active</Badge>
                </CardFooter>
              </Card>
            </div>
          </section>
        )}

        {/* ─── TABLES ─── */}
        {show("tables") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <Table2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Table</h2>
              <p className="text-sm text-slate-500">Responsive · status badges · pagination</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h3 className="font-bold text-[#0F172A]">Patient Records</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sample data with status badges and pagination controls</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleTableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold text-[#0F172A]">{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.age} yrs</TableCell>
                      <TableCell><Badge variant="purple" size="sm">{row.blood}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "neutral"} dot>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination currentPage={1} totalPages={4} totalRecords={16} onPageChange={() => {}} />
            </div>
          </section>
        )}

        {/* ─── MODALS ─── */}
        {show("modals") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Modal</h2>
              <p className="text-sm text-slate-500">Accessible backdrop modal · sm / md / lg sizes</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => { setModalSize("sm"); setModalOpen(true); }}
                  className="px-6 py-3 rounded-xl border border-blue-100 bg-white text-[#0052CC] font-semibold text-sm hover:bg-[#EBF3FF] transition-all shadow-sm"
                >
                  Small Modal
                </button>
                <button
                  onClick={() => { setModalSize("md"); setModalOpen(true); }}
                  className="px-6 py-3.5 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                >
                  Medium Modal
                </button>
                <button
                  onClick={() => { setModalSize("lg"); setModalOpen(true); }}
                  className="px-6 py-3 rounded-xl border border-blue-100 bg-white text-[#0052CC] font-semibold text-sm hover:bg-[#EBF3FF] transition-all shadow-sm"
                >
                  Large Modal
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ─── FEEDBACK ─── */}
        {show("feedback") && (
          <section>
            <div className="text-center space-y-2 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Feedback & Loaders</h2>
              <p className="text-sm text-slate-500">Toasts · Spinners · LoadingPage · ErrorState</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toasts */}
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mb-4">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Toast Notifications</h3>
                <p className="text-xs text-slate-500 mb-5">Click any button to trigger a live notification</p>
                <div className="flex flex-wrap gap-2.5">
                  <Button size="sm" variant="success" onClick={() => success("Appointment Confirmed", "Dr. Smith booked for Friday at 10:00 AM")}>Success</Button>
                  <Button size="sm" variant="danger" onClick={() => error("Network Error", "Unable to connect to medical records.")}>Error</Button>
                  <Button size="sm" variant="primary" onClick={() => info("System Update", "Maintenance at 11 PM tonight.")}>Info</Button>
                  <Button size="sm" variant="outline" onClick={() => warning("Prescription Expiry", "Amoxicillin expires in 3 days.")}>Warning</Button>
                </div>
              </div>

              {/* Spinners */}
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mb-4">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Loaders & Spinners</h3>
                <p className="text-xs text-slate-500 mb-5">Micro spinners · full-screen loading display</p>
                <div className="flex items-end gap-8 mb-5">
                  {(["sm", "md", "lg", "xl"] as const).map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Spinner size={size} />
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">{size}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setLoadingOverlay(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052CC] hover:text-[#0047B3] transition-colors group"
                >
                  <span>Launch Full-Screen LoadingPage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Error State — full width */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="px-8 py-6 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-[#EBF3FF] text-[#0052CC] flex items-center justify-center mb-3">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0F172A]">ErrorState</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Standardised error/empty state for API & network failures</p>
                </div>
                <ErrorState
                  type="network"
                  title="Unable to Load Medical History"
                  description="The medical record repository is undergoing scheduled synchronization. Please try again in a few moments."
                  onRetry={() => info("Retrying...", "Reconnecting to the server.")}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer — same as WelcomePage ── */}
      <footer className="mt-auto border-t border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Health Bridge. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/login" className="hover:text-[#0052CC] transition-colors">Login</Link>
            <Link href="/register" className="hover:text-[#0052CC] transition-colors">Register</Link>
            <Link href="/" className="hover:text-[#0052CC] transition-colors">Home</Link>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size={modalSize}
        title="Schedule New Appointment"
        description="Select your preferred doctor and appointment time."
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setModalOpen(false); success("Appointment Created", "Your appointment has been registered."); }}>
              Confirm Appointment
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Doctor Specialization" placeholder="e.g. Cardiology, Neurology" />
          <Input label="Preferred Date" type="date" />
          <Input label="Symptoms / Notes" placeholder="Describe symptoms or reasons for visit" />
        </div>
      </Modal>
    </div>
  );
}

export default function UIPage() {
  return (
    <ToastProvider>
      <UIShowcase />
    </ToastProvider>
  );
}
