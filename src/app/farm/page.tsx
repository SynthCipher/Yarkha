import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { Sun, Droplets, Mountain, Compass, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Farm & High-Altitude Growing Story | Yarkha Farm Ladakh",
  description:
    "Learn how Yarkha Farm harnesses passive solar greenhouses, earthen thermal mass, and Indus glacial melt to cultivate organic produce year-round in Stakna, Ladakh.",
  keywords: [
    "Ladakh organic farming",
    "Stakna farm",
    "passive solar greenhouse Leh",
    "high altitude farming India",
    "regenerative agriculture Ladakh",
  ],
};

export default function FarmPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Farm Hero */}
        <section className="relative py-28 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/stakna-valley.jpg"
              alt="Stakna Farm Valley along the Indus"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/60" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Mountain className="w-3.5 h-3.5" />
              <span>3,200m Elevation · Indus River Basin</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6">
              Cultivating Life in the High Himalayan Desert
            </h1>
            <p className="text-base sm:text-lg text-stone-300 font-light max-w-3xl mx-auto leading-relaxed font-sans">
              At Yarkha Farm in Stakna, we challenge the conventional boundaries of cold-desert agriculture. Combining centuries-old Ladakhi earthen knowledge with modern passive solar design, we grow fresh food all year round.
            </p>
          </div>
        </section>

        {/* Story Section 1: Passive Solar Architecture */}
        <section className="py-20 sm:py-28 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                  Architectural Ecology
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                  Passive Solar Thermal Greenhouses
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  Ladakh experiences brutal winter drops down to -25°C, yet enjoys over 300 days of glorious high-intensity sunlight. Our greenhouses are designed with thick 18-inch south-oriented rammed-earth walls (<em>gyang</em>).
                </p>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  During daylight, this massive earthen body absorbs thermal radiation from the sun. At night, it gently re-radiates that warmth into the vegetable beds, keeping interior temperatures at a flourishing +12°C without burning a single piece of wood, coal, or diesel.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <p className="font-serif font-bold text-lg text-[#B45309]">Zero</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">Artificial Heating Fuel</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <p className="font-serif font-bold text-lg text-[#B45309]">100%</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">Sunlight Thermal Mass</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/images/hero.jpg"
                  alt="Yarkha Solar Farm in Ladakh"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section 2: Water & Glacial Melt */}
        <section className="py-20 sm:py-28 bg-[#F3EDE2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/images/dining.jpg"
                  alt="Fresh organic harvest and clean farming"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                  Pure Hydration
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                  Irrigated by Ancient Glacial Melt
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  Our irrigation channels (<em>yuras</em>) carry pristine glacial meltwater originating high in the snowfields of the Ladakh and Zanskar ranges directly into our fields.
                </p>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  This mineral-rich water contains natural high-altitude sediment that fortifies the soil. We pair this with precision drip irrigation in our greenhouses, ensuring every drop is conserved with the utmost reverence.
                </p>

                <div className="pt-4">
                  <Link
                    href="/vegetables"
                    className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all"
                  >
                    <span>Taste Today&apos;s Harvest</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
