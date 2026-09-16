import React from "react";
import { deliveryRepository } from "@/repositories/deliveryRepository";
import { Clock, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDeliverySlotsPage() {
  const slotsData = await deliveryRepository.listActiveSlots();
  const slots = JSON.parse(JSON.stringify(slotsData));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
          Delivery Slots & Capacity Limits
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Configure active time windows, maximum orders per slot, and order cutoff buffers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slots.map((slot: any) => (
          <div
            key={slot._id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-[#B45309]">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {slot.startTime} – {slot.endTime}
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              {slot.title}
            </h3>

            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>Daily Max Orders:</span>
                <span className="font-bold text-[#1C1917]">{slot.maxOrdersPerDay} orders</span>
              </div>
              <div className="flex justify-between">
                <span>Cutoff Buffer:</span>
                <span className="font-bold text-[#1C1917]">{slot.cutoffMinutesBefore} mins before</span>
              </div>
              <div className="flex justify-between">
                <span>Active Days:</span>
                <span className="font-semibold text-emerald-700">All 7 Days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
