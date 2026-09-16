import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { productRepository } from "@/repositories/productRepository";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import { Sparkles, MapPin, Truck, ShieldCheck, Clock, ArrowLeft } from "lucide-react";
import { PRODUCT_TYPES } from "@/config/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Yarkha Farm" };
  }

  return {
    title: `${product.title} | Yarkha Farm Ladakh`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.title} | Yarkha Farm`,
      description: product.shortDescription || product.description.substring(0, 160),
      images: [{ url: product.images[0] || "/images/hero.jpg" }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawProduct = await productRepository.findBySlug(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = JSON.parse(JSON.stringify(rawProduct));

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.pricePerUnit,
      availability:
        product.availableQuantity > product.reservedQuantity
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Yarkha Farm Ladakh",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#B45309] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Farm Catalog</span>
            </Link>
          </div>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200/80 shadow-lg bg-white">
                <Image
                  src={product.images[0] || "/images/hero.jpg"}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-white"
                    >
                      <Image src={img} alt="" fill sizes="90px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Purchase Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#92400E] text-[11px] font-bold uppercase tracking-wider mb-3">
                  <span>{typeof product.category === "object" ? product.category?.name : "Organic Produce"}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] tracking-tight mb-2">
                  {product.title}
                </h1>

                {product.shortDescription && (
                  <p className="text-sm text-[#78716C] font-light leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-baseline justify-between">
                <div>
                  <span className="font-serif font-bold text-3xl text-[#1C1917]">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-sm text-[#78716C] ml-1.5 font-sans">
                    / {product.unit}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.pricePerUnit && (
                    <span className="text-xs text-stone-400 line-through ml-3">
                      ₹{product.compareAtPrice}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-700 font-semibold block">
                    ✓ In Stock: {product.availableQuantity - product.reservedQuantity} {product.unit}
                  </span>
                </div>
              </div>

              {/* Interactive Add to Cart Component */}
              <ProductDetailClient product={product} />

              {/* Product Specifications & Farm Details */}
              <div className="border-t border-stone-200 pt-6 space-y-4 text-xs">
                {product.shelfLife && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-[#78716C]">Shelf Life</span>
                    <span className="font-semibold text-[#1C1917]">{product.shelfLife}</span>
                  </div>
                )}

                {product.storageInstructions && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-[#78716C]">Storage Instructions</span>
                    <span className="font-semibold text-[#1C1917]">{product.storageInstructions}</span>
                  </div>
                )}

                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-[#78716C]">Ingredients</span>
                    <span className="font-semibold text-[#1C1917]">
                      {product.ingredients.join(", ")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-[#78716C]">Delivery Eligibility</span>
                  <span className="font-semibold text-[#B45309]">
                    {product.shippingEligibility === "PAN_INDIA_ELIGIBLE"
                      ? "Ships Pan-India"
                      : "Hand-Delivered in Leh Region Only"}
                  </span>
                </div>
              </div>

              {/* Description Body */}
              <div className="pt-4">
                <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">
                  About this Harvest
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-light">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
