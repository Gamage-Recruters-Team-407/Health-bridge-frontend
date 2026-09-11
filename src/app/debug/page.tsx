"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getToken, getStoredUser, AuthUser } from "@/lib/auth";

// ✅ Define proper type instead of 'any'
interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<string | null>(null); // ✅ Changed to string
  const [apiError, setApiError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const hasChecked = useRef(false);

  // ✅ Fixed: Use setTimeout to avoid setState in effect
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      
      const t = getToken();
      const u = getStoredUser();
      
      setToken(t);
      
      if (u) {
        setUser({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          role: u.role,
        });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    }, 0);

    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, []);

  const testAPI = async () => {
    const token = getToken();
    if (!token) {
      alert('No token found!');
      return;
    }

    setApiError(null);
    setApiData(null);

    try {
      const response = await fetch('http://localhost:8088/api/hospital-billing/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // ✅ Convert to formatted JSON string
        setApiData(JSON.stringify(data, null, 2));
        console.log('✅ API Response:', data);
      } else {
        setApiError(`Status ${response.status}: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setApiError(`❌ Error: ${errorMessage}`);
      console.error('API Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading debug info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">🔍 Debug - Auth Status</h1>
        
        {/* Token Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Token Status</h2>
          <div className={`p-3 rounded-lg ${token ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={token ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
              {token ? "✅ Token found" : "❌ No token found"}
            </p>
            {token && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 text-sm font-medium">🔍 View Token</summary>
                <code className="block bg-white p-3 mt-2 rounded text-xs break-all border border-slate-200">
                  {token}
                </code>
              </details>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">User Information</h2>
          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-500">ID:</span>
                <span className="font-medium text-slate-900">{user.id}</span>
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-900">{user.fullName}</span>
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900">{user.email}</span>
                <span className="text-slate-500">Role:</span>
                <span className="font-medium text-blue-600">{user.role}</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">❌ No user data found</p>
            </div>
          )}
        </div>

        {/* Local Storage Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Local Storage</h2>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-500">healthbridge_token:</span>
              <span className={token ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {token ? "✅ Present" : "❌ Missing"}
              </span>
              <span className="text-slate-500">healthbridge_user:</span>
              <span className={user ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {user ? "✅ Present" : "❌ Missing"}
              </span>
            </div>
          </div>
        </div>

        {/* API Test */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">API Test</h2>
          <button 
            onClick={testAPI}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
          >
            🚀 Test API
          </button>

          {apiError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          {apiData && (
            <div className="mt-4">
              <p className="text-sm text-green-600 font-medium mb-2">✅ API Response:</p>
              <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {apiData}
              </pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/login" 
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-green-500/20"
          >
            🔑 Go to Login
          </Link>
          <Link 
            href="/admin/dashboard" 
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-purple-500/20"
          >
            📊 Go to Dashboard
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-red-500/20"
          >
            🗑️ Clear Storage
          </button>
          <button
            onClick={() => {
              const token = getToken();
              const user = getStoredUser();
              alert(`Token: ${token ? '✅ Found' : '❌ Not found'}\nUser: ${user ? `✅ ${user.fullName}` : '❌ Not found'}`);
            }}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-amber-500/20"
          >
            🔍 Check Auth
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 text-sm mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
            <li>If token is missing, <Link href="/login" className="font-bold underline">login</Link> again</li>
            <li>If token is present but dashboard not loading, clear storage and login again</li>
            <li>Check if backend is running on <strong>http://localhost:8088</strong></li>
            <li>API test will show you the response from the backend</li>
          </ul>
        </div>
      </div>
    </div>
  );
}