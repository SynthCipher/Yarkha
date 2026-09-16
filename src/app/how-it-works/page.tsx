import React from "react";
import type { Metadata } from "next";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { Clock, Truck, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "How Delivery Works in Leh & Ladakh | Yarkha Farm",
  description:
    "Everything you need to know about our daily harvest cycle, order cutoff times, local Leh delivery zones, and slots.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-3">
              <Truck className="w-3.5 h-3.5" />
              <span>Transparent Delivery Network</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
              Farm Freshness Guaranteed
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto mt-3 font-light leading-relaxed">
              We never keep fresh vegetables or cut flowers sitting in a warehouse. Everything is picked to order according to our morning harvest schedules.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center font-serif font-bold text-xl shrink-0">
                1
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Order Cutoff Times
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  To ensure our farmers can harvest at first light, the order cutoff for morning delivery is <strong>2:00 PM the prior day</strong>. Orders placed after 2:00 PM are queued for the following available harvest window.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center font-serif font-bold text-xl shrink-0">
                2
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Delivery Slots in Leh
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  During checkout, you choose a designated delivery time window:
                </p>
                <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
                  <li>• <strong>Morning Slot (08:00 AM – 10:30 AM):</strong> Ideal for morning cooking and fresh table greens.</li>
                  <li>• <strong>Afternoon Slot (02:00 PM – 04:30 PM):</strong> Convenient for household and office deliveries.</li>
                  <li>• <strong>Evening Twilight Slot (05:30 PM – 07:30 PM):</strong> Fresh produce right before dinnertime.</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center font-serif font-bold text-xl shrink-0">
                3
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Delivery Zones & Fees
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  Fresh produce is delivered across three primary zones in the Leh valley:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                    <p className="font-bold text-[#1C1917]">Leh Central</p>
                    <p className="text-[11px] text-stone-500">Bazaar, Changspa, Skara, Tukcha</p>
                    <p className="text-[#B45309] font-semibold mt-1">₹40 delivery (Free &gt; ₹700)</p>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                    <p className="font-bold text-[#1C1917]">Choglamsar & Shey</p>
                    <p className="text-[11px] text-stone-500">SOS Village, Saboo, Shey, Thiksey</p>
                    <p className="text-[#B45309] font-semibold mt-1">₹60 delivery (Free &gt; ₹900)</p>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                    <p className="font-bold text-[#1C1917]">Stakna & Indus East</p>
                    <p className="text-[11px] text-stone-500">Stakna, Nang, Ranbirpur, Matho</p>
                    <p className="text-[#B45309] font-semibold mt-1">₹50 delivery (Free &gt; ₹800)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center font-serif font-bold text-xl shrink-0">
                4
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Eco-Conscious Packaging
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  We are deeply committed to keeping Ladakh pristine. We use 100% plastic-free unbleached craft bags, woven cotton sacks, and reusable glass jars. Return your glass preserve jars to our delivery drivers for a ₹20 credit on your next harvest order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
