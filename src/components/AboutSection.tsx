"use client";

import React from "react";
import Image from "next/image";
import { Sun, Droplets, Home, Compass, Feather } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE9DD] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <Feather className="w-3.5 h-3.5" />
            <span>Heritage & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight mb-6">
            Where the Tiger’s Nose Meets the Whispering Indus
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] font-light leading-relaxed">
            In Ladakhi, <span className="font-medium text-[#1C1917]">Stakna</span> translates to &ldquo;Tiger&rsquo;s Nose&rdquo; &mdash; named after the singular rocky promontory that rises from the riverbed. At its base rests <span className="font-semibold text-[#B45309]">Yarkha</span>, an eco-conscious luxury retreat celebrating ancestral Ladakhi earthen building traditions and peaceful high-altitude seclusion.
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic Photography with Floating Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] border-4 border-white">
              <Image
                src="/images/stakna-valley.jpg"
                alt="Stakna Monastery and the Indus River valley"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
                  The Sacred Promontory
                </p>
                <p className="font-serif text-lg sm:text-xl font-medium">
                  Stakna Monastery, founded in the late 16th century by Bhutanese saint Chosje Jamyang Palkar.
                </p>
              </div>
            </div>

            {/* Floating Info Tag */}
            <div className="hidden sm:flex absolute -bottom-8 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-200/80 max-w-xs items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#B45309] shrink-0 border border-amber-200">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1C1917]">
                  Pristine Microclimate
                </h4>
                <p className="text-xs text-[#78716C] leading-snug mt-1">
                  Surrounded by natural riverbanks and willow trees, creating cooler summers and rich oxygen levels.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-4">
                Earth, Sun & Reclaimed Timber
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                Rather than concrete, Yarkha is built using ancient rammed-earth (<em>gyang</em>) walls 18 inches thick. This creates a natural thermal flywheel: absorbing the fierce daytime Himalayan sun and gently releasing warmth throughout crisp starry nights.
              </p>
            </div>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#B45309] shrink-0 mt-1">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#1C1917]">
                    100% Passive Solar Design
                  </h4>
                  <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed">
                    South-oriented architecture with solar hot water systems and rooftop photo-voltaic cells keeping your stay warm and environmentally regenerative.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#B45309] shrink-0 mt-1">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#1C1917]">
                    Glacial Melt & Spring Water
                  </h4>
                  <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed">
                    Pure mineral-rich water filtered naturally from high-altitude glaciers, supplying both the organic farm irrigation and artisan guest carafes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#B45309] shrink-0 mt-1">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#1C1917]">
                    Artisan Carved Poplar & Willow
                  </h4>
                  <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed">
                    Ceilings and pillars crafted by master Ladakhi woodworkers, accented with handwoven sheep wool carpets and brass details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
