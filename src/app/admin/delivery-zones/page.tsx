import React from "react";
import { deliveryRepository } from "@/repositories/deliveryRepository";
import { MapPin, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryZonesPage() {
  const zonesData = await deliveryRepository.listActiveZones();
  const zones = JSON.parse(JSON.stringify(zonesData));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
          Delivery Zones & Localities
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Configurable delivery fees, minimum order thresholds, and active localities across Leh & Ladakh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone: any) => (
          <div
            key={zone._id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B45309]">
                  {zone.code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active Zone
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                {zone.name}
              </h3>

              <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                  <span className="text-[#78716C] block text-[10px] uppercase font-semibold">Delivery Fee</span>
                  <span className="font-bold text-sm text-[#1C1917]">₹{zone.deliveryFee}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                  <span className="text-[#78716C] block text-[10px] uppercase font-semibold">Min Order</span>
                  <span className="font-bold text-sm text-[#1C1917]">₹{zone.minOrderValue}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#78716C] mb-1.5">
                  Covered Localities ({zone.areas.length})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {zone.areas.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-stone-100 text-stone-700 text-[11px] px-2.5 py-1 rounded-md"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {zone.freeDeliveryThreshold && (
              <div className="pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold">
                ✓ Free delivery for orders above ₹{zone.freeDeliveryThreshold}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
