"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Module = {
  id: number;
  title: string;
  short: string;
  frontend: string[];
  backend: string[];
  mongo: string[];
  tasks: string[];
};

const modules: Module[] = [
  {
    id: 1,
    title: "Authentication & Security",
    short: "Secure login, registration, JWT and role-based access.",
    frontend: [
      "Login / Register UI",
      "Forgot Password",
      "Reset Password",
      "Role-based UI",
      "Protected Routes",
    ],
    backend: [
      "Authentication APIs",
      "JWT Authentication",
      "Password Hashing",
      "Role-based Authorization",
      "Security Middleware",
    ],
    mongo: [
      "users collection",
      "roles",
      "permissions",
      "refresh tokens",
    ],
    tasks: [
      "Implement secure authentication",
      "Connect frontend with auth APIs",
      "Handle validation and errors",
      "Protect private routes",
    ],
  },
  {
    id: 2,
    title: "User Profile & Account",
    short: "Manage user profiles, account information and preferences.",
    frontend: [
      "Profile Page",
      "Edit Profile",
      "Profile Image",
      "Account Settings",
      "Password Change",
    ],
    backend: [
      "Profile APIs",
      "Update User",
      "Password Update",
      "Account Settings API",
    ],
    mongo: [
      "user profile data",
      "contact information",
      "preferences",
    ],
    tasks: [
      "Create profile UI",
      "Build profile APIs",
      "Connect profile data",
      "Add account settings",
    ],
  },
  {
    id: 3,
    title: "Patient Management",
    short: "Patient registration, details and patient records.",
    frontend: [
      "Patient Dashboard",
      "Patient Registration",
      "Patient List",
      "Patient Details",
      "Search & Filter",
    ],
    backend: [
      "Patient CRUD APIs",
      "Patient Search",
      "Patient Validation",
      "Patient History",
    ],
    mongo: [
      "patients collection",
      "patient details",
      "emergency contacts",
    ],
    tasks: [
      "Develop patient management UI",
      "Create CRUD APIs",
      "Implement search",
      "Connect MongoDB",
    ],
  },
  {
    id: 4,
    title: "Doctor Management",
    short: "Doctor profiles, specialties and availability.",
    frontend: [
      "Doctor Dashboard",
      "Doctor Profile",
      "Doctor List",
      "Specialty Filter",
      "Availability UI",
    ],
    backend: [
      "Doctor CRUD APIs",
      "Specialty APIs",
      "Availability APIs",
      "Doctor Search",
    ],
    mongo: [
      "doctors collection",
      "specialties",
      "availability",
    ],
    tasks: [
      "Build doctor management",
      "Create doctor APIs",
      "Implement availability",
      "Connect doctor search",
    ],
  },
  {
    id: 5,
    title: "Appointment Management",
    short: "Book, manage and track medical appointments.",
    frontend: [
      "Appointment Booking",
      "Appointment Calendar",
      "Upcoming Appointments",
      "Appointment Details",
      "Cancel / Reschedule",
    ],
    backend: [
      "Appointment APIs",
      "Booking Logic",
      "Availability Validation",
      "Cancellation API",
    ],
    mongo: [
      "appointments collection",
      "appointment status",
      "time slots",
    ],
    tasks: [
      "Create booking interface",
      "Implement appointment APIs",
      "Prevent double booking",
      "Add cancellation flow",
    ],
  },
  {
    id: 6,
    title: "Medical Records / EHR",
    short: "Electronic health records and medical history.",
    frontend: [
      "Medical History",
      "Patient Records",
      "Record Details",
      "Document Upload",
      "Record Timeline",
    ],
    backend: [
      "Medical Record APIs",
      "History APIs",
      "Document Handling",
      "Record Access Control",
    ],
    mongo: [
      "medical_records",
      "medical history",
      "documents",
    ],
    tasks: [
      "Build EHR interface",
      "Create record APIs",
      "Implement access control",
      "Connect medical history",
    ],
  },
  {
    id: 7,
    title: "Prescription Management",
    short: "Create and manage prescriptions and medication details.",
    frontend: [
      "Prescription UI",
      "Medicine Search",
      "Prescription History",
      "Prescription Details",
    ],
    backend: [
      "Prescription APIs",
      "Medicine APIs",
      "Prescription Validation",
      "Prescription History",
    ],
    mongo: [
      "prescriptions",
      "medicines",
      "dosage details",
    ],
    tasks: [
      "Create prescription UI",
      "Implement APIs",
      "Add medicine search",
      "Connect prescription history",
    ],
  },
  {
    id: 8,
    title: "Laboratory",
    short: "Lab tests, reports and diagnostic information.",
    frontend: [
      "Lab Dashboard",
      "Test Booking",
      "Test Results",
      "Report Viewer",
      "Lab History",
    ],
    backend: [
      "Lab APIs",
      "Test Management",
      "Result APIs",
      "Report Management",
    ],
    mongo: [
      "lab_tests",
      "lab_results",
      "lab_reports",
    ],
    tasks: [
      "Build laboratory module",
      "Create test APIs",
      "Implement result management",
      "Add report viewing",
    ],
  },
  {
    id: 9,
    title: "Pharmacy",
    short: "Medicine inventory, orders and pharmacy operations.",
    frontend: [
      "Pharmacy Dashboard",
      "Medicine List",
      "Medicine Search",
      "Orders",
      "Stock View",
    ],
    backend: [
      "Medicine APIs",
      "Pharmacy APIs",
      "Order APIs",
      "Stock Management",
    ],
    mongo: [
      "medicines",
      "pharmacy_orders",
      "stock",
    ],
    tasks: [
      "Build pharmacy interface",
      "Implement medicine APIs",
      "Manage stock",
      "Implement orders",
    ],
  },
  {
    id: 10,
    title: "Hospital Management",
    short: "Hospital information, departments and staff management.",
    frontend: [
      "Hospital Dashboard",
      "Hospital Profile",
      "Departments",
      "Staff Management",
      "Hospital Search",
    ],
    backend: [
      "Hospital CRUD APIs",
      "Department APIs",
      "Staff APIs",
      "Hospital Search",
    ],
    mongo: [
      "hospitals",
      "departments",
      "hospital_staff",
    ],
    tasks: [
      "Create hospital dashboard",
      "Implement hospital APIs",
      "Manage departments",
      "Connect staff management",
    ],
  },
  {
    id: 11,
    title: "Hospital Billing & Inventory",
    short: "Billing, invoices and hospital inventory management.",
    frontend: [
      "Billing Dashboard",
      "Invoice UI",
      "Payment Status",
      "Inventory Dashboard",
      "Stock Alerts",
    ],
    backend: [
      "Billing APIs",
      "Invoice APIs",
      "Inventory APIs",
      "Stock Management",
    ],
    mongo: [
      "invoices",
      "billing_records",
      "inventory",
      "stock_movements",
    ],
    tasks: [
      "Build billing interface",
      "Implement invoice system",
      "Create inventory APIs",
      "Add stock alerts",
    ],
  },
  {
    id: 12,
    title: "Telemedicine",
    short: "Online consultations and virtual healthcare services.",
    frontend: [
      "Video Consultation UI",
      "Doctor Online Status",
      "Consultation Room",
      "Chat Interface",
      "Call History",
    ],
    backend: [
      "Consultation APIs",
      "Session Management",
      "Online Status",
      "Chat APIs",
    ],
    mongo: [
      "consultations",
      "sessions",
      "chat_messages",
    ],
    tasks: [
      "Create consultation UI",
      "Implement session handling",
      "Build chat functionality",
      "Connect consultation APIs",
    ],
  },
  {
    id: 13,
    title: "Emergency SOS",
    short: "Emergency assistance and SOS functionality.",
    frontend: [
      "SOS Button",
      "Emergency Screen",
      "Emergency Contacts",
      "Location Sharing",
      "Emergency Status",
    ],
    backend: [
      "SOS APIs",
      "Emergency Request Handling",
      "Location APIs",
      "Emergency Notifications",
    ],
    mongo: [
      "emergency_requests",
      "emergency_contacts",
      "locations",
    ],
    tasks: [
      "Create SOS interface",
      "Implement emergency APIs",
      "Handle location sharing",
      "Connect notifications",
    ],
  },
  {
    id: 14,
    title: "Insurance",
    short: "Insurance information, claims and policy management.",
    frontend: [
      "Insurance Dashboard",
      "Policy Details",
      "Claims UI",
      "Claim Status",
      "Insurance Documents",
    ],
    backend: [
      "Insurance APIs",
      "Policy APIs",
      "Claims APIs",
      "Document APIs",
    ],
    mongo: [
      "insurance_policies",
      "insurance_claims",
      "insurance_documents",
    ],
    tasks: [
      "Build insurance dashboard",
      "Implement policy APIs",
      "Create claims system",
      "Manage documents",
    ],
  },
  {
    id: 15,
    title: "Fraud Detection & Risk",
    short: "Risk analysis, suspicious activity and fraud detection.",
    frontend: [
      "Risk Dashboard",
      "Risk Score",
      "Fraud Alerts",
      "Suspicious Activity",
      "Risk Reports",
    ],
    backend: [
      "Fraud Detection APIs",
      "Risk Scoring",
      "Rule Engine",
      "Fraud Alerts",
    ],
    mongo: [
      "risk_records",
      "fraud_events",
      "risk_scores",
      "alerts",
    ],
    tasks: [
      "Create risk dashboard",
      "Implement detection logic",
      "Add risk scoring",
      "Connect fraud alerts",
    ],
  },
  {
    id: 16,
    title: "Payments",
    short: "Secure online payments and transaction management.",
    frontend: [
      "Payment UI",
      "Checkout",
      "Payment Status",
      "Transaction History",
      "Payment Details",
    ],
    backend: [
      "Payment APIs",
      "Transaction Handling",
      "Payment Verification",
      "Refund APIs",
    ],
    mongo: [
      "transactions",
      "payments",
      "refunds",
    ],
    tasks: [
      "Build checkout UI",
      "Integrate payment API",
      "Implement verification",
      "Handle payment history",
    ],
  },
  {
    id: 17,
    title: "Notifications & Support",
    short: "Notifications, communication and user support.",
    frontend: [
      "Notification Center",
      "Notification Bell",
      "Support Dashboard",
      "Chat UI",
      "FAQ",
    ],
    backend: [
      "Notification APIs",
      "Email Notifications",
      "Push Notifications",
      "Support APIs",
    ],
    mongo: [
      "notifications",
      "support_tickets",
      "messages",
    ],
    tasks: [
      "Build notification system",
      "Create support UI",
      "Implement support APIs",
      "Connect notification services",
    ],
  },
  {
    id: 18,
    title: "Analytics & Reporting",
    short: "Dashboards, statistics and system reports.",
    frontend: [
      "Analytics Dashboard",
      "Charts",
      "Statistics Cards",
      "Reports",
      "Filters",
    ],
    backend: [
      "Analytics APIs",
      "Report APIs",
      "Statistics APIs",
      "Data Aggregation",
    ],
    mongo: [
      "analytics_data",
      "reports",
      "statistics",
    ],
    tasks: [
      "Create analytics dashboard",
      "Implement charts",
      "Build report APIs",
      "Add data aggregation",
    ],
  },
  {
    id: 19,
    title: "Super Admin",
    short: "System-wide administration and platform control.",
    frontend: [
      "Admin Dashboard",
      "User Management",
      "Role Management",
      "System Settings",
      "Audit Logs",
    ],
    backend: [
      "Admin APIs",
      "User Management APIs",
      "Role APIs",
      "Audit APIs",
      "System Settings APIs",
    ],
    mongo: [
      "admin_users",
      "roles",
      "permissions",
      "audit_logs",
    ],
    tasks: [
      "Build admin dashboard",
      "Implement user control",
      "Manage roles",
      "Add audit logging",
    ],
  },
  {
    id: 20,
    title: "Shared UI + System Integration",
    short: "Reusable components and integration across the whole platform.",
    frontend: [
      "Shared Components",
      "Navbar",
      "Sidebar",
      "Modals",
      "Forms",
      "Loading States",
      "Error States",
    ],
    backend: [
      "API Integration",
      "Global Error Handling",
      "Common Middleware",
      "System Integration",
    ],
    mongo: [
      "Shared configuration",
      "system settings",
      "integration data",
    ],
    tasks: [
      "Create reusable components",
      "Maintain UI consistency",
      "Integrate modules",
      "Fix cross-module issues",
    ],
  },
];

