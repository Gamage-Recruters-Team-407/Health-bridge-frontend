import AppointmentDetailsClient from "./_components/AppointmentDetailsClient";

type AppointmentDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string | string[] }>;
};

export default async function AppointmentDetailsPage({
  params,
  searchParams,
}: AppointmentDetailsPageProps) {
  const { id } = await params;
  const { confirmed } = await searchParams;

  return (
    <AppointmentDetailsClient
      appointmentId={id}
      isConfirmed={confirmed === "1"}
    />
  );
}
