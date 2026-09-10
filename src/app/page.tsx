"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelcomePage } from "@/components/ui/WelcomePage";
import { getRoleRedirectPath, getStoredUser, getToken } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
      router.replace(getRoleRedirectPath(user.role));
    }
  }, [router]);

  return <WelcomePage />;
}