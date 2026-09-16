"use client";

import React from "react";
import Image from "next/image";
import { Utensils, Apple, Flame, Sparkles, Coffee } from "lucide-react";

export default function DiningSection() {
  const diningPillars = [
    {
      title: "Estate Harvested Daily",
      desc: "Vegetables and herbs picked minutes before cooking from our solar greenhouse and organic raised beds.",
      icon: Apple,
    },
    {
      title: "Wood-Fired Khambir Bread",
      desc: "Fermented Ladakhi sourdough flatbread baked fresh every dawn in our traditional earthen hearth.",
      icon: Flame,
    },
    {
      title: "Apricot & Sea Buckthorn",
      desc: "Rich nectar from wild Himalayan sea buckthorn and sweet sundried apricots from our century-old trees.",
      icon: Sparkles,
    },
    {
      title: "Traditional Butter Tea & Herbal Brews",
      desc: "Freshly churned Gur-Gur Cha alongside calming wild chamomile and mint infusions picked along the Indus.",
      icon: Coffee,
    },
  ];

  return (
    <section id="dining" className="py-24 sm:py-32 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE9DD] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4 w-fit">
              <Utensils className="w-3.5 h-3.5" />
              <span>Soil-to-Soul Culinary</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight mb-6">
              Organic Farm-to-Table Nourishment
            </h2>

            <p className="text-base sm:text-lg text-[#57534E] font-light leading-relaxed mb-8">
              Dining at Yarkha is a direct dialogue with the fertile soil of the Indus river basin. We cultivate our own heirloom barley, leafy greens, wild mountain mint, and sweet apricots, preparing soul-satisfying Ladakhi and global dishes in our solar kitchen.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              {diningPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-[#B45309] border border-amber-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#1C1917]">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#78716C] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
              <Image
                src="/images/dining.jpg"
                alt="Organic orchard dining at Yarkha Stakna Farmhouse"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-semibold text-amber-300 tracking-widest block mb-1">
                  Al-Fresco Orchard Breakfast
                </span>
                <p className="font-serif text-lg font-medium">
                  Savor meals accompanied by the gentle morning breeze and views of snow-covered Stok Kangri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
