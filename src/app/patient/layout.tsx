import DashboardLayout from "@/app/dashboard/layout";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout pageTitle="Patient Workspace">
      {children}
    </DashboardLayout>
  );
}
