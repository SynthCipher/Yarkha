"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  PackageCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { STOCK_CATEGORIES } from "@/config/constants";

export default function StockOperationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<any | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New stock item form state
  const [formData, setFormData] = useState({
    name: "",
    category: "SEEDS",
    quantity: 10,
    unit: "kg",
    minThreshold: 5,
    reorderQuantity: 20,
    location: "Main Stakna Storehouse",
    costPerUnit: 100,
    supplier: "",
  });

  const loadStock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/operations/stock");
      const json = await res.json();
      if (json.success) {
        setItems(json.data.items);
        setLowStockCount(json.data.lowStockCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        loadStock();
        setFormData({
          name: "",
          category: "SEEDS",
          quantity: 10,
          unit: "kg",
          minThreshold: 5,
          reorderQuantity: 20,
          location: "Main Stakna Storehouse",
          costPerUnit: 100,
          supplier: "",
        });
      } else {
        alert(json.error || "Failed to create stock item");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: adjustingItem._id,
          adjustment: Number(adjustmentAmount),
          notes: adjustmentNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAdjustingItem(null);
        setAdjustmentAmount(0);
        setAdjustmentNotes("");
        loadStock();
      } else {
        alert(json.error || "Failed to adjust stock");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
            Physical Farm Operations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Raw Materials & Supplies Stock
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track seeds, compost, bio-fertilizers, packaging glass jars, and raw Changthang fleece.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
          <button
            onClick={loadStock}
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors"
            title="Refresh Stock"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Total Managed Materials
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {items.length} Items
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Low Stock Reorder Alerts
            </p>
            <h3 className="font-serif font-bold text-2xl text-red-600 mt-1">
              {lowStockCount} Items
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Storage Facilities
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              3 Locations
            </h3>
            <span className="text-[10px] text-stone-500">Stakna Plot, Shed, Weaving Rm</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stock by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === "ALL"
                ? "bg-emerald-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          {Object.values(STOCK_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-emerald-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading stock materials...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No stock items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Material / Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">In Stock</th>
                  <th className="p-4">Min Threshold</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Cost/Unit</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minThreshold;
                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isLow ? "bg-red-50/40" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-stone-900">{item.name}</div>
                        {item.supplier && (
                          <span className="text-[10px] text-stone-400">
                            Supplier: {item.supplier}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold text-sm ${
                            isLow ? "text-red-700" : "text-stone-900"
                          }`}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        {isLow && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-0.5">
                            ⚠ Reorder Needed
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-stone-500">
                        {item.minThreshold} {item.unit}
                      </td>
                      <td className="p-4 text-stone-600">{item.location}</td>
                      <td className="p-4 text-stone-900">
                        {item.costPerUnit ? `₹${item.costPerUnit}` : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setAdjustingItem(item)}
                          className="bg-[#FAF7F2] hover:bg-stone-200 border border-stone-300 text-stone-800 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Adjust Qty
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Quantity Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Adjust Stock: {adjustingItem.name}
            </h3>
            <p className="text-xs text-stone-600">
              Current Level: <strong>{adjustingItem.quantity} {adjustingItem.unit}</strong>
            </p>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Quantity Change (+ to add, - to consume)
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="e.g. -5 or 20"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reason / Usage Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Used for greenhouse seeding"
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || adjustmentAmount === 0}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Stock Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Register New Raw Material
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Clover Seed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(STOCK_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, jars, bags"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Kharnak Pastoralist Cooperative"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Add to Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
