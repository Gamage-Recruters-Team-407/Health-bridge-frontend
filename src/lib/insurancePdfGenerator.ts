import { InsuranceClaim, InsurancePolicy, InsuranceReportSummary } from "@/types/insurance";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): ColorRGB {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (clean.length === 6) {
    return {
      r: Number(((num >> 16) & 255) / 255),
      g: Number(((num >> 8) & 255) / 255),
      b: Number((num & 255) / 255),
    };
  }
  return { r: 0, g: 0, b: 0 };
}

function escapePdf(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\u0080-\uFFFF]/g, ""); // strip non-ASCII characters for standard Type 1 Helvetica font
}

class SimplePdfDocument {
  private pages: string[][] = [];
  private currentPageIndex = -1;
  public readonly width = 595.28; // A4 width in pt
  public readonly height = 841.89; // A4 height in pt

  constructor() {
    this.addPage();
  }

  addPage(): void {
    this.pages.push([]);
    this.currentPageIndex = this.pages.length - 1;
  }

  getPageCount(): number {
    return this.pages.length;
  }

  private emit(command: string, pageIndex?: number): void {
    const idx = pageIndex !== undefined ? pageIndex : this.currentPageIndex;
    if (idx >= 0 && idx < this.pages.length) {
      this.pages[idx].push(command);
    }
  }

  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options: {
      fillColor?: string;
      strokeColor?: string;
      lineWidth?: number;
      pageIndex?: number;
    } = {}
  ): void {
    const cmds: string[] = ["q"];
    if (options.lineWidth) {
      cmds.push(`${options.lineWidth.toFixed(2)} w`);
    }
    if (options.strokeColor) {
      const { r, g, b } = hexToRgb(options.strokeColor);
      cmds.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    }
    if (options.fillColor) {
      const { r, g, b } = hexToRgb(options.fillColor);
      cmds.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    }

    cmds.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);

    if (options.fillColor && options.strokeColor) {
      cmds.push("B");
    } else if (options.fillColor) {
      cmds.push("f");
    } else if (options.strokeColor) {
      cmds.push("S");
    }
    cmds.push("Q");
    this.emit(cmds.join("\n"), options.pageIndex);
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: { color?: string; lineWidth?: number; pageIndex?: number } = {}
  ): void {
    const cmds: string[] = ["q"];
    const width = options.lineWidth || 1;
    cmds.push(`${width.toFixed(2)} w`);
    const { r, g, b } = hexToRgb(options.color || "#CBD5E1");
    cmds.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    cmds.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m`);
    cmds.push(`${x2.toFixed(2)} ${y2.toFixed(2)} l`);
    cmds.push("S");
    cmds.push("Q");
    this.emit(cmds.join("\n"), options.pageIndex);
  }

  drawText(
    text: string,
    x: number,
    y: number,
    options: {
      font?: "regular" | "bold";
      size?: number;
      color?: string;
      align?: "left" | "right" | "center";
      maxWidth?: number;
      pageIndex?: number;
    } = {}
  ): void {
    if (!text && text !== "0") return;

    let str = String(text);
    const size = options.size || 10;
    const fontId = options.font === "bold" ? "/F2" : "/F1";
    const approxCharWidth = size * 0.52;

    if (options.maxWidth && str.length * approxCharWidth > options.maxWidth) {
      const maxChars = Math.max(3, Math.floor(options.maxWidth / approxCharWidth) - 3);
      str = str.substring(0, maxChars) + "...";
    }

    let startX = x;
    const estimatedWidth = str.length * approxCharWidth;
    if (options.align === "right") {
      startX = x - estimatedWidth;
    } else if (options.align === "center") {
      startX = x - estimatedWidth / 2;
    }

    const { r, g, b } = hexToRgb(options.color || "#0F172A");
    const safeText = escapePdf(str);

    const cmds = [
      "q",
      "BT",
      `${fontId} ${size.toFixed(2)} Tf`,
      `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`,
      `1 0 0 1 ${startX.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${safeText}) Tj`,
      "ET",
      "Q",
    ];

    this.emit(cmds.join("\n"), options.pageIndex);
  }

  buildBlob(): Blob {
    const pageCount = this.pages.length;

    // Apply Page X of Y footers to every page
    for (let i = 0; i < pageCount; i++) {
      this.drawLine(40, 42, 555, 42, { color: "#E2E8F0", lineWidth: 0.75, pageIndex: i });
      this.drawText(
        "HealthBridge Hospital Management System · Confidential Insurance Document",
        40,
        28,
        { font: "regular", size: 8, color: "#94A3B8", pageIndex: i }
      );
      this.drawText(`Page ${i + 1} of ${pageCount}`, 555, 28, {
        font: "bold",
        size: 8,
        color: "#64748B",
        align: "right",
        pageIndex: i,
      });
    }

    // PDF Object tree construction
    const objects: string[] = [];
    const fontF1ObjNum = 4;
    const fontF2ObjNum = 5;

    // 1: Catalog
    objects.push("<< /Type /Catalog /Pages 2 0 R >>");

    // 2: Pages root
    const pageObjNums: number[] = [];
    for (let i = 0; i < pageCount; i++) {
      pageObjNums.push(6 + i * 2);
    }
    const kidsStr = pageObjNums.map((n) => `${n} 0 R`).join(" ");
    objects.push(`<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>`);

    // 3: Info object
    objects.push(
      `<< /Producer (HealthBridge Insurance PDF Engine) /CreationDate (D:${new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 14)}Z) >>`
    );

    // 4: Regular Font (Helvetica)
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");

    // 5: Bold Font (Helvetica-Bold)
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

    // For each page: Page object + Content stream object
    for (let i = 0; i < pageCount; i++) {
      const pageNum = 6 + i * 2;
      const contentNum = pageNum + 1;

      // Page Object
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.width} ${this.height}] /Resources << /Font << /F1 ${fontF1ObjNum} 0 R /F2 ${fontF2ObjNum} 0 R >> >> /Contents ${contentNum} 0 R >>`
      );

      // Content Stream Object
      const streamContent = this.pages[i].join("\n");
      const streamLen = streamContent.length;
      objects.push(`<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`);
    }

    // Assemble PDF binary output with cross-reference table (xref)
    let pdfStr = "%PDF-1.4\n";
    const offsets: number[] = [0];

    for (let i = 0; i < objects.length; i++) {
      offsets.push(pdfStr.length);
      pdfStr += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefOffset = pdfStr.length;
    pdfStr += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      pdfStr += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }

    pdfStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([pdfStr], { type: "application/pdf" });
  }
}