function OrbParticle({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 150 + (index % 5) * 15;
  const size = 2 + (index % 3);

  return (
    <span
      className="absolute left-1/2 top-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${angle}deg) translateX(${radius}px)`,
        animation: `orbitalSpin ${7 + (index % 5)}s linear infinite`,
        animationDelay: `${index * -0.18}s`,
        opacity: 0.45 + (index % 5) * 0.1,
      }}
    />
  );
}

function StructureBox({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl">{icon}</span>

        <h4 className="font-semibold text-white">{title}</h4>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm leading-6 text-slate-400"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepositoryCard({
  title,
  description,
  items,
  icon,
}: {
  title: string;
  description: string;
  items: string[];
  icon: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04]">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/5 bg-black/20 px-4 py-2.5 font-mono text-xs text-slate-400"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = 600 * window.devicePixelRatio;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = "600px";

      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      );

      particles.length = 0;

      const count = Math.min(
        150,
        Math.floor((window.innerWidth * 600) / 7000)
      );

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * 600,
          size: Math.random() * 1.8 + 0.3,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.7 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, 600);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;

        if (particle.y < 0) particle.y = 600;
        if (particle.y > 600) particle.y = 0;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(103, 232, 249, ${particle.alpha})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const filteredModules = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return modules;

    return modules.filter((module) => {
      return (
        module.title.toLowerCase().includes(value) ||
        module.short.toLowerCase().includes(value) ||
        module.frontend.some((x) =>
          x.toLowerCase().includes(value)
        ) ||
        module.backend.some((x) =>
          x.toLowerCase().includes(value)
        ) ||
        module.mongo.some((x) =>
          x.toLowerCase().includes(value)
        )
      );
    });
  }, [search]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#030712] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #030712;
        }

        ::selection {
          background: rgba(34, 211, 238, 0.25);
          color: white;
        }

        @keyframes orbitalSpin {
          from {
            transform: rotate(0deg) translateX(150px) rotate(0deg);
          }

          to {
            transform: rotate(360deg) translateX(150px) rotate(-360deg);
          }
        }

        @keyframes sphereFloat {
          0%,
          100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }

          50% {
            transform: translateY(-10px) rotateX(4deg) rotateY(6deg);
          }
        }

        @keyframes sphereRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-glow {
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          scrollbar-width: none;
        }
      `}</style>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute bottom-[-300px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute right-[-200px] top-[40%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 font-bold text-cyan-300">
              HB
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Health Bridge
              </p>

              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Gamage Team 407
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a
              href="#modules"
              className="transition hover:text-cyan-300"
            >
              Modules
            </a>

            <a
              href="#structure"
              className="transition hover:text-cyan-300"
            >
              Structure
            </a>

            <a
              href="#support"
              className="transition hover:text-cyan-300"
            >
              Support
            </a>
          </nav>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300">
            Gamage Team 407
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-[620px] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-60"
        />

        {/* Large animated Health Bridge sphere */}
        <div className="pointer-events-none absolute left-1/2 top-[45px] -translate-x-1/2">
          <div className="relative h-[360px] w-[360px] sm:h-[470px] sm:w-[470px]">
            {/* Outer blue glow */}
            <div className="absolute inset-[35px] rounded-full bg-blue-600/20 blur-[75px]" />

            {/* Black outer shell */}
            <div
              className="absolute inset-[42px] rounded-full border border-blue-400/30 bg-black shadow-[0_0_120px_rgba(37,99,235,0.25)]"
              style={{ animation: "sphereFloat 6s ease-in-out infinite" }}
            />

            {/* Main blue sphere */}
            <div
              className="absolute inset-[58px] overflow-hidden rounded-full border border-blue-300/40 bg-gradient-to-br from-white/20 via-blue-600/45 to-black shadow-[inset_-35px_-35px_70px_rgba(0,0,0,0.95),inset_25px_20px_45px_rgba(255,255,255,0.18),0_0_80px_rgba(37,99,235,0.35)]"
              style={{ animation: "sphereFloat 6s ease-in-out infinite" }}
            >
              {/* White highlight */}
              <div className="absolute -left-5 top-8 h-36 w-24 rotate-[25deg] rounded-full bg-white/35 blur-2xl" />

              {/* Blue light streaks */}
              <div className="absolute left-[-20%] top-[30%] h-[18%] w-[140%] rotate-[-18deg] bg-blue-300/20 blur-xl" />
              <div className="absolute left-[-20%] top-[58%] h-[10%] w-[140%] rotate-[18deg] bg-blue-500/30 blur-xl" />

              {/* Inner white particles */}
              <div className="absolute inset-0 opacity-70">
                {Array.from({ length: 35 }).map((_, index) => (
                  <span
                    key={index}
                    className="absolute h-1 w-1 rounded-full bg-white"
                    style={{
                      left: `${8 + ((index * 37) % 84)}%`,
                      top: `${8 + ((index * 53) % 84)}%`,
                      opacity: 0.2 + (index % 5) * 0.14,
                      boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Rotating orbit rings */}
            <div
              className="absolute inset-[28px] rounded-full border border-blue-300/25"
              style={{ animation: "sphereRotate 18s linear infinite" }}
            />

            <div
              className="absolute inset-[18px] rotate-[60deg] rounded-full border border-white/15"
              style={{
                animation: "sphereRotate 24s linear infinite reverse",
              }}
            />

            <div
              className="absolute inset-[5px] rotate-[115deg] rounded-full border border-blue-500/20"
              style={{ animation: "sphereRotate 30s linear infinite" }}
            />

            {/* Orbiting particles */}
            {Array.from({ length: 34 }).map((_, index) => (
              <OrbParticle
                key={index}
                index={index}
                total={34}
              />
            ))}

            {/* Small center glow */}
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.95)]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-5xl flex-col items-center justify-center px-5 pt-20 text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Something meaningful starts here
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
            Health{" "}
            <span className="bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Bridge
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            A connected healthcare platform built by{" "}
            <span className="font-semibold text-cyan-300">
              Gamage Team 407
            </span>
            .
            <br />
            Let&apos;s build something meaningful together.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#modules"
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              Explore Modules
            </a>

            <a
              href="#structure"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              View Structure
            </a>
          </div>

          <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["20", "Developers"],
              ["20", "Modules"],
              ["2", "Main Layers"],
              ["1", "Shared Goal"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur"
              >
                <p className="text-2xl font-black text-white">
                  {number}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section
        id="modules"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Development Structure
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            20 Development{" "}
            <span className="text-cyan-300">Modules</span>
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Each module has its own frontend, backend, MongoDB and
            development responsibilities.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              ⌕
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules, features or responsibilities..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredModules.map((module) => {
            const isOpen = expanded === module.id;

            return (
              <div
                key={module.id}
                className={`group overflow-hidden rounded-3xl border transition-all duration-500 ${
                  isOpen
                    ? "border-cyan-400/30 bg-cyan-400/[0.025] shadow-[0_20px_80px_rgba(34,211,238,0.06)]"
                    : "border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-white/20"
                }`}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-mono text-sm font-bold text-cyan-300">
                      {String(module.id).padStart(2, "0")}
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                      Module
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {module.title}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {module.short}
                  </p>

                  <button
                    onClick={() =>
                      setExpanded(isOpen ? null : module.id)
                    }
                    className={`mt-6 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                      isOpen
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/20 hover:text-cyan-300"
                    }`}
                  >
                    <span>
                      {isOpen ? "Hide Structure" : "View Structure"}
                    </span>

                    <span
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>
                </div>

                {/* Transform / Expanded Content */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/10 p-6">
                      <div className="space-y-4">
                        <StructureBox
                          title="Frontend"
                          icon="◈"
                          items={module.frontend}
                        />

                        <StructureBox
                          title="Backend"
                          icon="◆"
                          items={module.backend}
                        />

                        <StructureBox
                          title="MongoDB"
                          icon="◇"
                          items={module.mongo}
                        />

                        <StructureBox
                          title="Development Tasks"
                          icon="✓"
                          items={module.tasks}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.025] p-12 text-center">
            <div className="text-4xl">⌕</div>

            <h3 className="mt-4 font-bold text-white">
              No modules found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another keyword.
            </p>
          </div>
        )}
      </section>

      {/* Structure */}
      <section
        id="structure"
        className="border-y border-white/10 bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Repository Architecture
            </div>

            <h2 className="text-3xl font-black sm:text-5xl">
              Project{" "}
              <span className="text-cyan-300">Structure</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              A clean separation between frontend, backend and database
              responsibilities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <RepositoryCard
              title="Frontend"
              icon="◈"
              description="Next.js application structure"
              items={[
                "src/",
                "├── app/",
                "├── components/",
                "├── features/",
                "├── hooks/",
                "├── lib/",
                "├── services/",
                "├── types/",
                "├── utils/",
                "└── constants/",
                "public/",
                "middleware.ts",
                "package.json",
                "next.config.ts",
                "tailwind.config.ts",
              ]}
            />

            <RepositoryCard
              title="Backend"
              icon="◆"
              description="Spring Boot API structure"
              items={[
                "src/main/java/",
                "├── config/",
                "├── controller/",
                "├── service/",
                "├── repository/",
                "├── model/",
                "├── dto/",
                "├── security/",
                "├── exception/",
                "└── util/",
                "src/main/resources/",
                "├── application.properties",
                "└── static/",
                "pom.xml",
              ]}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Database
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  MongoDB
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Module-specific collections with shared user,
                  authentication, transaction and system data.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Users",
                  "Patients",
                  "Doctors",
                  "Appointments",
                  "Medical Records",
                  "Payments",
                  "Notifications",
                  "Audit Logs",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-slate-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="support"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.06] via-white/[0.02] to-purple-500/[0.05] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
              ✦
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Gamage Team 407
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Let&apos;s build something meaningful together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              Every module is a part of one connected vision. Work
              together, communicate clearly, keep your branch clean,
              and build Health Bridge as one team.
            </p>

            {/* Team Leadership */}
            <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
              {/* Team Lead */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.03]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Team Lead
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 font-bold text-cyan-300">
                    HF
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      Hiruna Fernando
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Team Leadership
                    </p>
                  </div>
                </div>
              </div>

              {/* Assistant Team Lead */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-blue-400/20 hover:bg-white/[0.03]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Assistant Team Lead
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 font-bold text-blue-300">
                    SR
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      Sahan Ransika Kumara
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Team Coordination
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-black/20 p-6 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                  ?
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Need Support?
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Contact the team leadership when you need help.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Team Lead
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Hiruna Fernando
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Assistant Team Lead
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Sahan Ransika Kumara
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Collaborate",
                "Communicate",
                "Build",
                "Test",
                "Improve",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">
              Health Bridge
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Built with purpose by Gamage Team 407
            </p>
          </div>

          <div className="text-xs text-slate-600">
            Team Lead: Hiruna Fernando · Assistant Team Lead: Sahan
            Ransika Kumara
          </div>
        </div>
      </footer>
    </main>
  );
}