"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FARMHOUSE_INFO } from "@/data/farmhouseData";
import { Phone, Calendar, Menu, X, Compass } from "lucide-react";

interface NavbarProps {
  onOpenBooking: (roomId?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Farmhouse", href: "#about" },
    { name: "Suites", href: "#suites" },
    { name: "Organic Dining", href: "#dining" },
    { name: "Experiences", href: "#experiences" },
    { name: "Gallery", href: "#gallery" },
    { name: "Location", href: "#location" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E7E0D3] py-3.5 text-[#1C1917]"
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] transition-colors duration-300 ${
                isScrolled ? "text-[#1C1917] group-hover:text-[#B45309]" : "text-white group-hover:text-[#FBBF24]"
              }`}
            >
              {FARMHOUSE_INFO.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          </div>
          <span
            className={`text-[10px] tracking-[0.2em] uppercase font-sans font-medium transition-colors ${
              isScrolled ? "text-[#78716C]" : "text-white/80"
            }`}
          >
            Stakna · Indus Valley · Ladakh
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.15em] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D97706] hover:after:w-full after:transition-all after:duration-300 ${
                isScrolled
                  ? "text-[#44403C] hover:text-[#B45309]"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${FARMHOUSE_INFO.phone}`}
            className={`flex items-center gap-1.5 text-xs font-medium tracking-wider transition-colors ${
              isScrolled ? "text-[#57534E] hover:text-[#B45309]" : "text-white/90 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{FARMHOUSE_INFO.phone}</span>
          </a>

          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-xs uppercase tracking-[0.15em] font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve Stay</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#B45309] text-white text-xs font-medium px-3 py-1.5 rounded-full"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isScrolled ? "text-[#1C1917] hover:bg-stone-200/60" : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E7E0D3] px-6 py-6 text-[#1C1917] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4 text-sm font-medium tracking-wider uppercase">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200 hover:text-[#B45309] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#B45309] text-white text-center py-3 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Stay</span>
            </button>
            <a
              href={`tel:${FARMHOUSE_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 text-xs text-[#57534E] border border-stone-300 rounded-full font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Call: {FARMHOUSE_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
