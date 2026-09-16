"use client";

import React, { useState, useEffect } from "react";
import {
  Flower,
  Calendar,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { GARDEN_VISIT_STATUSES } from "@/config/constants";

export default function GardenVisitsAdminPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/garden-visits");
      const json = await res.json();
      if (json.success) {
        setVisits(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/v1/garden-visits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success) {
        loadVisits();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVisits = visits.filter((v) => {
    if (statusFilter === "ALL") return true;
    return v.status === statusFilter;
  });

  const newCount = visits.filter((v) => v.status === "NEW").length;
  const confirmedCount = visits.filter((v) => v.status === "CONFIRMED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
            Storefront Experience Requests
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Flower Garden Tour Inquiries
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review and schedule guided terrace walks, floral photography, and meditation visits in Stakna.
          </p>
        </div>

        <button
          onClick={loadVisits}
          className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              New Inquiries
            </p>
            <h3 className="font-serif font-bold text-2xl text-[#B45309] mt-1">
              {newCount} Pending
            </h3>
            <span className="text-[10px] text-stone-500">Awaiting Confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
            <Flower className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Confirmed Visits
            </p>
            <h3 className="font-serif font-bold text-2xl text-emerald-600 mt-1">
              {confirmedCount} Scheduled
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Ready for Welcome</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Total Recorded Visits
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {visits.length} Total
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {["ALL", "NEW", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === st
                ? "bg-[#B45309] text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading visit inquiries...</div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No garden visits found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Visitor</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Preferred Date</th>
                  <th className="p-4">Party Size</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVisits.map((v) => (
                  <tr key={v._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-bold text-stone-900">{v.visitorName}</td>
                    <td className="p-4 space-y-0.5 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{v.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{v.email}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-stone-900">
                      {new Date(v.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{v.groupSize} visitors</td>
                    <td className="p-4 text-stone-600">{v.purpose || "Mindful walk"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          v.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : v.status === "NEW"
                            ? "bg-amber-100 text-amber-900"
                            : v.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {v.status === "NEW" && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, "CONFIRMED")}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1 rounded-lg text-[11px] transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {v.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, "COMPLETED")}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg text-[11px] transition-colors"
                          >
                            Completed
                          </button>
                        )}
                        {v.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, "CANCELLED")}
                            className="text-stone-400 hover:text-red-700 text-[11px] font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
