"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import HeaderLogo from "@/components/HeaderLogo";
import HealthcareIllustration from "@/components/HealthcareIllustration";
import { authService } from "@/services/auth.service";
import { saveAuthData, getRoleRedirectPath } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login({
        email: email.trim(),
        password: password.trim(),
      });

      saveAuthData(data.token, {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });

      // Role-based redirect
      const targetPath = getRoleRedirectPath(data.role);
      router.push(targetPath);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      // Placeholder Google OAuth sign-in flow
      // Every Google signed-in user is defaulted to PATIENT as requested
      const mockGoogleToken = "google-oauth-token-" + Date.now();
      const mockEmail = email.trim() || "patient.google@healthbridge.lk";
      const mockName = "Google Patient";

      const data = await authService.googleAuth(mockGoogleToken, mockEmail, mockName);

      saveAuthData(data.token, {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });

      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <HeaderLogo />
        <Link
          href="/register"
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-500/20"
        >
          Register
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl rounded-3xl border-2 border-blue-400/80 bg-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-blue-500/5 relative overflow-hidden">
          {/* Subtle Grid Accent Top Left */}
          <div className="absolute top-4 left-4 w-20 h-20 opacity-20 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:8px_8px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Smart Healthcare. <br />
                  Stronger{" "}
                  <span className="text-cyan-500">Connections.</span>
                </h1>

                <p className="mt-5 text-slate-500 text-base sm:text-lg max-w-md leading-relaxed">
                  Health Bridge connects patient, and <br />
                  Data Seamlessly for better care and outcomes.
                </p>

                <div className="w-16 h-1 bg-cyan-500 rounded-full mt-4" />
              </div>

              {/* Graphic Illustration */}
              <div className="pt-2">
                <HealthcareIllustration />
              </div>
            </div>

            {/* Right Login Card Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Sign in to access your healthcare dashboard
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm text-slate-800 placeholder-slate-400 transition"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-sm text-slate-800 placeholder-slate-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end pt-1">
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Log in Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center text-xs text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-blue-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>

                {/* Or continue with */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[11px] text-slate-400">
                    <span className="bg-white px-3">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    title="Sign in with Google"
                    className="w-14 h-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center transition active:scale-95 disabled:opacity-70"
                  >
                    {googleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
