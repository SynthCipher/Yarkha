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
  Sprout,
  Sun,
  Calendar,
  Mountain,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fruit Tree & Vegetable Saplings | Stakna Farmhouse Ladakh",
  description:
    "Hardy 2-year grafted Ladakhi apricot, apple, and greenhouse vegetable saplings grown on our 2-acre Stakna plot for high-altitude Himalayan orchards.",
};

export default async function SaplingsPage() {
  const saplingsData = await productRepository.list({
    productType: PRODUCT_TYPES.SAPLING,
    limit: 12,
  });

  const saplings = JSON.parse(JSON.stringify(saplingsData.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* Hero Banner */}
        <section className="relative py-16 sm:py-24 bg-[#1C1917] text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-35">
            <Image
              src="/images/hero.jpg"
              alt="High-Altitude Fruit Tree Saplings at Stakna Farmhouse"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-4 border border-amber-400/30">
                <Sprout className="w-3.5 h-3.5" />
                <span>Section 3 · High-Altitude Nursery</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white mb-4">
                Fruit & Vegetable Saplings for Ladakh Orchards
              </h1>
              <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed mb-6">
                Cold-hardened at 3,250m elevation with glacial meltwater. We propagate certified 2-year grafted sweet Halman apricots, GI-tagged Raktsey Karpo white apricots, crisp apple rootstocks, and solar-greenhouse vegetable starts.
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Planting Season: Spring & Autumn</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Local Pickup at Stakna or Leh Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planting Advice Notice */}
        <section className="bg-amber-50/70 border-y border-amber-200/80 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0" />
              <span>
                <strong>Himalayan Acclimatization:</strong> Every sapling is nurtured outdoors in Stakna soil, ensuring 95%+ survival rate compared to lowland nursery transplants.
              </span>
            </div>
            <Link
              href="/how-it-works"
              className="text-[#B45309] hover:text-[#92400E] font-bold underline shrink-0"
            >
              View Local Delivery Zones in Leh
            </Link>
          </div>
        </section>

        {/* Saplings Catalog Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309]">
                  Available Rootstocks
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-1">
                  Organic Saplings & Starts
                </h2>
              </div>
              <span className="text-xs text-[#78716C]">
                {saplings.length} varieties ready for planting
              </span>
            </div>

            {saplings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Sprout className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                  New Sapling Batch Coming Soon
                </h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
                  Our nursery team is currently preparing spring rootstocks. Sign up or contact us for early bulk orchard bookings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {saplings.map((product: any) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Nursery Tips Card */}
        <section className="py-12 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
              <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Pit Preparation in Ladakh
                </h4>
                <p className="text-[#78716C]">
                  Dig 3ft x 3ft planting pits in autumn or early spring. Mix 50% native sandy loam with 50% aged fermented yak or cow manure for rapid root anchoring.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Watering with Glacial Melt
                </h4>
                <p className="text-[#78716C]">
                  Water thoroughly upon planting. In Ladakh's dry wind, create a shallow earthen saucer basin around the stem base to retain moisture without rotting the collar.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Frost & Winter Protection
                </h4>
                <p className="text-[#78716C]">
                  During young saplings&apos; first winter, wrap lower trunks in natural burlap cloth or whitewash with lime to prevent frost cracking caused by intense daytime reflection.
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
