'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function HospitalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      pageTitle="Hospital Admin"
      userRole="Hospital Admin"
      userName="Admin User"
    >
      {children}
    </DashboardLayout>
  );
}
