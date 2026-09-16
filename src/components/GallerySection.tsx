"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS, GalleryItem } from "@/data/farmhouseData";
import { Camera, X, Eye } from "lucide-react";

export default function GallerySection() {
  const [filter, setFilter] = useState<string>("all");
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = [
    { label: "All Captures", value: "all" },
    { label: "The Property", value: "property" },
    { label: "Suites", value: "suites" },
    { label: "Organic Dining", value: "dining" },
    { label: "Stakna Valley", value: "surroundings" },
  ];

  const filteredItems =
    filter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFE9DD] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Journal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight mb-4">
            Vignettes of Yarkha
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] font-light">
            Glimpses into our earthen retreat, sunlit suites, and the timeless vistas of the Indus valley.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                filter === cat.value
                  ? "bg-[#1C1917] text-white shadow-md"
                  : "bg-white text-[#57534E] hover:bg-stone-200/70 border border-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="relative aspect-[16/11] rounded-2xl overflow-hidden cursor-pointer shadow-lg group border border-stone-200/60"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white backdrop-blur-[2px]">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 self-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-serif font-bold text-lg leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close image lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={activeImage.image}
                alt={activeImage.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 bg-[#1C1917] text-white">
              <h3 className="font-serif text-2xl font-bold text-amber-200 mb-2">
                {activeImage.title}
              </h3>
              <p className="text-sm text-stone-300 font-light leading-relaxed">
                {activeImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
