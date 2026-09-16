import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import GardenVisitButton from "@/components/store/GardenVisitButton";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import { Flower, Sparkles, Heart, ArrowRight, MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Fresh Flowers & Garden Visits in Leh, Ladakh | Stakna Farmhouse",
  description:
    "Hand-picked mountain blooms, monastery altar marigolds, event florals, and guided riverside garden walks in Stakna, Ladakh.",
  keywords: [
    "fresh flowers in Leh",
    "flower delivery in Leh",
    "wedding flowers Ladakh",
    "monastery flowers Leh",
    "Stakna flower garden tour",
  ],
};

export const dynamic = "force-dynamic";

export default async function FlowersPage() {
  const result = await productRepository.list({
    productType: PRODUCT_TYPES.FLOWER,
    limit: 50,
  });
  const products = JSON.parse(JSON.stringify(result.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Flower className="w-3.5 h-3.5" />
                <span>Section 2 · Indus Riverbank Floral Studio</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
                Fresh Blooms & Altar Florals
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                Vibrant saffron marigolds, golden sunflowers, cosmos, and fragrant mountain lavender harvested fresh at dawn for monastery altars, home sanctums, and celebrations.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <GardenVisitButton label="Schedule Free Garden Visit" />
                <Link
                  href="/custom-flowers"
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-5 rounded-full text-xs uppercase tracking-widest font-semibold border border-white/20 transition-all inline-flex items-center gap-2"
                >
                  <span>Event & Wedding Inquiries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center max-w-xs relative z-10">
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Come Walk the Terraces
              </h3>
              <p className="text-xs text-stone-300 mb-4 font-light">
                Experience high-altitude blooms against the backdrop of Stakna Monastery and the Indus River.
              </p>
              <GardenVisitButton
                className="w-full bg-white text-[#1C1917] hover:bg-stone-100 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                label="Book a Visit"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                Today&apos;s Fresh Flower Harvest
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                Daily local delivery across Leh Valley
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <Flower className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-serif font-bold text-stone-800">Fresh Harvest in Preparation</h3>
                <p className="text-xs text-stone-500 mt-1">Our morning cut flowers will be updated shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
