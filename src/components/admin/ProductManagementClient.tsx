"use client";

import React, { useState, useTransition, useId } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  UploadCloud,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Truck,
  Leaf,
  Layers,
} from "lucide-react";
import {
  PRODUCT_TYPES,
  PRODUCT_UNITS,
  SHIPPING_ELIGIBILITY,
  PRODUCT_STATUS,
} from "@/config/constants";

interface ProductManagementClientProps {
  initialProducts: any[];
  categories: any[];
  farmBatches: any[];
}

const PRESET_IMAGES = [
  { label: "Cherry Tomatoes", url: "/images/dining.jpg" },
  { label: "Fresh Vegetables", url: "/images/hero.jpg" },
  { label: "Indus Flowers", url: "/images/suite-riverfront.jpg" },
  { label: "Valley Farmhouse", url: "/images/stakna-monastery.jpg" },
  { label: "Apricot Jams & Tea", url: "/images/dining.jpg" },
];

export function ProductManagementClient({
  initialProducts,
  categories,
  farmBatches,
}: ProductManagementClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedShipping, setSelectedShipping] = useState("ALL");

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form Fields state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: categories[0]?._id || "",
    farmBatch: "",
    productType: PRODUCT_TYPES.VEGETABLE,
    unit: "kg",
    pricePerUnit: 120,
    compareAtPrice: "",
    availableQuantity: 50,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    orderCutoffTime: "14:00",
    shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
    shortDescription: "",
    description: "",
    storageInstructions: "Store in a cool dry place or refrigerate.",
    shelfLife: "3-5 days fresh harvest",
    images: ["/images/hero.jpg"],
    status: PRODUCT_STATUS.PUBLISHED,
    featured: false,
    isDailyAvailable: true,
    isSeasonal: false,
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData({
      title: "",
      slug: "",
      category: categories[0]?._id || "",
      farmBatch: "",
      productType: PRODUCT_TYPES.VEGETABLE,
      unit: "kg",
      pricePerUnit: 120,
      compareAtPrice: "",
      availableQuantity: 50,
      minOrderQuantity: 1,
      maxOrderQuantity: 20,
      orderCutoffTime: "14:00",
      shippingEligibility: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      shortDescription: "",
      description: "",
      storageInstructions: "Store in a cool dry place or refrigerate.",
      shelfLife: "3-5 days fresh harvest",
      images: ["/images/hero.jpg"],
      status: PRODUCT_STATUS.PUBLISHED,
      featured: false,
      isDailyAvailable: true,
      isSeasonal: false,
    });
    setImageUrlInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProductId(prod._id);
    setFormData({
      title: prod.title || "",
      slug: prod.slug || "",
      category: typeof prod.category === "object" ? prod.category?._id : prod.category || categories[0]?._id || "",
      farmBatch: typeof prod.farmBatch === "object" ? prod.farmBatch?._id : prod.farmBatch || "",
      productType: prod.productType || PRODUCT_TYPES.VEGETABLE,
      unit: prod.unit || "kg",
      pricePerUnit: prod.pricePerUnit || 0,
      compareAtPrice: prod.compareAtPrice ? String(prod.compareAtPrice) : "",
      availableQuantity: prod.availableQuantity || 0,
      minOrderQuantity: prod.minOrderQuantity || 1,
      maxOrderQuantity: prod.maxOrderQuantity || 20,
      orderCutoffTime: prod.orderCutoffTime || "14:00",
      shippingEligibility: prod.shippingEligibility || SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      storageInstructions: prod.storageInstructions || "",
      shelfLife: prod.shelfLife || "",
      images: prod.images && prod.images.length > 0 ? prod.images : ["/images/hero.jpg"],
      status: prod.status || PRODUCT_STATUS.PUBLISHED,
      featured: !!prod.featured,
      isDailyAvailable: prod.isDailyAvailable !== false,
      isSeasonal: !!prod.isSeasonal,
    });
    setImageUrlInput("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingProductId
        ? prev.slug
        : val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({
          ...prev,
          images: [json.url, ...prev.images.filter((img) => img !== "/images/hero.jpg")],
        }));
        showNotification("success", "Photo uploaded directly to Cloudinary!");
      } else {
        throw new Error(json.error || "Upload failed");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images.filter((img) => img !== "/images/hero.jpg"), imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated.length > 0 ? updated : ["/images/hero.jpg"],
      };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: any = {
        ...formData,
        pricePerUnit: Number(formData.pricePerUnit),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        availableQuantity: Number(formData.availableQuantity),
        minOrderQuantity: Number(formData.minOrderQuantity),
        maxOrderQuantity: Number(formData.maxOrderQuantity),
      };

      if (!payload.farmBatch) {
        delete payload.farmBatch;
      }

      let res;
      if (editingProductId) {
        res = await fetch(`/api/v1/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/v1/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save product");
      }

      if (editingProductId) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProductId ? result.data : p))
        );
        showNotification("success", `Product "${payload.title}" updated successfully!`);
      } else {
        setProducts((prev) => [result.data, ...prev]);
        showNotification("success", `New product "${payload.title}" created successfully!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      showNotification("success", `Product "${title}" deleted.`);
    } catch (err: any) {
      showNotification("error", err.message || "Could not delete product.");
    }
  };

  const handleQuickStockAdjust = async (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableQuantity: newQty }),
      });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, availableQuantity: newQty } : p))
        );
        showNotification("success", `Stock updated to ${newQty}!`);
      }
    } catch (err) {
      showNotification("error", "Failed to update stock.");
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryId = typeof p.category === "object" ? p.category?._id : p.category;
    const matchesCategory =
      selectedCategory === "ALL" || categoryId === selectedCategory;

    const matchesStatus =
      selectedStatus === "ALL" || p.status === selectedStatus;

    const matchesShipping =
      selectedShipping === "ALL" || p.shippingEligibility === selectedShipping;

    return matchesSearch && matchesCategory && matchesStatus && matchesShipping;
  });

  const lowStockCount = products.filter(
    (p) => (p.availableQuantity || 0) - (p.reservedQuantity || 0) <= 5
  ).length;

  const panIndiaCount = products.filter(
    (p) => p.shippingEligibility === SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-700"
              : "bg-rose-900 text-rose-100 border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
              Product Catalog & Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8EFE9] text-[#1E3A2B]">
              {products.length} Items
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Create products, assign farm batches, manage harvest inventory & Pan-India shipping eligibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#1E3A2B] hover:bg-[#15291E] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Items</p>
            <p className="text-xl font-bold text-stone-900">{products.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Published</p>
            <p className="text-xl font-bold text-emerald-800">
              {products.filter((p) => p.status === PRODUCT_STATUS.PUBLISHED).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Low Stock (≤5)</p>
            <p className="text-xl font-bold text-amber-800">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Pan-India Ship</p>
            <p className="text-xl font-bold text-blue-800">{panIndiaCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Shipping Filter */}
          <select
            value={selectedShipping}
            onChange={(e) => setSelectedShipping(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          >
            <option value="ALL">All Shipping</option>
            <option value={SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY}>Leh Local Only</option>
            <option value={SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE}>Pan-India Courier</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          >
            <option value="ALL">All Statuses</option>
            <option value={PRODUCT_STATUS.PUBLISHED}>Published</option>
            <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
            <option value={PRODUCT_STATUS.ARCHIVED}>Archived</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[#78716C] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category & Batch</th>
                <th className="py-3.5 px-4">Price / Unit</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Reserved</th>
                <th className="py-3.5 px-4">Shipping</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <Package className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold">No products match the selected criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod: any) => {
                  const remaining = (prod.availableQuantity || 0) - (prod.reservedQuantity || 0);
                  const isLow = remaining <= 5;
                  const catName =
                    typeof prod.category === "object"
                      ? prod.category?.name
                      : categories.find((c) => c._id === prod.category)?.name || "General";

                  const batchName =
                    typeof prod.farmBatch === "object"
                      ? prod.farmBatch?.batchCode
                      : farmBatches.find((b) => b._id === prod.farmBatch)?.batchCode;

                  return (
                    <tr key={prod._id} className="hover:bg-stone-50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                            <Image
                              src={prod.images?.[0] || "/images/hero.jpg"}
                              alt={prod.title}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#1C1917] hover:text-[#1E3A2B] transition-colors">
                                {prod.title}
                              </p>
                              {prod.featured && (
                                <span className="p-0.5 rounded-full bg-amber-100 text-amber-700" title="Featured on Storefront">
                                  <Sparkles className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                              <span>/{prod.slug}</span>
                              {prod.isSeasonal && (
                                <span className="text-amber-700 font-semibold">• Seasonal</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Farm Batch Assignment */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-800">{catName}</p>
                        {batchName ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-mono mt-0.5 border border-emerald-200">
                            <Leaf className="w-2.5 h-2.5" />
                            {batchName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Unassigned batch</span>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#1C1917] text-sm">₹{prod.pricePerUnit}</span>
                        <span className="text-[10px] text-stone-500"> / {prod.unit}</span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.pricePerUnit && (
                          <div className="text-[10px] text-stone-400 line-through">
                            ₹{prod.compareAtPrice}
                          </div>
                        )}
                      </td>

                      {/* Available Stock & Quick Modifiers */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isLow ? "text-amber-700" : "text-[#1C1917]"
                            }`}
                          >
                            {prod.availableQuantity} {prod.unit}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickStockAdjust(prod._id, prod.availableQuantity, 5)}
                              className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                              title="Add 5 units harvest"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(prod._id, prod.availableQuantity, -5)}
                              className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                              title="Deduct 5 units"
                            >
                              -5
                            </button>
                          </div>
                        </div>
                        {isLow && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                            Low Stock Alert
                          </span>
                        )}
                      </td>

                      {/* Reserved Quantity */}
                      <td className="py-3.5 px-4">
                        <span className="text-stone-600 font-semibold">
                          {prod.reservedQuantity || 0} {prod.unit}
                        </span>
                      </td>

                      {/* Shipping Eligibility */}
                      <td className="py-3.5 px-4">
                        {prod.shippingEligibility === SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                            <Truck className="w-3 h-3" />
                            Pan-India
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            <Leaf className="w-3 h-3" />
                            Leh Local
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            prod.status === PRODUCT_STATUS.PUBLISHED
                              ? "bg-emerald-100 text-emerald-800"
                              : prod.status === PRODUCT_STATUS.DRAFT
                              ? "bg-stone-100 text-stone-700"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#1E3A2B] hover:text-white text-stone-700 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.title)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-Over: Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF7F2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {editingProductId ? "Edit Farm Product" : "Add New Farm Product"}
                </h3>
                <p className="text-xs text-stone-500">
                  Configure details, category assignment, greenhouse batch, and logistics.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A2B] mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Product Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Stakna Solar Greenhouse Cherry Tomatoes"
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. stakna-cherry-tomatoes"
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Product Type
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    >
                      <option value={PRODUCT_TYPES.VEGETABLE}>Fresh Vegetable</option>
                      <option value={PRODUCT_TYPES.FLOWER}>Fresh Flower / Bouquet</option>
                      <option value={PRODUCT_TYPES.SEASONAL}>Seasonal Produce</option>
                      <option value={PRODUCT_TYPES.VALUE_ADDED}>Value-Added / Preserves</option>
                      <option value={PRODUCT_TYPES.BASKET}>Subscription Basket</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Short Tagline (Shown on catalog card)
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="e.g. Organically grown with glacial melt in Stakna passive solar greenhouses."
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Description & Origin Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed notes on taste, altitude, farming practice, and culinary pairing..."
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Assignments & Logistics */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A2B] mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Category & Farm Batch Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category Assignment <span className="text-rose-600">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farm Batch / Greenhouse Assignment
                    </label>
                    <select
                      value={formData.farmBatch}
                      onChange={(e) => setFormData({ ...formData, farmBatch: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-mono text-[11px]"
                    >
                      <option value="">-- Unassigned / General Farm Stock --</option>
                      {farmBatches.map((b) => (
                        <option key={b._id} value={b._id}>
                          [{b.batchCode}] {b.cropName} - {b.farmLocation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Shipping Eligibility
                    </label>
                    <select
                      value={formData.shippingEligibility}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingEligibility: e.target.value as any,
                        })
                      }
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-semibold text-[#1C1917]"
                    >
                      <option value={SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY}>
                        🥦 Leh Local Delivery Only (Fresh Perishables)
                      </option>
                      <option value={SHIPPING_ELIGIBILITY.PAN_INDIA_ELIGIBLE}>
                        📦 Pan-India Courier Eligible (Dried / Shelf-Stable)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Daily Order Cutoff Time
                    </label>
                    <input
                      type="text"
                      value={formData.orderCutoffTime}
                      onChange={(e) => setFormData({ ...formData, orderCutoffTime: e.target.value })}
                      placeholder="14:00"
                      className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Pricing & Stock Limits */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A2B] mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Pricing, Units & Inventory
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-semibold"
                    >
                      {PRODUCT_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Price / Unit (₹) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      MRP / Compare (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      placeholder="Optional"
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={formData.availableQuantity}
                      onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Min Order Qty
                    </label>
                    <input
                      type="number"
                      min={0.1}
                      step="any"
                      value={formData.minOrderQuantity}
                      onChange={(e) => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Max Order Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.maxOrderQuantity}
                      onChange={(e) => setFormData({ ...formData, maxOrderQuantity: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Shelf Life
                    </label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                      placeholder="e.g. 3-5 days"
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold"
                    >
                      <option value={PRODUCT_STATUS.PUBLISHED}>Published</option>
                      <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
                      <option value={PRODUCT_STATUS.ARCHIVED}>Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Images & Cloudinary Upload */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A2B] mb-3 flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" /> Product Images & Cloudinary Direct Upload
                </h4>

                {/* Upload Control */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold transition-all shrink-0">
                    <UploadCloud className="w-4 h-4 text-emerald-800" />
                    <span>{isUploading ? "Uploading to Cloudinary..." : "Upload Photo File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2 w-full">
                    <input
                      type="url"
                      placeholder="Or paste an image URL..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Preset Quick Selectors */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-stone-400 mr-1">Quick Presets:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images.filter((img) => img !== "/images/hero.jpg"), preset.url],
                        }))
                      }
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                {/* Thumbnail Previews */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {formData.images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 group bg-stone-100 shrink-0"
                    >
                      <Image
                        src={imgUrl}
                        alt="Product preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-md transition-colors"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-900/80 text-white uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Feature Flags & Toggles */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Feature on Storefront (Hero & Recommendations)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isDailyAvailable}
                    onChange={(e) => setFormData({ ...formData, isDailyAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Daily Fresh Harvest Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isSeasonal}
                    onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Seasonal Himalayan Crop</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving Product...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProductId ? "Update Product" : "Publish Product"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
