"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomePage } from "@/components/ui/WelcomePage";
import { getStoredUser, getToken, getRoleRedirectPath } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
      router.replace(getRoleRedirectPath(user.role));
    }

    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <WelcomePage
      onBookAppointment={() => router.push("/appointments/search-doctor")}
      onContinueGuest={() => router.push("/login")}
    />
  );
}