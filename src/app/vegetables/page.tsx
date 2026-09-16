import React from "react";
import type { Metadata } from "next";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import { Sparkles, Carrot, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Fresh Organic Vegetables in Leh, Ladakh | Yarkha Farm",
  description:
    "Order crisp, high-altitude organic vegetables grown in Stakna greenhouses. Same-day harvest and delivery across Leh, Choglamsar, and Indus Valley.",
  keywords: [
    "fresh vegetables in Leh",
    "organic farm vegetables Ladakh",
    "Stakna farm produce",
    "greenhouse vegetables Leh",
    "local farm vegetables Ladakh",
  ],
};

export const dynamic = "force-dynamic";

export default async function VegetablesPage() {
  const result = await productRepository.list({
    productType: PRODUCT_TYPES.VEGETABLE,
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Daily Morning Harvest</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
                Fresh Organic Vegetables
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                Grown at 3,200m in our passive solar greenhouses and open terraces in Stakna. Irrigated with pure Indus glacial waters without chemical sprays.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>2:00 PM Order Cutoff</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Leh & Indus Valley Delivery</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Safe Atomic Stock Reservation</span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
