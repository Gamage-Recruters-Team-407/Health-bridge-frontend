"use client";

import { QRCodeSVG } from "qrcode.react"; // ✅ මෙතන වෙනස් කරන්න ඕනේ

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 128 }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <QRCodeSVG // ✅ මෙතනත් <QRCode> වෙනුවට <QRCodeSVG> දෙන්න
          value={value}
          size={size}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      <p className="text-[10px] font-mono text-slate-500 break-all text-center">
        {value}
      </p>
    </div>
  );
}