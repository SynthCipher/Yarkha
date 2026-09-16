"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { APP_CONFIG, USER_ROLES } from "@/config/constants";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.FARM_MANAGER;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1C1917] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B45309]" />
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                Your Harvest Basket
              </h3>
              <span className="text-xs bg-amber-100 text-[#92400E] px-2 py-0.5 rounded-full font-semibold">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#1C1917] mb-1">
                  Your basket is empty
                </h4>
                <p className="text-xs text-[#78716C] max-w-xs mb-6">
                  Add fresh harvest vegetables, blooms, or artisanal preserves to your basket.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#B45309] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full hover:bg-[#92400E] transition-all"
                >
                  Explore Harvest Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex gap-4 items-center"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-sm text-[#1C1917] truncate">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[#B45309] font-medium mt-0.5">
                      ₹{item.pricePerUnit} / {item.unit}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-sm text-[#1C1917]">
                      ₹{item.subtotal}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#78716C]">Estimated Subtotal</span>
                <span className="font-serif font-bold text-xl text-[#1C1917]">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#78716C] bg-stone-50 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Delivery fees and slot availability calculated precisely at checkout based on your locality.
                </span>
              </div>

              {isAdmin ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                    <span>Admin Session Active</span>
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-snug">
                    Customer checkout is disabled for admin accounts. You can review all orders in the Admin Orders Pipeline.
                  </p>
                  <Link
                    href="/admin/orders"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-3 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md transition-all block text-center"
                  >
                    <span>Open Admin Orders</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
