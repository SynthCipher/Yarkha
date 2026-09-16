"use client";

import React from "react";
import Link from "next/link";
import { FARMHOUSE_INFO } from "@/data/farmhouseData";
import {
  MapPin,
  Phone,
  Mail,
  Compass,
  ArrowUpRight,
  Heart,
  Navigation,
} from "lucide-react";

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer id="location" className="bg-[#141210] text-stone-300 pt-20 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Banner */}
        <div className="bg-gradient-to-r from-stone-900 to-[#1C1917] rounded-3xl p-8 sm:p-12 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 shadow-2xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-400 block mb-2 font-sans">
              Experience Himalayan Serenity
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
              Ready to Escape to Stakna?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light font-sans">
              Book direct with us for complimentary airport transfers, organic farm breakfasts, and private sunrise monastery visits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={onOpenBooking}
              className="bg-[#B45309] hover:bg-[#92400E] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold shadow-lg transition-all"
            >
              Check Availability
            </button>
            <a
              href={`https://wa.me/${FARMHOUSE_INFO.whatsapp}?text=${encodeURIComponent("Julley! I would like to inquire about staying at Yarkha (Stakna Farmhouse).")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-4 rounded-full text-xs uppercase tracking-widest font-medium border border-stone-700 flex items-center justify-center gap-2 transition-all"
            >
              <span>WhatsApp Us</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-stone-800 text-xs leading-relaxed font-sans">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div>
              <span className="text-2xl font-serif font-bold text-white tracking-[0.2em] block">
                {FARMHOUSE_INFO.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-400 font-medium">
                {FARMHOUSE_INFO.tagline}
              </span>
            </div>
            <p className="text-stone-400 font-light">
              An eco-luxury retreat situated where the iconic Tiger’s Nose rock of Stakna meets the tranquil waters of the sacred Indus River.
            </p>
            <div className="text-[11px] text-stone-400 pt-2">
              <span className="block font-semibold text-white">Altitude:</span>
              <span>{FARMHOUSE_INFO.altitude}</span>
            </div>
          </div>

          {/* Column 2: Location & Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white font-sans">
              Location & Access
            </h4>
            <div className="flex items-start gap-2.5 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{FARMHOUSE_INFO.locationName}</span>
            </div>
            <div className="flex items-start gap-2.5 text-stone-400">
              <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Coordinates: {FARMHOUSE_INFO.coordinates}</span>
            </div>
            <p className="text-stone-500 pt-1">
              {FARMHOUSE_INFO.distanceToAirport}
            </p>
          </div>

          {/* Column 3: Nearby Monasteries */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white font-sans">
              Nearby Circuit
            </h4>
            <ul className="space-y-2 text-stone-400">
              {FARMHOUSE_INFO.nearbyLandmarks.map((landmark, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{landmark}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white font-sans">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2 text-stone-300">
              <Phone className="w-4 h-4 text-amber-400" />
              <a href={`tel:${FARMHOUSE_INFO.phone}`} className="hover:text-amber-300 transition-colors">
                {FARMHOUSE_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <Mail className="w-4 h-4 text-amber-400" />
              <a href={`mailto:${FARMHOUSE_INFO.email}`} className="hover:text-amber-300 transition-colors">
                {FARMHOUSE_INFO.email}
              </a>
            </div>
            <div className="pt-2">
              <p className="text-[11px] text-stone-500">
                Operating Season: May 1st to October 31st (Summer & Autumn), and Special Winter Stays upon request.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Yarkha (Stakna Farmhouse). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Sustainability Charter
            </span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Guest Guidelines
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
