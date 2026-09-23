import MedicalRecordsShell from "@/components/medical-records/MedicalRecordsShell";

export default function PrescriptionsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <MedicalRecordsShell pageTitle="Prescriptions">
      {children}
    </MedicalRecordsShell>
  );
}