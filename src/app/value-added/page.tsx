import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import { Package, ShieldCheck, Truck, Sparkles, Sun, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Artisanal Ladakhi Farm Goods & Preserves | Stakna Farmhouse",
  description:
    "Wild Himalayan seabuckthorn jam, sulfur-free sun-dried Halman apricots, stone-ground Tsampa, and herbal teas. Pan-India courier available.",
  keywords: [
    "seabuckthorn jam Ladakh",
    "dried apricots Ladakh",
    "organic Tsampa Leh",
    "Ladakh organic products",
    "Himalayan value added products",
    "Stakna Farmhouse preserves",
  ],
};

export const dynamic = "force-dynamic";

export default async function ValueAddedPage() {
  const result = await productRepository.list({
    productType: PRODUCT_TYPES.VALUE_ADDED,
    limit: 50,
  });
  const products = JSON.parse(JSON.stringify(result.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 mb-12 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Truck className="w-3.5 h-3.5" />
                <span>Section 4 · Shippable Pan-India</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
                Artisanal Farm Preserves & Superfoods
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                Prepared from heirloom fruit orchards and wild Indus riverbank berries. Naturally preserved using traditional Himalayan techniques without artificial preservatives or sulfur.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-6 mt-6 border-t border-white/10 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Additive & Chemical Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Naturally Solar-Dried on Rooftops</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Pan-India Courier Safe</span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                Pantry Staples & Dried Fruits
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                Shippable across all Indian postal codes
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <Package className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-serif font-bold text-stone-800">Preserves Currently in Bottling</h3>
                <p className="text-xs text-stone-500 mt-1">Our autumn preserves batch will be released soon.</p>
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
