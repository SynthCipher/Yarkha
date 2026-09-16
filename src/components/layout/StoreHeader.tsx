"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
} from "lucide-react";
import { APP_CONFIG, USER_ROLES } from "@/config/constants";

export default function StoreHeader() {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navCategories = [
    { label: "Vegetables", href: "/vegetables" },
    { label: "Flowers & Garden", href: "/flowers" },
    { label: "Saplings", href: "/saplings" },
    { label: "Pantry Goods", href: "/value-added" },
    { label: "Pashmina", href: "/pashmina" },
    { label: "Farmstay", href: "/farmstay" },
    { label: "Farm Story", href: "/farm-story" },
    { label: "Heritage", href: "/pashmina-heritage" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E0D3]">
      {/* Top Ticker / Delivery Notice */}
      <div className="bg-[#1C1917] text-stone-300 py-1.5 px-4 text-[11px] font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium">Stakna Farmhouse (3,250m):</span>
            <span className="hidden sm:inline text-stone-300">
              2-Acre Regenerative Plot in Early Development · Next-day harvest delivery to Leh & Indus Valley.
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Stakna Village, Ladakh</span>
            </span>
            <a
              href={`tel:${APP_CONFIG.contact.phone}`}
              className="hover:text-white transition-colors"
            >
              {APP_CONFIG.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex flex-col group shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-serif font-bold tracking-[0.2em] text-[#1C1917] group-hover:text-[#B45309] transition-colors">
              STAKNA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
            <span className="text-xs uppercase font-sans font-semibold tracking-widest text-[#B45309] bg-amber-100/70 px-2 py-0.5 rounded-md">
              FARMHOUSE
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#78716C] font-medium">
            2-Acre Organic Farm & Living · Ladakh
          </span>
        </Link>

        {/* Desktop Category Navigation */}
        <nav className="hidden xl:flex items-center gap-5 text-xs uppercase tracking-wider font-semibold text-[#44403C]">
          {navCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="hover:text-[#B45309] py-1 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#B45309] hover:after:w-full after:transition-all"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* User Profile / Admin Link */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] bg-white border border-stone-200 px-3 py-2 rounded-full hover:border-[#B45309] transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-[#B45309]" />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in duration-200">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-[#1C1917] truncate">{user.name}</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                      Role: {user.role}
                    </p>
                  </div>

                  {(user.role === USER_ROLES.ADMIN ||
                    user.role === USER_ROLES.FARM_MANAGER) && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[#B45309] font-medium hover:bg-amber-50 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Portal</span>
                    </Link>
                  )}

                  <Link
                    href="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#44403C] hover:bg-stone-50 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors border-t border-stone-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#44403C] hover:text-[#B45309] px-2.5 py-1.5 rounded-full transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            aria-label="Open harvest basket"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Basket</span>
            <span className="bg-white text-[#B45309] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1C1917] hover:bg-stone-200/60 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-stone-200 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-[#1C1917]">
            {navCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 border-b border-stone-200/80 hover:text-[#B45309] transition-colors"
              >
                {cat.label}
              </Link>
            ))}

            <Link
              href="/orders"
              onClick={() => setMobileNavOpen(false)}
              className="py-2.5 border-b border-stone-200/80 hover:text-[#B45309] transition-colors flex items-center gap-2 text-[#B45309]"
            >
              <Package className="w-4 h-4" />
              <span>Track My Orders</span>
            </Link>

            {user ? (
              <div className="pt-2 flex flex-col gap-2">
                {(user.role === USER_ROLES.ADMIN ||
                  user.role === USER_ROLES.FARM_MANAGER) && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 text-[#B45309] flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Portal</span>
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileNavOpen(false);
                    await logout();
                  }}
                  className="py-2 text-red-600 flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.name})</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="py-2 text-[#B45309] flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
