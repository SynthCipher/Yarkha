"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, Heart, Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

export default function StoreFooter() {
  return (
    <footer className="bg-[#141210] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-xs font-sans leading-relaxed">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-serif font-bold text-white tracking-[0.2em]">
                STAKNA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
              <span className="text-xs uppercase font-semibold text-amber-400">
                FARMHOUSE
              </span>
            </div>
            <p className="text-stone-400 font-light leading-relaxed">
              High-altitude organic agriculture on a 2-acre plot in Stakna along the sacred Indus River. We cultivate crisp greens, Himalayan blooms, native fruit saplings, artisanal preserves, and authentic Changthang Pashmina.
            </p>
            <div className="text-[11px] text-stone-400 space-y-1">
              <div>
                <span className="font-semibold text-white">Plot Elevation:</span> 3,250m / 10,660ft
              </div>
              <div>
                <span className="font-semibold text-white">Status:</span> Early Land-Development Stage
              </div>
            </div>
          </div>

          {/* Six Business Sections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">
              The Six Farm Sections
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/vegetables" className="hover:text-amber-300 transition-colors">
                  1. Fresh Organic Vegetables (Daily)
                </Link>
              </li>
              <li>
                <Link href="/flowers" className="hover:text-amber-300 transition-colors">
                  2. Flowers & Garden Visits
                </Link>
              </li>
              <li>
                <Link href="/saplings" className="hover:text-amber-300 transition-colors text-amber-400/90 font-medium">
                  3. Fruit & Tree Saplings (Apricot/Apple)
                </Link>
              </li>
              <li>
                <Link href="/value-added" className="hover:text-amber-300 transition-colors">
                  4. Value-Added Farm Pantry (Pan-India)
                </Link>
              </li>
              <li>
                <Link href="/pashmina" className="hover:text-amber-300 transition-colors text-amber-400/90 font-medium">
                  5. Heritage Pashmina Wool (Kharnak)
                </Link>
              </li>
              <li>
                <Link href="/farmstay" className="hover:text-amber-300 transition-colors">
                  6. Eco-Farmstay Retreat (Preview)
                </Link>
              </li>
            </ul>
          </div>

          {/* Stories & Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">
              Stories & Tracking
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/farm-story" className="hover:text-amber-300 transition-colors text-stone-200 font-medium">
                  ★ Farm Story: 2-Acre Stakna Land
                </Link>
              </li>
              <li>
                <Link href="/pashmina-heritage" className="hover:text-amber-300 transition-colors text-stone-200 font-medium">
                  ★ Pashmina Heritage: Nomads of Changthang
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-amber-300 transition-colors font-medium text-amber-400">
                  Track My Orders (Guest & Member)
                </Link>
              </li>
              <li>
                <Link href="/custom-flowers" className="hover:text-amber-300 transition-colors">
                  Bespoke Event & Wedding Florals
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-300 transition-colors">
                  Farm Journal & High-Altitude Agriculture
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Orders */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">
              Contact & Location
            </h4>
            <div className="flex items-center gap-2 text-stone-300">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <a href={`tel:${APP_CONFIG.contact.phone}`} className="hover:text-amber-300">
                {APP_CONFIG.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <a
                href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300"
              >
                WhatsApp Direct Inquiries
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <a href={`mailto:${APP_CONFIG.contact.email}`} className="hover:text-amber-300">
                {APP_CONFIG.contact.email}
              </a>
            </div>
            <div className="flex items-start gap-2 text-stone-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{APP_CONFIG.contact.address}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Stakna Farmhouse (Ladakh). High-altitude organic agriculture & heritage Pashmina.</p>
          <div className="flex items-center gap-4">
            <Link href="/farm-story" className="hover:text-stone-300 transition-colors">
              Our Land
            </Link>
            <Link href="/pashmina-heritage" className="hover:text-stone-300 transition-colors">
              Pashmina Provenance
            </Link>
            <Link href="/how-it-works" className="hover:text-stone-300 transition-colors">
              Delivery Zones in Leh
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
