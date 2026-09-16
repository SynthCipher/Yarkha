import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Award,
  Layers,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Authentic Changthang Pashmina Wool | Stakna Farmhouse Ladakh",
  description:
    "100% genuine Changra goat cashmere directly sourced from Kharnak nomadic herders. Handspun on traditional charkhas and handwoven by Ladakhi master artisans.",
  keywords: [
    "Ladakh Pashmina",
    "Changthang Cashmere",
    "Kharnak Pashmina stole",
    "Handspun Pashmina shawl",
    "Genuine GI Pashmina India",
    "Stakna Farmhouse Wool",
  ],
};

export default async function PashminaPage() {
  const pashminaData = await productRepository.list({
    productType: PRODUCT_TYPES.PASHMINA,
    limit: 12,
  });

  const products = JSON.parse(JSON.stringify(pashminaData.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image
              src="/images/suite-riverfront.jpg"
              alt="Artisanal Pashmina Weaving at Stakna"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-4 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Section 5 · High-Altitude Heritage Textiles</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-5 leading-tight">
                Authentic Kharnak Changthang Pashmina
              </h1>
              <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed mb-8">
                Harvested from Changra goats grazing at 4,800+ meters on the windswept Changthang plateau. Hand-combed during the spring molt, meticulously de-haired, and spun on traditional Ladakhi wooden charkhas (Yender) by our village artisan collective in Stakna.
              </p>

              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>&lt; 14.5 Micron Superfine Cashmere</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Complimentary Insured Shipping Pan-India</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>Direct Artisan Fair-Wage Sourcing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Teaser & Origin Badge Bar */}
        <section className="bg-[#292524] text-stone-300 py-6 border-y border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-white font-serif font-bold text-base sm:text-lg">
                  Traceable from Kharnak Herders to Finished Loom
                </h2>
                <p className="text-xs text-stone-400">
                  Zero chemical bleach, zero nylon blend. Pure unadulterated high-mountain luxury.
                </p>
              </div>
            </div>

            <Link
              href="/pashmina-heritage"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full transition-all shrink-0"
            >
              <span>Read Pashmina Heritage Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-200">
            <div>
              <span className="text-[#B45309] text-xs font-bold uppercase tracking-wider">
                Limited Artisanal Batches
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917] mt-1">
                Handcrafted Stoles, Shawls & Raw Spun Skeins
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-2 md:mt-0">
              Each piece requires up to 180 hours of hand spinning and weaving. Delivered in protective cedar storage pouches with certificate of Changthang provenance.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">Currently Being Loomed</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                Our winter weaving batch is in progress. Please check back shortly or write to us for bespoke commissions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <div key={product._id} className="flex flex-col">
                  <ProductCard product={product} />
                  {product.pashminaHeritage && (
                    <div className="mt-3 bg-stone-100/80 rounded-xl p-3.5 text-[11px] border border-stone-200 text-stone-700 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Origin: {product.pashminaHeritage.origin}</span>
                      </div>
                      {product.pashminaHeritage.artisanNotes && (
                        <p className="italic text-stone-600">
                          &ldquo;{product.pashminaHeritage.artisanNotes}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pashmina Care Guide Section */}
        <section className="bg-white py-16 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#B45309] text-xs font-bold uppercase tracking-widest">
                Longevity & Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-1">
                How to Care for Your Heirloom Pashmina
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                Handspun Ladakhi cashmere softens with age when treated with traditional reverence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold font-serif mb-4">
                  1
                </div>
                <h3 className="font-serif font-bold text-stone-900 mb-2">Gentle Cold Washing</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Dry clean recommended, or hand bathe in lukewarm water with natural soap nuts or olive-oil detergent. Never twist, wring, or agitate aggressively.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold font-serif mb-4">
                  2
                </div>
                <h3 className="font-serif font-bold text-stone-900 mb-2">Flat Towel Drying</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Roll within a dry cotton towel to extract moisture, then lay flat in the shade away from direct Himalayan sun or artificial radiators.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold font-serif mb-4">
                  3
                </div>
                <h3 className="font-serif font-bold text-stone-900 mb-2">Cedar Wood Storage</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Store folded in breathable muslin or the provided cotton bag with natural cedar wood balls. Avoid synthetic plastic covers to prevent fiber suffocation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