// ----------------------------------------------------------------------------
// 1. Insurance Officer Reports & Analytics PDF Generator
// ----------------------------------------------------------------------------
export function generateInsuranceOfficerReportPdf(
  report: InsuranceReportSummary,
  periodLabel: string = "All Time"
): Blob {
  const doc = new SimplePdfDocument();
  let y = 800;

  // Header Brand Banner
  doc.drawRect(40, y - 48, 515, 54, { fillColor: "#0A2540", strokeColor: "#0A2540" });
  doc.drawText("HEALTHBRIDGE HOSPITAL MANAGEMENT SYSTEM", 55, y - 18, {
    font: "bold",
    size: 13,
    color: "#FFFFFF",
  });
  doc.drawText("INSURANCE OPERATIONS, CLAIMS & PAYOUT AUDIT REPORT", 55, y - 34, {
    font: "regular",
    size: 9,
    color: "#93C5FD",
  });
  y -= 62;

  // Metadata Sub-bar
  doc.drawRect(40, y - 20, 515, 22, { fillColor: "#F8FAFC", strokeColor: "#E2E8F0" });
  doc.drawText(`Report Filter Period: ${periodLabel}`, 50, y - 14, {
    font: "bold",
    size: 8.5,
    color: "#334155",
  });
  doc.drawText(`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, 545, y - 14, {
    font: "regular",
    size: 8.5,
    color: "#64748B",
    align: "right",
  });
  y -= 34;

  // 4 Primary KPI Summary Cards
  const cardW = 122;
  const cardH = 46;
  const gap = 9;

  // Card 1: Total Claims Volume
  doc.drawRect(40, y - cardH, cardW, cardH, { fillColor: "#EFF6FF", strokeColor: "#BFDBFE" });
  doc.drawText("TOTAL CLAIMS", 48, y - 14, { font: "bold", size: 7.5, color: "#1E40AF" });
  doc.drawText(report.totalClaims.toLocaleString(), 48, y - 28, { font: "bold", size: 12, color: "#1E3A8A" });
  doc.drawText(`Rs. ${report.totalClaimAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`, 48, y - 40, {
    font: "regular",
    size: 7,
    color: "#3B82F6",
    maxWidth: 110,
  });

  // Card 2: Approved Payouts
  const c2x = 40 + cardW + gap;
  doc.drawRect(c2x, y - cardH, cardW, cardH, { fillColor: "#ECFDF5", strokeColor: "#A7F3D0" });
  doc.drawText("APPROVED PAYOUT", c2x + 8, y - 14, { font: "bold", size: 7.5, color: "#065F46" });
  doc.drawText(`Rs. ${(report.totalApprovedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, c2x + 8, y - 28, {
    font: "bold",
    size: 9.5,
    color: "#047857",
    maxWidth: 110,
  });
  doc.drawText(`Approval Rate: ${report.approvalRate?.toFixed(1) || 0}%`, c2x + 8, y - 40, { font: "regular", size: 7, color: "#10B981" });

  // Card 3: Pending In-Review
  const c3x = c2x + cardW + gap;
  doc.drawRect(c3x, y - cardH, cardW, cardH, { fillColor: "#FFFBEB", strokeColor: "#FDE68A" });
  doc.drawText("PENDING REVIEW", c3x + 8, y - 14, { font: "bold", size: 7.5, color: "#92400E" });
  doc.drawText(`${report.pendingClaims} claims`, c3x + 8, y - 28, { font: "bold", size: 11, color: "#B45309" });
  doc.drawText(`Value: Rs. ${(report.totalPendingAmount || 0).toLocaleString()}`, c3x + 8, y - 40, { font: "regular", size: 7, color: "#D97706", maxWidth: 110 });

  // Card 4: Coverage Utilization
  const c4x = c3x + cardW + gap;
  doc.drawRect(c4x, y - cardH, cardW, cardH, { fillColor: "#FAF5FF", strokeColor: "#E9D5FF" });
  doc.drawText("POOL UTILIZATION", c4x + 8, y - 14, { font: "bold", size: 7.5, color: "#6B21A8" });
  doc.drawText(`${report.policyUtilizationRate?.toFixed(1) || 0}%`, c4x + 8, y - 28, { font: "bold", size: 12, color: "#7E22CE" });
  doc.drawText(`Active: ${report.activePolicies} contracts`, c4x + 8, y - 40, { font: "regular", size: 7, color: "#A855F7" });

  y -= cardH + 18;

  // Claims Detailed Performance Table Header
  const renderTableHeader = (currentY: number) => {
    doc.drawText("CLAIMS PERFORMANCE AUDIT LOG", 40, currentY, { font: "bold", size: 10, color: "#0A2540" });
    currentY -= 14;
    doc.drawRect(40, currentY - 18, 515, 20, { fillColor: "#1E293B", strokeColor: "#1E293B" });
    doc.drawText("CLAIM #", 48, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("PATIENT", 145, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("TREATMENT / SERVICE", 220, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("CLAIMED (Rs.)", 400, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "right" });
    doc.drawText("SETTLED (Rs.)", 475, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "right" });
    doc.drawText("STATUS", 530, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "center" });
    return currentY - 20;
  };

  y = renderTableHeader(y);

  const claims = report.claims || [];
  if (claims.length === 0) {
    doc.drawRect(40, y - 30, 515, 30, { fillColor: "#F8FAFC", strokeColor: "#E2E8F0" });
    doc.drawText("No claim records found in the selected reporting period.", 297, y - 18, {
      font: "regular",
      size: 9,
      color: "#64748B",
      align: "center",
    });
    y -= 36;
  } else {
    for (let i = 0; i < claims.length; i++) {
      const c = claims[i];
      // Check page overflow
      if (y < 70) {
        doc.addPage();
        y = 790;
        y = renderTableHeader(y);
      }

      const rowBg = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      doc.drawRect(40, y - 18, 515, 19, { fillColor: rowBg, strokeColor: "#E2E8F0", lineWidth: 0.5 });

      // Claim Number
      doc.drawText(c.claimNumber, 48, y - 13, { font: "bold", size: 7.5, color: "#2563EB", maxWidth: 90 });
      // Patient ID
      doc.drawText(c.patientId, 145, y - 13, { font: "regular", size: 7.5, color: "#334155", maxWidth: 70 });
      // Treatment Description
      doc.drawText(c.treatmentDescription || "General Treatment", 220, y - 13, {
        font: "regular",
        size: 7.5,
        color: "#475569",
        maxWidth: 140,
      });
      // Claim Amount
      doc.drawText((c.claimAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), 400, y - 13, {
        font: "bold",
        size: 7.5,
        color: "#0F172A",
        align: "right",
      });
      // Approved Settlement
      doc.drawText(
        c.approvedAmount != null ? Number(c.approvedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—",
        475,
        y - 13,
        {
          font: "bold",
          size: 7.5,
          color: c.approvedAmount != null ? "#059669" : "#94A3B8",
          align: "right",
        }
      );
      // Status
      let statusColor = "#3B82F6";
      if (c.status === "APPROVED" || c.status === "PAID") statusColor = "#10B981";
      else if (c.status === "REJECTED") statusColor = "#EF4444";
      else if (c.status === "UNDER_REVIEW") statusColor = "#F59E0B";

      doc.drawText(c.status, 530, y - 13, { font: "bold", size: 7, color: statusColor, align: "center" });

      y -= 19;
    }
  }

  // Provider Summary Section if space permits or on next page
  if (report.providerSummaries && report.providerSummaries.length > 0) {
    if (y < 160) {
      doc.addPage();
      y = 790;
    } else {
      y -= 12;
    }

    doc.drawText("INSURANCE PROVIDER UNDERWRITING SUMMARY", 40, y, { font: "bold", size: 9.5, color: "#0A2540" });
    y -= 14;

    doc.drawRect(40, y - 18, 515, 20, { fillColor: "#334155", strokeColor: "#334155" });
    doc.drawText("PROVIDER", 48, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF" });
    doc.drawText("POLICIES", 220, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF", align: "center" });
    doc.drawText("CLAIMS", 290, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF", align: "center" });
    doc.drawText("TOTAL COVERAGE (Rs.)", 400, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF", align: "right" });
    doc.drawText("TOTAL SETTLED (Rs.)", 500, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF", align: "right" });
    doc.drawText("UTIL.", 540, y - 13, { font: "bold", size: 7.5, color: "#FFFFFF", align: "right" });
    y -= 20;

    report.providerSummaries.forEach((p, idx) => {
      if (y < 65) {
        doc.addPage();
        y = 790;
      }
      const util = p.totalCoverage > 0 ? ((p.totalApproved / p.totalCoverage) * 100).toFixed(1) : "0.0";
      const bg = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      doc.drawRect(40, y - 17, 515, 18, { fillColor: bg, strokeColor: "#E2E8F0", lineWidth: 0.5 });
      doc.drawText(p.providerName, 48, y - 12, { font: "bold", size: 7.5, color: "#1E293B", maxWidth: 160 });
      doc.drawText(p.policyCount.toString(), 220, y - 12, { font: "regular", size: 7.5, color: "#475569", align: "center" });
      doc.drawText(p.claimCount.toString(), 290, y - 12, { font: "bold", size: 7.5, color: "#2563EB", align: "center" });
      doc.drawText((p.totalCoverage || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), 400, y - 12, {
        font: "regular",
        size: 7.5,
        color: "#334155",
        align: "right",
      });
      doc.drawText((p.totalApproved || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), 500, y - 12, {
        font: "bold",
        size: 7.5,
        color: "#059669",
        align: "right",
      });
      doc.drawText(`${util}%`, 540, y - 12, { font: "bold", size: 7.5, color: "#0F172A", align: "right" });
      y -= 18;
    });
  }

  return doc.buildBlob();
}

// ----------------------------------------------------------------------------
// 2. Patient Insurance Statement & Claims PDF Generator
// ----------------------------------------------------------------------------
export function generatePatientStatementPdf(
  activePolicy: InsurancePolicy | null,
  claims: InsuranceClaim[],
  metrics: {
    totalFiled: number;
    approvedCount: number;
    pendingCount: number;
    totalReimbursed: number;
  }
): Blob {
  const doc = new SimplePdfDocument();
  let y = 800;

  // Header Brand Banner
  doc.drawRect(40, y - 48, 515, 54, { fillColor: "#1E3A8A", strokeColor: "#1E3A8A" });
  doc.drawText("HEALTHBRIDGE HEALTHCARE", 55, y - 18, {
    font: "bold",
    size: 13,
    color: "#FFFFFF",
  });
  doc.drawText("PATIENT HEALTH INSURANCE & CLAIMS STATEMENT", 55, y - 34, {
    font: "regular",
    size: 9,
    color: "#BFDBFE",
  });
  y -= 62;

  // Statement Meta Bar
  doc.drawRect(40, y - 20, 515, 22, { fillColor: "#F8FAFC", strokeColor: "#E2E8F0" });
  doc.drawText(
    `Patient ID: ${activePolicy?.patientId || "Registered Patient Account"}`,
    50,
    y - 14,
    { font: "bold", size: 8.5, color: "#1E293B" }
  );
  doc.drawText(
    `Statement Issued: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
    545,
    y - 14,
    { font: "regular", size: 8.5, color: "#64748B", align: "right" }
  );
  y -= 34;

  // Active Policy Specifications Card
  doc.drawRect(40, y - 82, 515, 82, { fillColor: "#FFFFFF", strokeColor: "#CBD5E1", lineWidth: 1 });
  doc.drawRect(40, y - 20, 515, 20, { fillColor: "#F1F5F9", strokeColor: "#CBD5E1", lineWidth: 0.5 });
  doc.drawText("ACTIVE INSURANCE CONTRACT SPECIFICATIONS", 50, y - 14, { font: "bold", size: 8.5, color: "#0A2540" });

  const remainingCoverage = Math.max(0, (activePolicy?.coverageAmount || 0) - (activePolicy?.coverageUsed || 0));

  // Policy Grid
  doc.drawText("Policy Number:", 50, y - 36, { font: "regular", size: 8, color: "#64748B" });
  doc.drawText(activePolicy?.policyNumber || "No Active Policy Contract", 125, y - 36, { font: "bold", size: 8, color: "#2563EB" });

  doc.drawText("Insurance Carrier:", 310, y - 36, { font: "regular", size: 8, color: "#64748B" });
  doc.drawText(activePolicy?.providerName || "Standard Healthcare Plan", 400, y - 36, { font: "bold", size: 8, color: "#1E293B" });

  doc.drawText("Plan Type:", 50, y - 52, { font: "regular", size: 8, color: "#64748B" });
  doc.drawText(activePolicy?.policyType || "Comprehensive Medical", 125, y - 52, { font: "bold", size: 8, color: "#1E293B" });

  doc.drawText("Coverage Validity:", 310, y - 52, { font: "regular", size: 8, color: "#64748B" });
  doc.drawText(
    activePolicy?.endDate
      ? `Valid through ${new Date(activePolicy.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
      : "Active Coverage",
    400,
    y - 52,
    { font: "bold", size: 8, color: "#059669" }
  );

  // Coverage Figures Row
  doc.drawLine(50, y - 62, 545, y - 62, { color: "#F1F5F9" });
  doc.drawText(
    `Total Limit: Rs. ${(activePolicy?.coverageAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    50,
    y - 74,
    { font: "bold", size: 8, color: "#0F172A" }
  );
  doc.drawText(
    `Coverage Used: Rs. ${(activePolicy?.coverageUsed || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    240,
    y - 74,
    { font: "bold", size: 8, color: "#D97706" }
  );
  doc.drawText(
    `Remaining Balance: Rs. ${remainingCoverage.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    420,
    y - 74,
    { font: "bold", size: 8, color: "#2563EB" }
  );

  y -= 96;

  // 3 Mini Patient Metric Cards
  const mCardW = 165;
  const mCardH = 40;
  const mGap = 10;

  // Metric 1
  doc.drawRect(40, y - mCardH, mCardW, mCardH, { fillColor: "#F8FAFC", strokeColor: "#E2E8F0" });
  doc.drawText("CLAIMS SUBMITTED", 48, y - 14, { font: "bold", size: 7.5, color: "#64748B" });
  doc.drawText(`${metrics.totalFiled} Claims Filed`, 48, y - 28, { font: "bold", size: 11, color: "#1E293B" });

  // Metric 2
  const m2x = 40 + mCardW + mGap;
  doc.drawRect(m2x, y - mCardH, mCardW, mCardH, { fillColor: "#ECFDF5", strokeColor: "#A7F3D0" });
  doc.drawText("CLAIMS APPROVED", m2x + 8, y - 14, { font: "bold", size: 7.5, color: "#065F46" });
  doc.drawText(`${metrics.approvedCount} Settled`, m2x + 8, y - 28, { font: "bold", size: 11, color: "#047857" });

  // Metric 3
  const m3x = m2x + mCardW + mGap;
  doc.drawRect(m3x, y - mCardH, mCardW, mCardH, { fillColor: "#EFF6FF", strokeColor: "#BFDBFE" });
  doc.drawText("TOTAL REIMBURSED", m3x + 8, y - 14, { font: "bold", size: 7.5, color: "#1E40AF" });
  doc.drawText(`Rs. ${metrics.totalReimbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, m3x + 8, y - 28, {
    font: "bold",
    size: 10,
    color: "#1E3A8A",
  });

  y -= mCardH + 18;

  // Claims Table Header
  const renderPatientTableHeader = (currentY: number) => {
    doc.drawText("PATIENT CLAIMS HISTORY LOG", 40, currentY, { font: "bold", size: 10, color: "#0A2540" });
    currentY -= 14;
    doc.drawRect(40, currentY - 18, 515, 20, { fillColor: "#0F172A", strokeColor: "#0F172A" });
    doc.drawText("CLAIM #", 48, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("DATE", 145, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("SERVICE / TREATMENT DESCRIPTION", 215, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF" });
    doc.drawText("CLAIMED (Rs.)", 400, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "right" });
    doc.drawText("SETTLED (Rs.)", 475, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "right" });
    doc.drawText("STATUS", 530, currentY - 13, { font: "bold", size: 8, color: "#FFFFFF", align: "center" });
    return currentY - 20;
  };

  y = renderPatientTableHeader(y);

  if (claims.length === 0) {
    doc.drawRect(40, y - 30, 515, 30, { fillColor: "#F8FAFC", strokeColor: "#E2E8F0" });
    doc.drawText("You have no insurance claims submitted under this account.", 297, y - 18, {
      font: "regular",
      size: 9,
      color: "#64748B",
      align: "center",
    });
  } else {
    for (let i = 0; i < claims.length; i++) {
      const c = claims[i];
      if (y < 70) {
        doc.addPage();
        y = 790;
        y = renderPatientTableHeader(y);
      }

      const rowBg = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      doc.drawRect(40, y - 18, 515, 19, { fillColor: rowBg, strokeColor: "#E2E8F0", lineWidth: 0.5 });

      // Claim #
      doc.drawText(c.claimNumber, 48, y - 13, { font: "bold", size: 7.5, color: "#2563EB", maxWidth: 90 });
      // Date
      const dateStr = c.submittedAt ? new Date(c.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
      doc.drawText(dateStr, 145, y - 13, { font: "regular", size: 7.5, color: "#475569" });
      // Treatment Description
      doc.drawText(c.treatmentDescription || "Medical Service", 215, y - 13, {
        font: "regular",
        size: 7.5,
        color: "#1E293B",
        maxWidth: 140,
      });
      // Claim Amount
      doc.drawText((c.claimAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), 400, y - 13, {
        font: "bold",
        size: 7.5,
        color: "#0F172A",
        align: "right",
      });
      // Approved Amount
      doc.drawText(
        c.approvedAmount != null ? Number(c.approvedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—",
        475,
        y - 13,
        {
          font: "bold",
          size: 7.5,
          color: c.approvedAmount != null ? "#059669" : "#94A3B8",
          align: "right",
        }
      );
      // Status
      let statusColor = "#3B82F6";
      if (c.status === "APPROVED" || c.status === "PAID") statusColor = "#10B981";
      else if (c.status === "REJECTED") statusColor = "#EF4444";
      else if (c.status === "UNDER_REVIEW") statusColor = "#F59E0B";

      doc.drawText(c.status, 530, y - 13, { font: "bold", size: 7, color: statusColor, align: "center" });

      y -= 19;
    }
  }

  return doc.buildBlob();
}
