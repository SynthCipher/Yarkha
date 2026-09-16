"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ProductDTO } from "@/types";
import { Plus, Minus, Check, Sparkles, MapPin } from "lucide-react";
import { PRODUCT_TYPES } from "@/config/constants";

export default function ProductCard({ product }: { product: ProductDTO | any }) {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find(
    (i) => i.productId === product.id || i.productId === product._id
  );

  const availableStock = product.availableQuantity - product.reservedQuantity;
  const isOutOfStock = availableStock <= 0;

  return (
    <div className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-stone-100 block"
      >
        <Image
          src={product.images?.[0] || "/images/hero.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isDailyAvailable && (
            <span className="bg-[#1C1917]/85 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Morning Harvest</span>
            </span>
          )}

          {product.productType === PRODUCT_TYPES.VALUE_ADDED && (
            <span className="bg-emerald-900/85 backdrop-blur-md text-emerald-200 text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
              Ships Pan-India
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-900/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-red-500/30">
              Harvest Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">
              {typeof product.category === "object" ? product.category?.name : "Organic"}
            </span>

            {availableStock > 0 && availableStock <= 5 && (
              <span className="text-[10px] text-amber-700 font-semibold">
                Only {availableStock} {product.unit} left
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-bold text-base text-[#1C1917] group-hover:text-[#B45309] transition-colors leading-snug line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-[#78716C] mt-1.5 line-clamp-2 font-light leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-4 mt-4 border-t border-stone-200/80 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-lg text-[#1C1917]">
                ₹{product.pricePerUnit}
              </span>
              <span className="text-xs text-[#78716C] font-normal">
                / {product.unit}
              </span>
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.pricePerUnit && (
              <span className="text-[11px] text-stone-400 line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Add to Cart or Quantity Selector */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="bg-stone-200 text-stone-400 px-3.5 py-2 rounded-full text-xs font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : cartItem ? (
              <div className="flex items-center border border-[#B45309] rounded-full overflow-hidden bg-amber-50">
                <button
                  onClick={() =>
                    updateQuantity(cartItem.productId, cartItem.quantity - 1)
                  }
                  className="p-1.5 hover:bg-amber-100 text-[#B45309] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs font-bold text-[#1C1917]">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(cartItem.productId, cartItem.quantity + 1)
                  }
                  className="p-1.5 hover:bg-amber-100 text-[#B45309] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, product.minOrderQuantity || 1)}
                className="bg-[#1C1917] hover:bg-[#B45309] text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
