"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { ProductDTO } from "@/types";
import { Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailClient({ product }: { product: ProductDTO }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(product.minOrderQuantity || 1);
  const [added, setAdded] = useState(false);

  const availableStock = product.availableQuantity - product.reservedQuantity;
  const isOutOfStock = availableStock <= 0;

  const handleIncrement = () => {
    if (quantity < Math.min(product.maxOrderQuantity, availableStock)) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > product.minOrderQuantity) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isOutOfStock) {
    return (
      <div className="p-4 rounded-2xl bg-stone-100 text-stone-500 text-center font-semibold text-xs uppercase tracking-wider">
        Currently Out of Stock for Today&apos;s Harvest
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-stone-300 rounded-full overflow-hidden bg-white shadow-xs">
          <button
            onClick={handleDecrement}
            disabled={quantity <= product.minOrderQuantity}
            className="px-4 py-3 hover:bg-stone-100 text-[#1C1917] disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold text-[#1C1917]">
            {quantity} {product.unit}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= Math.min(product.maxOrderQuantity, availableStock)}
            className="px-4 py-3 hover:bg-stone-100 text-[#1C1917] disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAdd}
          className="flex-1 bg-[#B45309] hover:bg-[#92400E] text-white py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{added ? "Added to Basket!" : "Add to Basket"}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#78716C] px-1">
        <span>Min Order: {product.minOrderQuantity} {product.unit}</span>
        <span>Max Order: {product.maxOrderQuantity} {product.unit}</span>
      </div>
    </div>
  );
}
