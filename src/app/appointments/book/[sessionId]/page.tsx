import SessionBookingClient from "./_components/SessionBookingClient";

type SessionBookingPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionBookingPage({
  params,
}: SessionBookingPageProps) {
  const { sessionId } = await params;

  return <SessionBookingClient sessionId={sessionId} />;
}
