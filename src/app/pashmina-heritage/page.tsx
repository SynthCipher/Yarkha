import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { contentRepository } from "@/repositories/contentRepository";
import {
  Sparkles,
  Award,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Layers,
  Compass,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pashmina Heritage: The Sacred Fleece of Changthang | Stakna Farmhouse",
  description:
    "Explore the sacred provenance of Changra cashmere from Kharnak nomads to our Stakna artisan spinning charkhas and handlooms.",
};

export default async function PashminaHeritagePage() {
  const contentBlock = await contentRepository.getByKey("pashmina-heritage");

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image
              src="/images/suite-riverfront.jpg"
              alt="Pashmina Handloom Weaving in Ladakh"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-6 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Provenance · Changthang to Stakna</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
              The Sacred Fleece: Changthang Cashmere & The Living Charkha
            </h1>
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
              From the 5,000-meter windswept heights of Kharnak to our village workshop beside the Indus. Preserving pure handspun Ladakhi Pashmina in its purest, uncompromised form.
            </p>
          </div>
        </section>

        {/* Provenance Key Indicators */}
        <section className="bg-[#292524] border-b border-stone-800 text-stone-300 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  4,500m+
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Nomadic Grazing Elevation
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  &lt; 14.5 µm
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Microscopic Fiber Fineness
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  100% Handspun
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Traditional Yender Charkha
                </div>
              </div>

              <div className="p-4">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  180+ Hours
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Handcraft per Heritage Shawl
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Deep Dive */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 leading-relaxed text-stone-700 text-sm sm:text-base font-light">
            {/* Act I */}
            <div>
              <span className="text-[#B45309] font-bold text-xs uppercase tracking-widest block mb-2">
                Act I · The High Altitude Pastures
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mb-4">
                The Changpa Nomads of Kharnak
              </h2>
              <p className="mb-4">
                On the vast, windswept high-altitude plateau of Changthang, where temperatures plummet below -40°C in winter, the Changpa nomads pasture their herds of Changra mountain goats (*Capra hircus laniger*).
              </p>
              <p>
                To insulate against the fierce Arctic winds, these goats develop a microscopic under-fleece of ultra-soft down. This fiber is under 14.5 microns in diameter—finer and lighter than goose down, yet warmer than any terrestrial wool.
              </p>
            </div>

            {/* Act II */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3 text-amber-800 text-xs font-bold uppercase mb-2">
                <HeartHandshake className="w-4 h-4 text-[#B45309]" />
                <span>Ethical Harvest</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917] mb-4">
                Spring Molt: Harmless Hand-Combing
              </h2>
              <p className="text-stone-600 mb-4 text-xs sm:text-sm">
                Unlike industrial sheep shearing, authentic Pashmina is never cut or sheared. In late spring, as the Himalayan snow melts, the goats naturally begin shedding their winter undercoat.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm">
                Herders use wide-toothed horn combs to gently coax the down free while the goats graze peacefully in the morning sun. The animals are unharmed and ready for the warm high-plateau summer.
              </p>
            </div>

            {/* Act III */}
            <div>
              <span className="text-[#B45309] font-bold text-xs uppercase tracking-widest block mb-2">
                Act II · The Stakna Workshop
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mb-4">
                The Ancient Rhythm of the Charkha (Yender)
              </h2>
              <p className="mb-4">
                Modern high-speed textile factories use harsh chemical baths and mechanized rings that snap delicate cashmere scales, giving rise to brittle mass-market fabrics. At Stakna Farmhouse, we refuse shortcut machinery:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 text-xs">
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
                  <div className="font-serif font-bold text-amber-800 text-sm mb-2">
                    1. Hand-Dehairing
                  </div>
                  <p className="text-stone-600">
                    Raw fleece contains coarse outer guard hairs. Our women artisans sort fiber lock by lock, removing impurities by hand over wooden trays.
                  </p>
                </div>
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
                  <div className="font-serif font-bold text-amber-800 text-sm mb-2">
                    2. Charkha Spinning
                  </div>
                  <p className="text-stone-600">
                    Spun on local apricot-wood wheels (*Yender*). The gentle human hand imparts a soft, airy twist that industrial spindles can never replicate.
                  </p>
                </div>
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
                  <div className="font-serif font-bold text-amber-800 text-sm mb-2">
                    3. Handloom Weaving
                  </div>
                  <p className="text-stone-600">
                    Woven on 4-pedal wooden floor looms in authentic diamond (*Chashm-e-Bulbul*) twill, creating an heirloom fabric that softens with every wear.
                  </p>
                </div>
              </div>
            </div>

            {/* Act IV: Fair Wages & Community */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-amber-200/60">
              <div className="flex items-center gap-3 text-amber-900 text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                <span>Fair Trade & Artisan Dignity</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
                Empowering the Women of Stakna & Nomadic Pastoralists
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mb-3">
                By purchasing raw fleece directly from Kharnak cooperatives at guaranteed fair floor prices and employing village spinning circles during the cold Ladakh winter, we ensure over 70% of product value remains directly in the hands of Himalayan producers.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm">
                When you wrap yourself in a Stakna Pashmina, you carry the warmth of Changthang pastures and the generational memory of Himalayan craftswomen.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 bg-[#1C1917] text-white p-8 sm:p-12 rounded-3xl text-center">
            <h3 className="font-serif font-bold text-2xl mb-3">Explore the Current Winter Weaves</h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 font-light">
              Limited pieces spun from our latest Kharnak harvest. Each stole and shawl is numbered and delivered with a certificate of Changthang origin.
            </p>
            <Link
              href="/pashmina"
              className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors"
            >
              <span>View Pashmina Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
