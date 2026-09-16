import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import FarmstayWaitlistForm from "@/components/store/FarmstayWaitlistForm";
import {
  Compass,
  Sun,
  Moon,
  Sparkles,
  Mountain,
  Utensils,
  Eye,
  CheckCircle2,
  Calendar,
  Send,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Eco-Retreat & Farmstay Preview | Stakna Farmhouse Ladakh",
  description:
    "Passive solar rammed-earth architecture, permaculture gardens, and Indus river vistas on our 2-acre plot in Stakna, Ladakh. Join the private opening waitlist.",
  keywords: [
    "Stakna Farmstay",
    "Ladakh eco retreat",
    "passive solar farmhouse Ladakh",
    "Indus river view stay",
    "Stakna monastery hotel",
  ],
};

export default function FarmstayPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-24 sm:py-36 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40">
            <Image
              src="/images/stakna-valley.jpg"
              alt="Stakna Farmstay Panoramic View across the Indus Valley"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-6 border border-amber-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Section 6 · Eco-Retreat & Land Development Preview</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
              An Architectural Eco-Retreat on the Banks of the Indus
            </h1>
            <p className="text-base sm:text-lg text-stone-200 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              Nestled on a 2-acre hillside in Stakna, beneath the gaze of the 16th-century Tiger Monastery. Designed with passive solar vernacular architecture to live in harmony with Himalayan winters.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-xs sm:text-sm text-stone-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Phase 1 Development In Progress · Opening Summer 2026/2027</span>
            </div>
          </div>
        </section>

        {/* The 2-Acre Vision Grid */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#B45309] text-xs font-bold uppercase tracking-widest">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] mt-2">
              Ancient Wisdom Meets Modern Passive Solar Engineering
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
              Every room is calibrated to absorb southern Himalayan sunlight through thick stone and rammed-earth Trombe walls, storing warmth for sub-zero Ladakh nights without consuming fossil fuels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/suite-stok.jpg"
                  alt="Passive Solar Guest Suites"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase mb-2">
                    <Sun className="w-4 h-4 text-[#B45309]" />
                    <span>Solar-Thermal Comfort</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">
                    Autonomous Himalayan Warmth
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Triple-glazed south-facing apertures, sheep wool ceiling insulation, and thick rammed-earth masonry ensure temperatures stay at a steady 18°C–22°C even when outside temperatures drop to -20°C.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/dining.jpg"
                  alt="Farm-to-Table Dining"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase mb-2">
                    <Utensils className="w-4 h-4 text-[#B45309]" />
                    <span>Zero-Kilometer Dining</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">
                    Harvested Moments Before The Table
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Meals are curated straight from our greenhouses and terraces. Crisp mountain kale, roasted heritage barley Tsampa, fresh apricot compote, and garden herbal infusions.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/stargazing.jpg"
                  alt="Dark Sky Stargazing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase mb-2">
                    <Moon className="w-4 h-4 text-[#B45309]" />
                    <span>Dark Sky Sanctuary</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">
                    Unfiltered Himalayan Astronomy
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Far removed from Leh town glare, our open rooftop observatory terrace provides crystalline views of the Milky Way, meteor showers, and high-altitude constellations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Development Progress & Waitlist Section */}
        <section className="bg-[#1C1917] text-white py-16 sm:py-24 border-t border-stone-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                  Early Development Stage
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 mb-4 leading-tight">
                  Be Among the First to Experience Stakna Farmstay
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-light">
                  We are currently shaping the terraces, planting heirloom orchard saplings, and building the rammed-earth foundations. Direct room reservations will open prior to inaugural guest arrivals.
                </p>

                <div className="space-y-3 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Exclusive priority booking window for waitlist members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Complimentary farm tasting menu & guided orchard tour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Invitations to seasonal apricot blossom and harvest gatherings</span>
                  </div>
                </div>
              </div>

              {/* Waitlist Form Component */}
              <FarmstayWaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
