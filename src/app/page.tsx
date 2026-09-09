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
    } else {
      // Redirect to login if not authenticated
      router.replace("/login");
    }
  }, [router]);

  // Show loading while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading...</p>
      </div>
    </div>
  );
}