"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FARMHOUSE_INFO, ROOMS } from "@/data/farmhouseData";
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Mountain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface HeroSectionProps {
  onSearch: (details: {
    checkIn: string;
    checkOut: string;
    roomId: string;
    guests: number;
  }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  // Default dates: tomorrow and 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const checkoutDefault = new Date(today);
  checkoutDefault.setDate(today.getDate() + 4);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(checkoutDefault));
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
  const [guests, setGuests] = useState(2);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      checkIn,
      checkOut,
      roomId: selectedRoom,
      guests,
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 lg:pb-16 text-white overflow-hidden">
      {/* Background Hero Image with Next/Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt="Yarkha Stakna Farmhouse along the Indus River in Ladakh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Multilayer gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-black/60" />
        <div className="absolute inset-0 bg-stone-900/25 backdrop-brightness-90" />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-center text-center mt-6 sm:mt-12">
        {/* Eyebrow / Location badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-amber-200 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Stakna, Ladakh · 3,200m Elevation</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.08] max-w-5xl text-shadow-lg mb-6">
          Sanctuary on the banks of the sacred{" "}
          <span className="italic font-normal text-amber-200">Indus</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl font-light text-stone-200 max-w-2xl mx-auto leading-relaxed mb-10 text-shadow-sm font-sans">
          Sustainable rammed-earth architecture, organic heirloom orchards, and
          unobstructed vistas of the Stakna Monastery & Stok Kangri range.
        </p>

        {/* Floating Quick Reservation / Availability Bar */}
        <div className="w-full max-w-4xl bg-[#FAF7F2]/95 backdrop-blur-md text-[#1C1917] rounded-3xl sm:rounded-full p-3 sm:p-2.5 shadow-2xl border border-white/40 mb-10 transition-all duration-300">
          <form
            onSubmit={handleQuickSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left"
          >
            {/* Check-In */}
            <div className="flex-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Check-In
              </label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#B45309]" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent font-sans text-sm font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Check-Out */}
            <div className="flex-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Check-Out
              </label>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#B45309]" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent font-sans text-sm font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Suite Selection */}
            <div className="flex-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Suite Choice
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-transparent font-sans text-sm font-semibold text-[#1C1917] focus:outline-none cursor-pointer truncate"
              >
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.replace("The ", "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div className="px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-200 min-w-[100px]">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Guests
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="bg-transparent font-sans text-sm font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-xs sm:text-sm uppercase tracking-widest px-6 py-4 rounded-2xl sm:rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <span>Check Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Feature / Stats Bar along the bottom of the hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 border-t border-white/20 backdrop-blur-sm bg-black/20 rounded-2xl px-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-serif font-bold text-white leading-none mb-1">
                3,200m
              </p>
              <p className="text-xs text-stone-300 font-sans">
                Gentle Indus Valley Elevation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-serif font-bold text-white leading-none mb-1">
                5 Minutes
              </p>
              <p className="text-xs text-stone-300 font-sans">
                Footbridge to Stakna Monastery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-serif font-bold text-white leading-none mb-1">
                100% Organic
              </p>
              <p className="text-xs text-stone-300 font-sans">
                Apricot Orchard & Garden Dining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-serif font-bold text-white leading-none mb-1">
                Bortle-1
              </p>
              <p className="text-xs text-stone-300 font-sans">
                Galactic Milky Way Stargazing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
