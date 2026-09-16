import React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/config/constants";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Flower,
  Sprout,
  Coins,
  MapPin,
  Clock,
  ArrowLeft,
  Users,
  CheckSquare,
  Wrench,
  Layers,
  FileText,
  DollarSign,
  ClipboardList,
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();

  // Protect admin layout: Only ADMIN and FARM_MANAGER allowed
  if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
    redirect("/login");
  }

  const commercialNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Orders Pipeline", href: "/admin/orders", icon: ShoppingBag },
    { label: "Garden Visits", href: "/admin/garden-visits", icon: Flower },
    { label: "Story CMS", href: "/admin/content", icon: FileText },
    { label: "Delivery Zones", href: "/admin/delivery-zones", icon: MapPin },
    { label: "Delivery Slots", href: "/admin/delivery-slots", icon: Clock },
  ];

  const operationsNav = [
    { label: "Raw Stock & Materials", href: "/admin/operations/stock", icon: Layers },
    { label: "Farm Staff & Artisans", href: "/admin/operations/staff", icon: Users },
    { label: "Daily Attendance", href: "/admin/operations/attendance", icon: ClipboardList },
    { label: "Work & Field Tasks", href: "/admin/operations/tasks", icon: CheckSquare },
    { label: "Tools & Equipment", href: "/admin/operations/equipment", icon: Wrench },
    { label: "Section Expenses", href: "/admin/operations/expenses", icon: DollarSign },
    { label: "Crop Batches", href: "/admin/farm-batches", icon: Sprout },
  ];

  return (
    <div className="min-h-screen bg-[#F3EDE2] flex flex-col md:flex-row text-[#1C1917]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#1C1917] text-stone-300 p-6 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div className="overflow-y-auto">
          <div className="mb-6 pb-5 border-b border-stone-800">
            <Link href="/" className="flex items-center gap-2 text-white group">
              <span className="text-lg font-serif font-bold tracking-[0.15em]">STAKNA FARMHOUSE</span>
              <span className="text-[9px] uppercase font-bold bg-amber-600 text-white px-2 py-0.5 rounded-md">
                ADMIN
              </span>
            </Link>
            <p className="text-[11px] text-stone-400 mt-1">
              Active User: <span className="text-white font-medium">{session.name}</span> ({session.role})
            </p>
          </div>

          {/* Commercial Section */}
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 mb-2 px-3">
              Commercial & Storefront
            </div>
            <nav className="space-y-1 text-xs font-semibold">
              {commercialNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800 hover:text-white transition-colors text-stone-300"
                  >
                    <Icon className="w-4 h-4 text-[#B45309]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Physical Farm Operations Section */}
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/90 mb-2 px-3">
              Physical Farm Operations
            </div>
            <nav className="space-y-1 text-xs font-semibold">
              {operationsNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800 hover:text-white transition-colors text-stone-300"
                  >
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</div>
    </div>
  );
}
