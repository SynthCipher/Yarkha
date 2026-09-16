import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { contentRepository } from "@/repositories/contentRepository";
import {
  Mountain,
  Sun,
  Droplet,
  Compass,
  Sprout,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Farm Story: High-Altitude Regenerative Agriculture | Stakna Farmhouse",
  description:
    "Discover how our 2-acre plot in Stakna, Ladakh uses Indus glacial meltwater and passive solar earth-bermed greenhouses to grow organic mountain produce at 3,250m.",
};

export default async function FarmStoryPage() {
  const contentBlock = await contentRepository.getByKey("farm-story");

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-35">
            <Image
              src="/images/stakna-valley.jpg"
              alt="Stakna Farmhouse along the Indus River"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-6 border border-amber-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Our Origins · Stakna Valley, Ladakh</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
              High-Altitude Regenerative Agriculture at 3,250 Meters
            </h1>
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
              Nurtured by Indus glacial meltwater and 300+ days of intense Himalayan sunlight. A 2-acre living experiment in soil regeneration, passive solar resilience, and cold-desert vitality.
            </p>
          </div>
        </section>

        {/* Fact Sheet Key Metrics */}
        <section className="bg-[#292524] border-b border-stone-800 text-stone-300 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  {contentBlock?.metadata?.elevation || "3,250 m"}
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Elevation Above Sea Level
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  {contentBlock?.metadata?.acreage || "2 Acres"}
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Stakna Hillside Plot
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  300+ Days
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Pure Himalayan Sunlight
                </div>
              </div>

              <div className="p-4">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  0 Chemical Inputs
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                  Natural Living Soil
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Narrative */}
        <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 leading-relaxed text-stone-700 text-sm sm:text-base font-light">
            {/* Chapter 1 */}
            <div>
              <span className="text-[#B45309] font-bold text-xs uppercase tracking-widest block mb-2">
                Chapter 1 · The Land
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mb-4">
                Surrounded by Granite and Monastery Rhythms
              </h2>
              <p className="mb-4">
                Across the valley, the whitewashed stupas and red battlements of the 16th-century Stakna Monastery (&ldquo;Tiger&rsquo;s Nose&rdquo;) stand sentinel over the Indus River. Our 2-acre plot sits directly on fertile river terrace benches, where ancient Himalayan silt meets crystalline alpine air.
              </p>
              <p>
                Currently in its early land-development stage, we are systematically revitalizing the soil through rotational clover green cover, indigenous cattle compost, and microbial bio-inoculants, creating a resilient oasis in the rain-shadow desert of Ladakh.
              </p>
            </div>

            {/* Chapter 2 */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3 text-amber-800 text-xs font-bold uppercase mb-2">
                <Droplet className="w-4 h-4 text-[#B45309]" />
                <span>Glacial Hydrology</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917] mb-4">
                Glacial Meltwater Through Stone Channels
              </h2>
              <p className="text-stone-600 mb-4 text-xs sm:text-sm">
                With annual precipitation below 100 millimeters, agriculture in Ladakh is an art of water stewardship. In spring and summer, the high-altitude glaciers feeding the Stakna nallah melt under direct solar heat.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm">
                This pure mineral-rich water is guided via stone *yura* (irrigation channels) directly into our gravity-fed micro-drip networks, hydrating roots with zero pumping fossil fuel emissions.
              </p>
            </div>

            {/* Chapter 3 */}
            <div>
              <span className="text-[#B45309] font-bold text-xs uppercase tracking-widest block mb-2">
                Chapter 2 · The Innovation
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mb-4">
                Passive Solar Earth-Bermed Greenhouses
              </h2>
              <p className="mb-4">
                When winter envelopes Ladakh in -20°C frost and snow locks the high passes, the high-altitude sun remains brilliant and unfiltered. We harness this physics through passive solar greenhouses built into the earth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 text-xs">
                  <h3 className="font-serif font-bold text-stone-900 text-sm mb-2">
                    Thermal Mass Rammed-Earth Walls
                  </h3>
                  <p className="text-stone-600">
                    50cm thick rammed earth and local stone walls face south to absorb radiant thermal energy all afternoon, slowly releasing warmth through sub-zero nights.
                  </p>
                </div>
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 text-xs">
                  <h3 className="font-serif font-bold text-stone-900 text-sm mb-2">
                    Year-Round Sub-Zero Harvests
                  </h3>
                  <p className="text-stone-600">
                    Enables uninterrupted harvesting of crisp mountain spinach, curly kale, coriander, and winter greens even when the Indus River freezes over.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 4 */}
            <div>
              <span className="text-[#B45309] font-bold text-xs uppercase tracking-widest block mb-2">
                Chapter 3 · The Cycle
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mb-4">
                The Four Himalayan Seasons of Stakna
              </h2>
              <div className="space-y-4">
                <div className="border-l-2 border-amber-600 pl-4">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    Spring (Sping-ka) · April – May
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Apricot blossoms erupt across the valley in pink and white. Seedbeds are prepared, saplings grafted, and cold-hardy greens planted under open skies.
                  </p>
                </div>
                <div className="border-l-2 border-amber-600 pl-4">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    Summer (Yar-kha) · June – August
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Peak growth season. Glacier melt is abundant. We harvest sun-ripened tomatoes, sweet peppers, marigolds, and fresh garden herbs daily.
                  </p>
                </div>
                <div className="border-l-2 border-amber-600 pl-4">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    Autumn (Ston-ka) · September – October
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    The golden harvest. Apricots sun-dry on rooftops, apples are harvested, and raw Pashmina fleeces arrive from Changthang for washing and sorting.
                  </p>
                </div>
                <div className="border-l-2 border-amber-600 pl-4">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    Winter (Dgun-ka) · November – March
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Quiet resilience. Artisans spin Pashmina on wooden charkhas beside bukhari stoves while passive solar greenhouses provide fresh weekly greens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 bg-[#1C1917] text-white p-8 sm:p-12 rounded-3xl text-center">
            <h3 className="font-serif font-bold text-2xl mb-3">Experience the Harvest in Person</h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 font-light">
              Visit our fields, touch the soil, and taste mountain-grown produce picked fresh from the vine.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
              <Link
                href="/vegetables"
                className="bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
              >
                <span>Browse Fresh Harvest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/flowers"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/20 transition-colors"
              >
                Schedule Garden Visit
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
