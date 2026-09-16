"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  Truck,
} from "lucide-react";
import { USER_ROLES } from "@/config/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, subtotal } = useCart();
  const { user, logout } = useAuth();

  const hasPerishables = items.some(
    (i) =>
      i.fulfillmentType === "LOCAL_PERISHABLE" ||
      i.productType === "VEGETABLE" ||
      i.productType === "FLOWER" ||
      i.productType === "SAPLING" ||
      i.productType === "SEASONAL"
  );
  const isShippableOnly = items.length > 0 && !hasPerishables;
  const isMixedCart =
    hasPerishables &&
    items.some(
      (i) =>
        i.fulfillmentType === "SHIPPABLE" ||
        i.productType === "VALUE_ADDED" ||
        i.productType === "PASHMINA"
    );

  // Form states
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [locality, setLocality] = useState("Leh Main Bazaar");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("194101");
  const [city, setCity] = useState("Leh");
  const [deliveryState, setDeliveryState] = useState("Ladakh");
  const [orderNotes, setOrderNotes] = useState("");

  // Delivery slot states
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const [deliveryDate, setDeliveryDate] = useState(
    tomorrow.toISOString().split("T")[0]
  );
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Eligibility & Pricing states
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Payment & Processing states
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Check delivery eligibility whenever locality changes
  const checkDeliveryEligibility = async () => {
    if (items.length === 0) return;
    setIsCheckingEligibility(true);
    setErrorMessage("");

    const targetLocality =
      isShippableOnly && deliveryState !== "Ladakh" ? "Rest of India" : locality;

    try {
      const res = await fetch("/api/v1/delivery/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locality: targetLocality,
          postalCode,
          cartProductTypes: items.map((i) => i.productType),
          orderSubtotal: subtotal,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEligibilityResult(json.data);
      } else {
        setEligibilityResult({
          isEligible: false,
          deliveryFee: 0,
          reason: json.error,
        });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  useEffect(() => {
    checkDeliveryEligibility();
  }, [locality, deliveryState, subtotal, items]);

  // Fetch available slots for the chosen delivery date
  useEffect(() => {
    if (!hasPerishables) return;
    async function loadSlots() {
      try {
        const res = await fetch(`/api/v1/delivery/slots?date=${deliveryDate}`);
        const json = await res.json();
        if (json.success && json.data) {
          setAvailableSlots(json.data);
          if (json.data.length > 0) {
            setSelectedSlot(json.data[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSlots();
  }, [deliveryDate, hasPerishables]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await fetch("/api/v1/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode,
          deliveryFee: eligibilityResult?.deliveryFee || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setDiscountAmount(json.data.discount);
        setAppliedCoupon(couponCode.toUpperCase());
        if (json.data.warnings?.length > 0) {
          setErrorMessage(json.data.warnings[0]);
        }
      }
    } catch (e: any) {
      setErrorMessage("Unable to apply coupon");
    }
  };

  const deliveryFee = eligibilityResult?.deliveryFee || 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!eligibilityResult?.isEligible) {
      setErrorMessage(
        eligibilityResult?.reason || "Selected locality is not eligible for delivery."
      );
      return;
    }

    if (hasPerishables && !selectedSlot) {
      setErrorMessage("Please select a harvest delivery slot for fresh items.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const targetLocality =
        isShippableOnly && deliveryState !== "Ladakh" ? "Rest of India" : locality;

      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            productType: i.productType,
          })),
          deliveryAddress: {
            fullName,
            phone,
            streetAddress,
            locality: targetLocality,
            landmark,
            postalCode,
            city,
            state: deliveryState,
          },
          deliverySlot:
            hasPerishables && selectedSlot
              ? {
                  slotId: selectedSlot.id,
                  title: selectedSlot.title,
                  date: deliveryDate,
                }
              : undefined,
          couponCode: appliedCoupon,
          paymentMethod,
          orderNotes,
          guestInfo: user
            ? undefined
            : {
                name: fullName,
                phone,
                email,
              },
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Order creation failed.");
      }

      const { orderNumber, razorpayOrderId } = json.data;

      if (paymentMethod === "COD") {
        clearCart();
        router.push(`/orders/${orderNumber}?success=true`);
        return;
      }

      // Online Razorpay Payment flow
      // In dev or live mode, verify payment
      const verifyRes = await fetch("/api/v1/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock_verified_signature",
        }),
      });

      const verifyJson = await verifyRes.json();
      if (verifyJson.success) {
        clearCart();
        router.push(`/orders/${orderNumber}?success=true`);
      } else {
        throw new Error(verifyJson.error || "Payment verification failed.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.FARM_MANAGER;

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
        <StoreHeader />
        <main className="py-20 sm:py-28">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Admin Session Active
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-3">
                  Storefront Order Form Disabled for Admin
                </h1>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2 max-w-md mx-auto leading-relaxed">
                  You are currently logged in as <strong>{user?.name}</strong> with role{" "}
                  <strong>{user?.role}</strong>. To maintain clean accounting and prevent synthetic customer orders, administrators cannot submit storefront retail orders.
                </p>
              </div>

              <div className="bg-[#FAF7F2] border border-stone-200 rounded-2xl p-4 text-xs text-[#78716C] space-y-1 text-left">
                <p className="font-semibold text-[#1C1917]">Recommended Actions:</p>
                <p>• To oversee, update status, and manage active customer orders, visit the Admin Orders Pipeline.</p>
                <p>• To test customer checkout as a retail buyer, sign out or use a separate customer account in an incognito window.</p>
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
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.refresh();
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-stone-50 text-[#1C1917] border border-stone-300 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-stone-500" />
                  <span>Sign Out of Admin</span>
                </button>
              </div>
            </div>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
        <StoreHeader />
        <div className="max-w-xl mx-auto py-24 px-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#1C1917] mb-3">
            Your basket is empty
          </h2>
          <p className="text-xs text-[#78716C] mb-6">
            Please add fresh vegetables, blooms, or preserves before checking out.
          </p>
          <Link
            href="/vegetables"
            className="bg-[#B45309] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold inline-block"
          >
            Explore Catalog
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              Complete Your Harvest Order
            </h1>
            <p className="text-xs text-[#78716C] mt-1">
              Guaranteed fresh harvest with local Ladakh delivery slot selection.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Details & Slot */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-5 h-5 text-[#B45309]" />
                  <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                    1. Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jigmat Dorjey"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94191 78901"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                    Street Address / House Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Near Shanti Stupa, Fort Road, House #4"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                  />
                </div>

                {/* Mixed Cart Notice */}
                {isMixedCart && (
                  <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Mixed Harvest & Heirloom Cart:</strong>
                      <p className="mt-0.5 text-stone-600 leading-relaxed font-light">
                        Your basket contains perishable greens/saplings and shippable goods. Perishables will be hand-delivered in Leh on your chosen date; preserves and Pashmina will be delivered concurrently.
                      </p>
                    </div>
                  </div>
                )}

                {/* Address & Locality/State Selection */}
                {isShippableOnly ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                        State / UT *
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        placeholder="e.g. Ladakh, Delhi, Maharashtra"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Leh, New Delhi, Mumbai"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 194101 or 110001"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                        Locality in Leh / Ladakh *
                      </label>
                      <select
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                      >
                        <option value="Leh Main Bazaar">Leh Main Bazaar</option>
                        <option value="Fort Road">Fort Road</option>
                        <option value="Changspa">Changspa</option>
                        <option value="Old Town">Old Town</option>
                        <option value="Skara">Skara</option>
                        <option value="Karzoo">Karzoo</option>
                        <option value="Sankar">Sankar</option>
                        <option value="Tukcha">Tukcha</option>
                        <option value="Housing Colony">Housing Colony</option>
                        <option value="Choglamsar">Choglamsar</option>
                        <option value="Saboo">Saboo</option>
                        <option value="Shey">Shey</option>
                        <option value="Thiksey">Thiksey</option>
                        <option value="Stakna">Stakna</option>
                        <option value="Spituk">Spituk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Stakna Bridge"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                      />
                    </div>
                  </div>
                )}

                {/* Eligibility Feedback Banner */}
                {eligibilityResult && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                      eligibilityResult.isEligible
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                  >
                    {eligibilityResult.isEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>
                      {eligibilityResult.isEligible
                        ? `Delivery eligible${
                            isShippableOnly ? ` for ${city || "your location"}` : ` for ${locality}`
                          }. Delivery Fee: ₹${eligibilityResult.deliveryFee}`
                        : eligibilityResult.reason}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2: Delivery Method (Slot or Pan-India Courier) */}
              {isShippableOnly ? (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <Truck className="w-5 h-5 text-[#B45309]" />
                    <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                      2. Pan-India Courier Dispatch
                    </h3>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 text-xs text-stone-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                      <span>Himalayan Air Courier & Speed Post Dispatch</span>
                    </div>
                    <p className="leading-relaxed font-light">
                      Your order contains shelf-stable preserves and/or authentic Changthang Pashmina textiles. Items are packed in eco-friendly protective casing and dispatched within 24 hours. Expected delivery: 3–5 business days nationwide.
                    </p>
                    <p className="text-[11px] text-amber-900 font-medium">
                      ✓ Zero local delivery slot required · Tracking link sent via SMS/Email
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <Calendar className="w-5 h-5 text-[#B45309]" />
                    <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                      2. Select Harvest Delivery Date & Slot
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C]">
                      Available Time Window
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={slot.isFull}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-[#B45309] bg-amber-50/60 ring-2 ring-[#B45309]/30"
                              : slot.isFull
                              ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                              : "border-stone-200 bg-[#FAF7F2] hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] mb-1">
                            <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>{slot.title.split("(")[0]}</span>
                          </div>
                          <p className="text-[10px] text-[#78716C]">
                            {slot.isFull ? "Slot Full" : `${slot.remainingCapacity} slots open`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <CreditCard className="w-5 h-5 text-[#B45309]" />
                  <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                    3. Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("RAZORPAY")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "RAZORPAY"
                        ? "border-[#B45309] bg-amber-50/50 ring-2 ring-[#B45309]/30"
                        : "border-stone-200 bg-[#FAF7F2]"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-[#B45309] mt-0.5 flex items-center justify-center">
                      {paymentMethod === "RAZORPAY" && (
                        <div className="w-2 h-2 rounded-full bg-[#B45309]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#1C1917]">
                        Online Payment (UPI, Cards, Netbanking)
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Instant confirmation via secure Razorpay checkout.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "COD"
                        ? "border-[#B45309] bg-amber-50/50 ring-2 ring-[#B45309]/30"
                        : "border-stone-200 bg-[#FAF7F2]"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-[#B45309] mt-0.5 flex items-center justify-center">
                      {paymentMethod === "COD" && (
                        <div className="w-2 h-2 rounded-full bg-[#B45309]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#1C1917]">
                        Cash or UPI on Delivery
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Pay upon doorstep harvest arrival in Leh.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 sticky top-28">
                <h3 className="font-serif font-bold text-lg text-[#1C1917] border-b border-stone-100 pb-3">
                  Harvest Order Summary
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-[#1C1917]">{item.title}</p>
                        <p className="text-[10px] text-[#78716C]">
                          {item.quantity} {item.unit} × ₹{item.pricePerUnit}
                        </p>
                      </div>
                      <span className="font-bold text-[#1C1917]">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Box */}
                <div className="border-t border-stone-100 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. JULLEY10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Coupon {appliedCoupon} applied (-₹{discountAmount})</span>
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>Harvest Subtotal</span>
                    <span className="font-semibold text-[#1C1917]">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#78716C]">
                    <span>Local Delivery Fee</span>
                    <span className="font-semibold text-[#1C1917]">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700">Free Delivery</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-[#1C1917]">
                      Total Payable
                    </span>
                    <span className="font-serif font-bold text-2xl text-[#B45309]">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                >
                  <span>{isProcessing ? "Confirming Order..." : "Confirm & Place Harvest Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fresh Harvest Guarantee · Same-Day Delivery in Leh</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
