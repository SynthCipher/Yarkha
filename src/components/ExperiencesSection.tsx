"use client";

import React from "react";
import Image from "next/image";
import { EXPERIENCES, Experience } from "@/data/farmhouseData";
import { Sun, Compass, Utensils, Moon, Clock, Check } from "lucide-react";

export default function ExperiencesSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-amber-500" />;
      case "Utensils":
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case "Moon":
        return <Moon className="w-5 h-5 text-amber-500" />;
      default:
        return <Compass className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section id="experiences" className="py-24 sm:py-32 bg-[#1C1917] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-stone-700">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Himalayan Journeys</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight mb-6">
            Immersive Experiences at Yarkha
          </h2>
          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed font-sans">
            From dawn prayers echoed across the Indus to midnight stargazing beneath Bortle-1 skies, every moment here connects you deeply with the spirit of Ladakh.
          </p>
        </div>

        {/* 4 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EXPERIENCES.map((item: Experience) => (
            <div
              key={item.id}
              className="bg-[#262220] rounded-3xl overflow-hidden border border-stone-800 flex flex-col group hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#262220] via-black/20 to-transparent" />

                {/* Timing Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-amber-300 border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timing}</span>
                </div>

                {/* Included Badge */}
                {item.included && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-300 border border-emerald-500/30">
                    <Check className="w-3 h-3" />
                    <span>Included with Stay</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700">
                      {getIcon(item.iconName)}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-sans">
                      {item.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
