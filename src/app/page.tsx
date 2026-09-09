"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelcomePage } from "@/components/ui/WelcomePage";
import { getStoredUser, getToken, getRoleRedirectPath } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
      router.replace(getRoleRedirectPath(user.role));
    }
  }, [router]);

  return (
    <WelcomePage
      onBookAppointment={() => router.push("/appointments/search-doctor")}
      onContinueGuest={() => router.push("/login")}
    />
  );
}
