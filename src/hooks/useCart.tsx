"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, ProductDTO } from "@/types";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: ProductDTO | any, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yarkha_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse cart:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("yarkha_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: ProductDTO | any, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id || i.productId === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((i) =>
          i.productId === existing.productId
            ? { ...i, quantity: newQty, subtotal: Math.round(newQty * i.pricePerUnit) }
            : i
        );
      } else {
        const pId = product.id || product._id;
        const fulfillmentType =
          product.fulfillmentType ||
          (product.productType === "VALUE_ADDED" || product.productType === "PASHMINA"
            ? "SHIPPABLE"
            : "LOCAL_PERISHABLE");
        const newItem: CartItem = {
          productId: pId,
          title: product.title,
          slug: product.slug,
          image: product.images?.[0] || "/images/hero.jpg",
          unit: product.unit,
          pricePerUnit: product.pricePerUnit,
          quantity,
          productType: product.productType,
          fulfillmentType,
          shippingEligibility: product.shippingEligibility,
          subtotal: Math.round(quantity * product.pricePerUnit),
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity, subtotal: Math.round(quantity * i.pricePerUnit) }
          : i
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
