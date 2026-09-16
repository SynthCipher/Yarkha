import React from "react";
import type { Metadata } from "next";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { productRepository } from "@/repositories/productRepository";
import { PRODUCT_TYPES } from "@/config/constants";
import { Calendar, Sun, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Seasonal Produce & High-Altitude Crops | Yarkha Farm Ladakh",
  description:
    "Follow Ladakh's agricultural rhythm from spring barley shoots to autumn Halman apricot harvests and winter greenhouse greens.",
};

export const dynamic = "force-dynamic";

export default async function SeasonalPage() {
  const result = await productRepository.list({
    productType: PRODUCT_TYPES.SEASONAL,
    limit: 50,
  });
  const products = JSON.parse(JSON.stringify(result.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ladakhi Agricultural Seasons</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
              Seasonal Himalayan Produce
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
              In Ladakh, every month brings a distinct harvest. From early spring tender shoots to late summer apricot tree harvests and frost-hardy winter greens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-4 text-center py-16 bg-white rounded-3xl border border-stone-200">
                <Sun className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  Upcoming Autumn Harvest
                </h3>
                <p className="text-xs text-[#78716C] max-w-md mx-auto mt-2">
                  Our next seasonal flush of sweet apples and late-season root turnips is currently maturing on the Stakna terraces. Check back shortly!
                </p>
              </div>
            ) : (
              products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
