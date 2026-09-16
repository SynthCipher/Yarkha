"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES, APP_CONFIG } from "@/config/constants";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  ShoppingBag,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  Sparkles,
  CreditCard,
  RefreshCw,
} from "lucide-react";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);

  // Guest order tracker state
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestSearching, setGuestSearching] = useState(false);
  const [guestSearchResult, setGuestSearchResult] = useState<any | null>(null);
  const [guestSearchError, setGuestSearchError] = useState("");

  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.FARM_MANAGER;

  // Fetch logged in customer orders
  const fetchCustomerOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/v1/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch customer orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && !isAdmin) {
      fetchCustomerOrders();
    }
  }, [user, isAdmin]);

  const handleCopy = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNumber(orderNumber);
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  // Guest order lookup
  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = guestOrderNumber.trim();
    if (!cleanNum) return;

    setGuestSearching(true);
    setGuestSearchError("");
    setGuestSearchResult(null);

    try {
      const res = await fetch(`/api/v1/orders/${encodeURIComponent(cleanNum)}`);
      const json = await res.json();
      if (json.success && json.data) {
        // If phone provided, verify match
        if (guestPhone.trim()) {
          const expectedPhone =
            json.data.deliveryAddress?.phone || json.data.guestInfo?.phone || "";
          const cleanInputPhone = guestPhone.replace(/\D/g, "");
          const cleanExpected = expectedPhone.replace(/\D/g, "");
          if (
            cleanInputPhone &&
            cleanExpected &&
            !cleanExpected.endsWith(cleanInputPhone) &&
            !cleanInputPhone.endsWith(cleanExpected)
          ) {
            setGuestSearchError(
              "The phone number provided does not match the delivery record for this order."
            );
            return;
          }
        }
        setGuestSearchResult(json.data);
      } else {
        setGuestSearchError(
          json.error || `No harvest order found matching "${cleanNum}".`
        );
      }
    } catch (err) {
      setGuestSearchError("Unable to look up order. Please check your internet connection.");
    } finally {
      setGuestSearching(false);
    }
  };

  // Status helper configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PLACED":
        return {
          label: "Order Placed",
          color: "bg-amber-100 text-amber-900 border-amber-300",
          icon: Clock,
        };
      case "CONFIRMED":
        return {
          label: "Confirmed by Farm",
          color: "bg-sky-100 text-sky-900 border-sky-300",
          icon: CheckCircle2,
        };
      case "PREPARING":
        return {
          label: "Harvesting & Sorting",
          color: "bg-purple-100 text-purple-900 border-purple-300",
          icon: Package,
        };
      case "READY_FOR_DELIVERY":
        return {
          label: "Packed for Dispatch",
          color: "bg-indigo-100 text-indigo-900 border-indigo-300",
          icon: Package,
        };
      case "OUT_FOR_DELIVERY":
        return {
          label: "Out for Delivery in Leh",
          color: "bg-orange-100 text-orange-900 border-orange-300",
          icon: Truck,
        };
      case "DELIVERED":
        return {
          label: "Delivered Fresh",
          color: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: CheckCircle2,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-900 border-red-300",
          icon: XCircle,
        };
      case "PAYMENT_FAILED":
        return {
          label: "Payment Pending / Failed",
          color: "bg-rose-100 text-rose-900 border-rose-300",
          icon: AlertCircle,
        };
      default:
        return {
          label: status.replace(/_/g, " "),
          color: "bg-stone-100 text-stone-900 border-stone-300",
          icon: Clock,
        };
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Tab filtering
    if (activeTab === "ACTIVE") {
      const activeStatuses = ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY"];
      if (!activeStatuses.includes(order.status)) return false;
    } else if (activeTab === "DELIVERED") {
      if (order.status !== "DELIVERED") return false;
    } else if (activeTab === "CANCELLED") {
      if (order.status !== "CANCELLED" && order.status !== "PAYMENT_FAILED") return false;
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = order.orderNumber?.toLowerCase().includes(q);
      const matchItem = order.items?.some((i: any) => i.title?.toLowerCase().includes(q));
      const matchLocality = order.deliveryAddress?.locality?.toLowerCase().includes(q);
      return matchNum || matchItem || matchLocality;
    }

    return true;
  });

  const activeCount = orders.filter((o) =>
    ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY"].includes(o.status)
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => ["CANCELLED", "PAYMENT_FAILED"].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5" />
                <span>Customer Order Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                My Harvest Orders & Tracking
              </h1>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-light">
                Monitor organic harvest preparation, track doorstep delivery in Leh, and review invoice receipts.
              </p>
            </div>

            {user && !isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchCustomerOrders}
                  disabled={loadingOrders}
                  className="flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] bg-white border border-stone-200 px-4 py-2.5 rounded-full font-medium transition-all shadow-xs disabled:opacity-50"
                  title="Refresh orders"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin text-[#B45309]" : ""}`} />
                  <span>Refresh Orders</span>
                </button>
                <Link
                  href="/vegetables"
                  className="bg-[#B45309] hover:bg-[#92400E] text-white text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order More</span>
                </Link>
              </div>
            )}
          </div>

          {/* Case 1: Admin Logged In */}
          {isAdmin ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-md text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Admin Session Active
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#1C1917] mt-3">
                  Admin Orders Pipeline
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2 max-w-md mx-auto leading-relaxed">
                  You are logged in as <strong>{user?.name}</strong> (Administrator). To manage, dispatch, and update all customer harvest orders across Ladakh, access the dedicated Admin Orders Pipeline.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/admin/orders"
                  className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Admin Orders Dashboard</span>
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    router.refresh();
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-stone-50 text-[#1C1917] border border-stone-300 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-stone-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : user ? (
            /* Case 2: Logged-in Customer View */
            <div className="space-y-8">
              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
                {/* Tabs */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setActiveTab("ALL")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                      activeTab === "ALL"
                        ? "bg-[#1C1917] text-white shadow-xs"
                        : "text-[#78716C] hover:bg-stone-100"
                    }`}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("ACTIVE")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                      activeTab === "ACTIVE"
                        ? "bg-[#B45309] text-white shadow-xs"
                        : "text-[#78716C] hover:bg-stone-100"
                    }`}
                  >
                    Active / In Progress ({activeCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("DELIVERED")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                      activeTab === "DELIVERED"
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "text-[#78716C] hover:bg-stone-100"
                    }`}
                  >
                    Delivered ({deliveredCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("CANCELLED")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                      activeTab === "CANCELLED"
                        ? "bg-red-700 text-white shadow-xs"
                        : "text-[#78716C] hover:bg-stone-100"
                    }`}
                  >
                    Cancelled ({cancelledCount})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Order # or item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1C1917] font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                  />
                </div>
              </div>

              {/* Orders List / Loading / Empty State */}
              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-4"
                    >
                      <div className="h-5 bg-stone-200 rounded w-1/4" />
                      <div className="h-16 bg-stone-100 rounded-2xl" />
                      <div className="h-4 bg-stone-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 sm:p-16 border border-stone-200/80 text-center max-w-xl mx-auto shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-[#B45309] flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] mb-2">
                    {orders.length === 0
                      ? "No harvest orders placed yet"
                      : "No orders match your filter"}
                  </h3>
                  <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-6 leading-relaxed">
                    {orders.length === 0
                      ? "Explore crisp morning-harvested greens, high-altitude mountain blooms, or artisanal seabuckthorn preserves."
                      : "Try switching to the 'All Orders' tab or clearing your search term."}
                  </p>
                  <Link
                    href="/vegetables"
                    className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-full transition-all shadow-md"
                  >
                    <span>Browse Harvest Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={order._id || order.id || order.orderNumber}
                        className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="p-5 sm:p-6 bg-[#FAF7F2]/60 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#1C1917]">
                              <span>#{order.orderNumber}</span>
                              <button
                                onClick={() => handleCopy(order.orderNumber)}
                                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                                title="Copy order number"
                              >
                                {copiedOrderNumber === order.orderNumber ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <span className="text-stone-300 hidden sm:inline">•</span>

                            <span className="text-xs text-[#78716C]">{orderDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusConfig.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{statusConfig.label}</span>
                            </span>
                          </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Left: Items List */}
                          <div className="lg:col-span-7 space-y-3">
                            <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#78716C]">
                              Harvest Items ({order.items?.length || 0})
                            </h4>

                            <div className="space-y-2.5">
                              {order.items?.map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-stone-100"
                                >
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                                    <Image
                                      src={item.image || "/images/hero.jpg"}
                                      alt={item.title}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs text-[#1C1917] truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-[11px] text-[#78716C]">
                                      {item.quantity} {item.unit} × ₹{item.pricePerUnit}
                                    </p>
                                  </div>

                                  <span className="text-xs font-bold text-[#1C1917] shrink-0">
                                    ₹{item.subtotal}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Delivery & Payment Details */}
                          <div className="lg:col-span-5 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4 text-xs flex flex-col justify-between">
                            <div className="space-y-3">
                              {/* Destination */}
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#78716C] block mb-1">
                                  Delivery Destination
                                </span>
                                <div className="flex items-start gap-2 text-[#1C1917]">
                                  <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-semibold">
                                      {order.deliveryAddress?.fullName} ({order.deliveryAddress?.phone})
                                    </p>
                                    <p className="text-stone-500 text-[11px]">
                                      {order.deliveryAddress?.streetAddress},{" "}
                                      {order.deliveryAddress?.locality}, {order.deliveryAddress?.city}{" "}
                                      {order.deliveryAddress?.postalCode}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Slot */}
                              {order.deliverySlot && (
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#78716C] block mb-1">
                                    Harvest Delivery Window
                                  </span>
                                  <div className="flex items-center gap-2 text-[#1C1917]">
                                    <Calendar className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                                    <span>
                                      {new Date(order.deliverySlot.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}{" "}
                                      · {order.deliverySlot.title}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Payment Breakdown */}
                              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-[11px]">
                                <div className="flex justify-between text-stone-500">
                                  <span>Subtotal</span>
                                  <span>₹{order.pricing?.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-stone-500">
                                  <span>Delivery Fee</span>
                                  <span>
                                    {order.pricing?.deliveryFee === 0 ? "Free" : `₹${order.pricing?.deliveryFee}`}
                                  </span>
                                </div>
                                {order.pricing?.discount > 0 && (
                                  <div className="flex justify-between text-emerald-700 font-semibold">
                                    <span>Discount</span>
                                    <span>-₹{order.pricing?.discount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold text-xs text-[#1C1917] pt-1 border-t border-stone-200">
                                  <span>Total ({order.payment?.method || "COD"})</span>
                                  <span className="text-[#B45309] font-serif text-sm">
                                    ₹{order.pricing?.total}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center gap-2">
                              <Link
                                href={`/orders/${order.orderNumber}`}
                                className="flex-1 bg-[#1C1917] hover:bg-[#B45309] text-white py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-xs"
                              >
                                <span>Track Timeline</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>

                              <a
                                href={`https://wa.me/${APP_CONFIG.contact.whatsapp}?text=${encodeURIComponent(
                                  `Julley Yarkha Farm! I need assistance regarding my order #${order.orderNumber}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition-colors"
                                title="Contact Farm on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Case 3: Guest User View (Not Logged In) */
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Sign-In Encouragement Card */}
              <div className="bg-gradient-to-r from-amber-900 to-[#1C1917] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Member Advantage</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                    Sign in to View Your Complete Harvest History
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-light">
                    Access all your past and active orders across Leh, save multiple delivery addresses, and track real-time morning harvests directly from your account.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/login?redirect=/orders"
                      className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 shadow-lg transition-all"
                    >
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/login?redirect=/orders"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 transition-all"
                    >
                      <span>Create Free Account</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Guest Instant Order Tracker */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-lg">
                <div className="text-center max-w-lg mx-auto mb-8">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#1C1917]">
                    Instant Guest Order Tracker
                  </h3>
                  <p className="text-xs text-[#78716C] mt-1">
                    Placed an order as a guest? Enter your order number below to check its preparation and delivery status in real-time.
                  </p>
                </div>

                <form onSubmit={handleGuestSearch} className="max-w-xl mx-auto space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                      Order Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-2026-00001"
                      value={guestOrderNumber}
                      onChange={(e) => setGuestOrderNumber(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1C1917] font-medium uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                      Delivery Phone Number (Optional Security Check)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 94191 78901"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3 text-xs text-[#1C1917] font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                    />
                  </div>

                  {guestSearchError && (
                    <div className="p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{guestSearchError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={guestSearching}
                    className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{guestSearching ? "Checking Farm Dispatch..." : "Track Harvest Order"}</span>
                  </button>
                </form>

                {/* Search Result Card */}
                {guestSearchResult && (
                  <div className="max-w-xl mx-auto mt-8 pt-8 border-t border-stone-200 animate-in fade-in duration-300">
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-amber-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                            Found Order
                          </span>
                          <h4 className="font-mono text-base font-bold text-[#1C1917]">
                            #{guestSearchResult.orderNumber}
                          </h4>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                            getStatusConfig(guestSearchResult.status).color
                          }`}
                        >
                          <span>{getStatusConfig(guestSearchResult.status).label}</span>
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-[#78716C]">
                        <p>
                          <strong className="text-[#1C1917]">Recipient:</strong>{" "}
                          {guestSearchResult.deliveryAddress?.fullName} ({guestSearchResult.deliveryAddress?.locality})
                        </p>
                        <p>
                          <strong className="text-[#1C1917]">Harvest Total:</strong> ₹
                          {guestSearchResult.pricing?.total} ({guestSearchResult.payment?.method})
                        </p>
                        <p>
                          <strong className="text-[#1C1917]">Items:</strong>{" "}
                          {guestSearchResult.items?.map((i: any) => `${i.quantity} ${i.unit} ${i.title}`).join(", ")}
                        </p>
                      </div>

                      <Link
                        href={`/orders/${guestSearchResult.orderNumber}`}
                        className="w-full bg-[#1C1917] hover:bg-[#B45309] text-white py-3 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                      >
                        <span>View Full Live Timeline & Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
