"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { useAuth } from "@/hooks/useAuth";
import { User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { USER_ROLES } from "@/config/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // If user is already logged in, redirect appropriately
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.FARM_MANAGER) {
        router.push("/admin");
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/orders";
        router.push(redirectUrl);
      }
    }
  }, [user, isLoading, router]);

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const loggedUser = await login(identifier, password);
      // Route based on role
      if (
        loggedUser.role === USER_ROLES.ADMIN ||
        loggedUser.role === USER_ROLES.FARM_MANAGER
      ) {
        router.push("/admin");
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/orders";
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await register(regName, regEmail, regPassword, regPhone);
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/orders";
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
              {isRegisterMode ? "Create Customer Account" : "Sign In to Yarkha Farm"}
            </h1>
            <p className="text-xs text-[#78716C] mt-1">
              Manage harvest subscriptions, track deliveries, or access admin management.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl">
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs border border-red-200 mb-6">
                {errorMsg}
              </div>
            )}

            {!isRegisterMode ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Email or Admin Username
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <User className="w-4 h-4 text-[#B45309]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. jigmat or admin@onela.in"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Password
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <Lock className="w-4 h-4 text-[#B45309]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6 shadow-md"
                >
                  <span>{loading ? "Verifying..." : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 94191 00000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6 shadow-md"
                >
                  <span>{loading ? "Creating..." : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="border-t border-stone-100 pt-6 mt-6 text-center text-xs text-stone-500">
              {isRegisterMode ? (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    className="text-[#B45309] font-bold hover:underline"
                  >
                    Sign In here
                  </button>
                </p>
              ) : (
                <p>
                  New customer?{" "}
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    className="text-[#B45309] font-bold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
