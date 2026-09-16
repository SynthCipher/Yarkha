import React from "react";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import GardenVisitButton from "@/components/store/GardenVisitButton";
import { productRepository } from "@/repositories/productRepository";
import { categoryRepository } from "@/repositories/categoryRepository";
import {
  Sparkles,
  ArrowRight,
  Sun,
  Droplets,
  Truck,
  ShieldCheck,
  Award,
  Flower,
  Carrot,
  Package,
  Sprout,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { PRODUCT_TYPES } from "@/config/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [vegetablesData, flowersData, saplingsData, valueAddedData, pashminaData, categories] =
    await Promise.all([
      productRepository.list({ productType: PRODUCT_TYPES.VEGETABLE, limit: 4 }),
      productRepository.list({ productType: PRODUCT_TYPES.FLOWER, limit: 4 }),
      productRepository.list({ productType: PRODUCT_TYPES.SAPLING, limit: 3 }),
      productRepository.list({ productType: PRODUCT_TYPES.VALUE_ADDED, limit: 4 }),
      productRepository.list({ productType: PRODUCT_TYPES.PASHMINA, limit: 3 }),
      categoryRepository.listActive(),
    ]);

  const vegetables = JSON.parse(JSON.stringify(vegetablesData.products));
  const flowers = JSON.parse(JSON.stringify(flowersData.products));
  const saplings = JSON.parse(JSON.stringify(saplingsData.products));
  const valueAdded = JSON.parse(JSON.stringify(valueAddedData.products));
  const pashmina = JSON.parse(JSON.stringify(pashminaData.products));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[88vh] flex items-center justify-center text-white overflow-hidden py-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/hero.jpg"
              alt="Stakna Farmhouse on the banks of the Indus River in Ladakh"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 text-xs tracking-widest uppercase font-semibold text-amber-300 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3,250m High-Altitude Living & Agriculture · Stakna, Ladakh</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.08] mb-6">
                High-Altitude Farm, Living Soil & Authentic{" "}
                <span className="text-amber-300 italic font-normal">Himalayan Heritage</span>.
              </h1>

              <p className="text-base sm:text-lg text-stone-200 font-light leading-relaxed mb-8 max-w-2xl font-sans">
                A 2-acre regenerative farm on the Indus River. We grow certified organic vegetables and blooms in passive solar greenhouses, nurture cold-hardy fruit saplings, preserve mountain berries, and craft genuine handspun Changthang Pashmina.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/vegetables"
                  className="bg-[#B45309] hover:bg-[#92400E] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl transition-all"
                >
                  <span>Shop Fresh Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <GardenVisitButton
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all"
                  label="Visit the Garden"
                />

                <Link
                  href="/farmstay"
                  className="bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 px-6 py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>Farmstay Preview</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/20 text-xs text-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Passive Solar</p>
                    <p className="text-[11px] text-stone-300">Sub-Zero Greenhouses</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Glacial Melt</p>
                    <p className="text-[11px] text-stone-300">Indus Valley Aqueducts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="p-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Dual Delivery</p>
                    <p className="text-[11px] text-stone-300">Leh Valley & Pan-India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 BUSINESS SECTIONS SHOWCASE */}
        <section className="py-20 border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                Our 6 Pillars
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] mt-2">
                The Six Sections of Stakna Farmhouse
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                Covering fresh high-altitude perishables for Leh Valley, pan-India shippable preserves and textiles, and an immersive eco-retreat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Section 1: Vegetables */}
              <Link
                href="/vegetables"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Carrot className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Section 1 · Local Delivery (Leh)
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Fresh Organic Vegetables
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Crisp mountain greens, sweet high-brix carrots, heirloom beets, and herbs harvested daily from our passive solar greenhouses.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>Explore Harvest</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Section 2: Flowers */}
              <Link
                href="/flowers"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Flower className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Section 2 · Blooms & Experiences
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Flowers & Garden Visits
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Monastery altar marigolds, high-altitude lavender, ceremonial bouquets, and guided mindful walks through our riverside terraces.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>Explore Florals & Visits</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Section 3: Saplings */}
              <Link
                href="/saplings"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Section 3 · Orchard Nursery
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Fruit & Tree Saplings
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    2-year grafted sweet Halman apricots, GI-tagged Raktsey Karpo, crisp apples, and greenhouse vegetable starts cold-hardened at 3,250m.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>View Nursery Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Section 4: Value-Added */}
              <Link
                href="/value-added"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block mb-1">
                    Section 4 · Pan-India Shippable
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Value-Added Goods & Preserves
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Wild Indus seabuckthorn jam, sulfur-free sun-dried Halman apricots, stone-ground Tsampa, and hand-blended herbal teas.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>Shop Preserves</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Section 5: Pashmina */}
              <Link
                href="/pashmina"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Section 5 · Pan-India Heritage
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Heritage Changthang Pashmina
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    100% genuine Kharnak nomadic cashmere (&lt; 14.5 microns). Handspun on wooden charkhas and handwoven by village master artisans.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>View Pashmina Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Section 6: Farmstay */}
              <Link
                href="/farmstay"
                className="group bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 hover:border-[#B45309] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Section 6 · Eco-Retreat Preview
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917] group-hover:text-[#B45309] transition-colors mb-2">
                    Eco-Retreat & Farmstay
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Passive solar rammed-earth architecture on our 2-acre plot facing Stakna Monastery. Zero-km dining and dark-sky astronomy.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#B45309]">
                  <span>Explore Retreat Preview</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* DUAL BRAND STORIES BANNER */}
        <section className="py-20 bg-[#1C1917] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story 1: Farm Story */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                    Brand Story · Regenerative Earth
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                    High-Altitude Regenerative Agriculture at 3,250m
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
                    Learn how our 2-acre plot in Stakna channels pure Indus glacial runoff and utilizes passive solar thermal mass to harvest greens throughout the Himalayan winter.
                  </p>
                </div>
                <div>
                  <Link
                    href="/farm-story"
                    className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    <span>Read Farm Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Story 2: Pashmina Heritage */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                    Brand Story · Changthang Cashmere
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                    The Sacred Provenance of Genuine Pashmina
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
                    From 5,000-meter nomadic pastures in Kharnak to the wooden charkhas and handlooms of Stakna. Trace the journey of 14-micron pure cashmere.
                  </p>
                </div>
                <div>
                  <Link
                    href="/pashmina-heritage"
                    className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white border border-stone-600 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    <span>Read Pashmina Heritage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HIGHLIGHT PRODUCTS: VEGETABLES */}
        <section className="py-20 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Harvested Daily in Stakna</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
                  Fresh Organic Vegetables
                </h2>
              </div>
              <Link
                href="/vegetables"
                className="text-xs uppercase font-bold tracking-wider text-[#B45309] hover:text-[#92400E] flex items-center gap-1 group"
              >
                <span>View All Vegetables</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vegetables.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* HIGHLIGHT PRODUCTS: PASHMINA */}
        {pashmina.length > 0 && (
          <section className="py-20 bg-[#F3EDE2] border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                    Artisanal Heirloom Textiles
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] mt-1">
                    Authentic Changthang Pashmina
                  </h2>
                </div>
                <Link
                  href="/pashmina"
                  className="text-xs uppercase font-bold tracking-wider text-[#B45309] flex items-center gap-1 group"
                >
                  <span>View Pashmina Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {pashmina.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
