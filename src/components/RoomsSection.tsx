"use client";

import React from "react";
import Image from "next/image";
import { ROOMS, Room } from "@/data/farmhouseData";
import {
  Maximize2,
  Users,
  Eye,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";

interface RoomsSectionProps {
  onSelectRoom: (roomId: string) => void;
}

export default function RoomsSection({ onSelectRoom }: RoomsSectionProps) {
  return (
    <section id="suites" className="py-24 sm:py-32 bg-[#F3EDE2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DEC9] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Sanctuary</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
              Suites Designed for High-Altitude Serenity
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#57534E] max-w-md font-light">
            Each bespoke suite is an intimate sanctuary with panoramic mountain or river views, heated stone bathrooms, and private balconies warmed by the Ladakhi sun.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ROOMS.map((room: Room) => (
            <div
              key={room.id}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Room Image Container */}
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Nightly Rate Badge */}
                <div className="absolute top-4 right-4 bg-[#1C1917]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white flex items-baseline gap-1 shadow-lg">
                  <span className="text-base font-serif font-bold text-amber-300">
                    {room.priceFormatted}
                  </span>
                  <span className="text-[10px] uppercase font-sans text-stone-300 tracking-wider">
                    / night
                  </span>
                </div>

                {/* View Tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#1C1917]">
                  <Eye className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{room.view}</span>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-1 group-hover:text-[#B45309] transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#92400E] font-medium mb-4">
                    {room.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6 font-light">
                    {room.description}
                  </p>

                  {/* Room Meta (Size & Occupancy) */}
                  <div className="flex items-center gap-6 py-3 border-y border-stone-200/80 mb-6 text-xs text-[#78716C]">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-[#B45309]" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#B45309]" />
                      <span>{room.occupancy}</span>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-2 mb-8">
                    <p className="text-[11px] uppercase font-bold tracking-widest text-[#78716C]">
                      Suite Highlights
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-[#44403C]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => onSelectRoom(room.id)}
                  className="w-full bg-[#1C1917] hover:bg-[#B45309] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md group-hover:shadow-lg"
                >
                  <span>Reserve This Suite</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
