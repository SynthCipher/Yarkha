"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO } from "@/types";

interface AuthContextType {
  user: UserDTO | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<UserDTO>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<UserDTO>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, pass: string): Promise<UserDTO> => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password: pass }),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Login failed");
    }
    setUser(json.data.user);
    return json.data.user;
  };

  const register = async (name: string, email: string, pass: string, phone?: string): Promise<UserDTO> => {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone }),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Registration failed");
    }
    setUser(json.data.user);
    return json.data.user;
  };

  const logout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
