"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ORDER_STATUSES,
  OrderStatus,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} from "@/config/constants";
import {
  Search,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Truck,
  CreditCard,
  Package,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber);
    try {
      const res = await fetch(`/api/v1/orders/${orderNumber}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
          setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((ord) => {
    const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const recipient = ord.deliveryAddress?.fullName || ord.guestInfo?.name || "";
    const phone = ord.deliveryAddress?.phone || ord.guestInfo?.phone || "";
    const locality = ord.deliveryAddress?.locality || "";
    const matchesSearch =
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CONFIRMED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PREPARING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "OUT_FOR_DELIVERY":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", ...Object.values(ORDER_STATUSES)].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-[#1E3A2B] text-white"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[#78716C] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date & Slot</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold">No orders found matching the filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => {
                  const recipient = ord.deliveryAddress?.fullName || ord.guestInfo?.name || "Customer";
                  const phone = ord.deliveryAddress?.phone || ord.guestInfo?.phone || "";
                  const cleanPhone = phone.replace(/[^0-9]/g, "");

                  return (
                    <tr key={ord._id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1C1917] font-mono">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:text-[#1E3A2B] hover:underline text-left font-bold"
                        >
                          {ord.orderNumber}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        <p className="font-medium text-stone-800">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                        {ord.deliverySlot && (
                          <span className="text-[10px] text-amber-800 font-medium">
                            {ord.deliverySlot.title?.split("(")[0]}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1C1917]">{recipient}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-stone-500 font-mono">{phone}</span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:text-emerald-800"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 inline" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {ord.deliveryAddress?.locality || "Leh"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1C1917]">
                        ₹{ord.pricing?.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-stone-100 text-stone-700">
                          {ord.payment?.provider || "COD"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            disabled={updatingId === ord.orderNumber}
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.orderNumber, e.target.value)}
                            className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
                          >
                            {Object.values(ORDER_STATUSES).map((st) => (
                              <option key={st} value={st}>
                                {st.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#1E3A2B] hover:text-white text-stone-700 transition-colors"
                            title="View Full Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

      {/* Order Detail Modal / Slide-Over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF7F2]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900 font-mono">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Customer & Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    Delivery Address
                  </h4>
                  <p className="font-bold text-stone-900">{selectedOrder.deliveryAddress?.fullName}</p>
                  <p className="text-stone-700 mt-0.5">{selectedOrder.deliveryAddress?.streetAddress}</p>
                  <p className="text-stone-700">
                    {selectedOrder.deliveryAddress?.locality}, {selectedOrder.deliveryAddress?.city} -{" "}
                    {selectedOrder.deliveryAddress?.postalCode}
                  </p>
                  {selectedOrder.deliveryAddress?.landmark && (
                    <p className="text-stone-500 italic mt-0.5">
                      Landmark: {selectedOrder.deliveryAddress.landmark}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-800" />
                    Customer Contact
                  </h4>
                  <p className="font-mono text-stone-900 text-sm font-bold">
                    {selectedOrder.deliveryAddress?.phone}
                  </p>
                  {selectedOrder.guestInfo?.email && (
                    <p className="text-stone-600 mt-0.5">{selectedOrder.guestInfo.email}</p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href={`tel:${selectedOrder.deliveryAddress?.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 text-[11px]"
                    >
                      <Phone className="w-3 h-3" /> Call Customer
                    </a>
                    <a
                      href={`https://wa.me/91${selectedOrder.deliveryAddress?.phone?.replace(/[^0-9]/g, "").slice(-10)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-white text-[11px]"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Delivery Window & Slot */}
              {selectedOrder.deliverySlot && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                  <div>
                    <span className="font-bold">Scheduled Delivery Slot: </span>
                    <span>{selectedOrder.deliverySlot.title}</span>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-800" />
                  Harvest Items in Order ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={item.image || "/images/hero.jpg"}
                            alt={item.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{item.title}</p>
                          <p className="text-[10px] text-stone-500">
                            ₹{item.pricePerUnit} / {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900">
                          {item.quantity} {item.unit}
                        </p>
                        <p className="font-bold text-emerald-800 font-mono">₹{item.subtotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">₹{selectedOrder.pricing?.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-semibold">
                    {selectedOrder.pricing?.deliveryFee === 0 ? "FREE" : `₹${selectedOrder.pricing?.deliveryFee}`}
                  </span>
                </div>
                {selectedOrder.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({selectedOrder.couponApplied?.code || "PROMO"})</span>
                    <span className="font-mono">-₹{selectedOrder.pricing?.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-900">₹{selectedOrder.pricing?.total}</span>
                </div>
              </div>

              {/* Milestone Status Updater */}
              <div>
                <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-2">
                  Update Order Pipeline Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(ORDER_STATUSES).map((st) => (
                    <button
                      key={st}
                      disabled={updatingId === selectedOrder.orderNumber}
                      onClick={() => handleStatusChange(selectedOrder.orderNumber, st)}
                      className={`py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all ${
                        selectedOrder.status === st
                          ? "bg-[#1E3A2B] text-white border-[#1E3A2B] shadow-sm"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {st.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-100 bg-[#FAF7F2] flex items-center justify-between">
              <Link
                href={`/orders/${selectedOrder.orderNumber}`}
                target="_blank"
                className="text-emerald-800 hover:underline font-bold text-xs"
              >
                View Customer Milestone Timeline →
              </Link>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
