import React from "react";
import type { Metadata } from "next";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import { Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Weekly Farm Harvest Baskets in Leh, Ladakh | Yarkha Farm",
  description:
    "Subscribe to weekly curated boxes of organic vegetables, culinary herbs, and farm preserves delivered directly to households and restaurants in Leh.",
};

export const dynamic = "force-dynamic";

export default async function FarmBasketsPage() {
  const result = await productRepository.list({
    productType: PRODUCT_TYPES.BASKET,
    limit: 10,
  });
  const products = JSON.parse(JSON.stringify(result.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subscription & Family Bundles</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
              Weekly Farm Harvest Baskets
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              Eliminate daily grocery friction. Enjoy a weekly curated crate containing the season’s best greens, roots, salad greens, and kitchen herbs delivered fresh to your door every week.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>15% savings compared to individual items</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Flexible pause or cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Priority early morning harvest delivery</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
