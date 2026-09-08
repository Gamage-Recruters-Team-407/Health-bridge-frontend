// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "HealthBridge - Smart Healthcare Platform",
//   description: "Smart Healthcare. Stronger Connections.",
// };

// import ToastProvider from "@/components/ui/Toast";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
//         <ToastProvider>
//           {children}
//         </ToastProvider>
//         <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { HospitalProvider } from '@/context/HospitalContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Health Bridge - Hospital Management',
  description: 'Healthcare Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HospitalProvider>
          {children}
        </HospitalProvider>
      </body>
    </html>
  );
}