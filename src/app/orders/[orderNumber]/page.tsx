import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { orderRepository } from "@/repositories/orderRepository";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Calendar,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order #${orderNumber} | Yarkha Farm Ladakh`,
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const rawOrder = await orderRepository.findByOrderNumber(orderNumber);

  if (!rawOrder) {
    notFound();
  }

  const order = JSON.parse(JSON.stringify(rawOrder));

  const statusSteps = [
    { key: "PLACED", label: "Harvest Order Placed", icon: Clock },
    { key: "CONFIRMED", label: "Confirmed by Farm", icon: CheckCircle2 },
    { key: "PREPARING", label: "Harvesting & Sorting", icon: Package },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery in Leh", icon: Truck },
    { key: "DELIVERED", label: "Delivered to Doorstep", icon: CheckCircle2 },
  ];

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#B45309] font-semibold mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                  Order Confirmed
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                  Order #{order.orderNumber}
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                <span>Status: {order.status.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>

          {/* Status Progression Timeline UI */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm mb-10">
            <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-8">
              Harvest Order Timeline
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative z-10">
                {statusSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= (currentStatusIndex >= 0 ? currentStatusIndex : 0);
                  const isCurrent = idx === currentStatusIndex;

                  return (
                    <div
                      key={step.key}
                      className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          isCompleted
                            ? "bg-[#B45309] text-white"
                            : "bg-stone-100 text-stone-400"
                        } ${isCurrent ? "ring-4 ring-amber-200" : ""}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold leading-snug ${
                            isCompleted ? "text-[#1C1917]" : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Delivery Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4 text-xs">
              <h4 className="font-serif font-bold text-base text-[#1C1917] border-b border-stone-100 pb-2">
                Delivery Details
              </h4>
              <div>
                <p className="text-[#78716C] uppercase font-bold text-[10px] tracking-wider">
                  Recipient
                </p>
                <p className="font-semibold text-sm text-[#1C1917] mt-0.5">
                  {order.deliveryAddress.fullName}
                </p>
                <p className="text-stone-600 mt-0.5">{order.deliveryAddress.phone}</p>
              </div>

              <div>
                <p className="text-[#78716C] uppercase font-bold text-[10px] tracking-wider">
                  Address & Locality
                </p>
                <p className="text-stone-700 mt-0.5 leading-relaxed">
                  {order.deliveryAddress.streetAddress}, {order.deliveryAddress.locality}, {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
                </p>
              </div>

              {order.deliverySlot && (
                <div>
                  <p className="text-[#78716C] uppercase font-bold text-[10px] tracking-wider">
                    Scheduled Harvest Delivery Slot
                  </p>
                  <p className="font-semibold text-[#B45309] mt-0.5">
                    {order.deliverySlot.title} ({new Date(order.deliverySlot.date).toLocaleDateString()})
                  </p>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`https://wa.me/919419178901?text=${encodeURIComponent(`Julley! Inquiring about my harvest order #${order.orderNumber}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Farm Dispatch on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Items & Payment Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4 text-xs">
              <h4 className="font-serif font-bold text-base text-[#1C1917] border-b border-stone-100 pb-2">
                Order Items ({order.items.length})
              </h4>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-50">
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

              <div className="border-t border-stone-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-[#78716C]">
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Delivery Fee</span>
                  <span>₹{order.pricing.deliveryFee}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{order.pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif font-bold text-lg text-[#1C1917] pt-2 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span className="text-[#B45309]">₹{order.pricing.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
