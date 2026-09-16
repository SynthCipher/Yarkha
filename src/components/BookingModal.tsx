"use client";

import React, { useState, useEffect } from "react";
import { ROOMS, FARMHOUSE_INFO, Room } from "@/data/farmhouseData";
import {
  X,
  Calendar,
  Users,
  Check,
  Send,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedRoomId,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
}: BookingModalProps) {
  // Default dates: tomorrow and 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const checkoutDefault = new Date(today);
  checkoutDefault.setDate(today.getDate() + 4);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [roomId, setRoomId] = useState<string>(preselectedRoomId || ROOMS[0].id);
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || formatDate(checkoutDefault));
  const [adults, setAdults] = useState<number>(initialGuests);
  const [children, setChildren] = useState<number>(0);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [needAirportPickup, setNeedAirportPickup] = useState(false);
  const [needMonasteryTour, setNeedMonasteryTour] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedRoomId) {
      setRoomId(preselectedRoomId);
    }
  }, [preselectedRoomId]);

  useEffect(() => {
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
    if (initialGuests) setAdults(initialGuests);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  if (!isOpen) return null;

  const currentRoom = ROOMS.find((r) => r.id === roomId) || ROOMS[0];

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const estimatedTotal = nights * currentRoom.pricePerNight;

  // Format currency
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const generateBookingSummary = () => {
    return `*Reservation Inquiry - Yarkha (Stakna Farmhouse)*
• *Guest:* ${fullName || "Guest"}
• *Contact:* ${phone || "Not specified"} (${email || "Not specified"})
• *Suite:* ${currentRoom.name}
• *Dates:* ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""})
• *Guests:* ${adults} Adults, ${children} Children
• *Airport Pickup (Leh IXL):* ${needAirportPickup ? "Yes" : "No"}
• *Monastery Sunrise Tour:* ${needMonasteryTour ? "Yes" : "No"}
• *Estimated Total:* ${formatCurrency(estimatedTotal)}
• *Special Notes:* ${specialRequests || "None"}`;
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(generateBookingSummary());
    window.open(`https://wa.me/${FARMHOUSE_INFO.whatsapp}?text=${text}`, "_blank");
  };

  const handleEmailBooking = () => {
    const subject = encodeURIComponent(`Booking Inquiry: ${currentRoom.name} (${checkIn} - ${checkOut})`);
    const body = encodeURIComponent(generateBookingSummary());
    window.open(`mailto:${FARMHOUSE_INFO.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#1C1917] text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Reservation</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">
              Reserve Your Stay at Yarkha
            </h3>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Best rate guarantee · Complimentary organic farmhouse breakfast
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-[#1C1917] mb-2">
              Inquiry Received!
            </h4>
            <p className="text-sm text-[#57534E] max-w-md leading-relaxed mb-8">
              Julley! Thank you, <span className="font-semibold">{fullName}</span>. Our farmhouse host will contact you at <span className="font-semibold">{phone || email}</span> within 2 hours to confirm room availability and assist with your Leh itinerary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={handleWhatsAppBooking}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="bg-stone-200 hover:bg-stone-300 text-[#1C1917] font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Room Selection */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-2">
                Select Suite
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROOMS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoomId(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      roomId === r.id
                        ? "border-[#B45309] bg-amber-50/50 shadow-sm ring-2 ring-[#B45309]/30"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div>
                      <p className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] leading-tight">
                        {r.name.replace("The ", "")}
                      </p>
                      <p className="text-[10px] text-[#78716C] mt-0.5">{r.view}</p>
                    </div>
                    <p className="font-serif font-bold text-xs text-[#B45309] mt-2">
                      {r.priceFormatted}{" "}
                      <span className="text-[9px] font-sans text-stone-500 font-normal">
                        / nt
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates & Guests Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                  Check-In
                </label>
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#1C1917] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                  Check-Out
                </label>
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#1C1917] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                  Guests
                </label>
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5">
                  <Users className="w-4 h-4 text-[#B45309]" />
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-semibold text-[#1C1917] focus:outline-none"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jigmat Dorjey"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#B45309]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#B45309]"
              />
            </div>

            {/* Curated Extras Checkboxes */}
            <div className="bg-stone-100/70 p-4 rounded-2xl space-y-2.5 text-xs text-[#44403C]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
                Complimentary Services & Add-ons
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needAirportPickup}
                  onChange={(e) => setNeedAirportPickup(e.target.checked)}
                  className="rounded text-[#B45309] focus:ring-[#B45309]"
                />
                <span>Private 4x4 Airport Pickup from Leh (IXL) Airport</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needMonasteryTour}
                  onChange={(e) => setNeedMonasteryTour(e.target.checked)}
                  className="rounded text-[#B45309] focus:ring-[#B45309]"
                />
                <span>Include Dawn Stakna Monastery Chanting Walk (Complimentary)</span>
              </label>
            </div>

            {/* Special Request Notes */}
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-widest text-[#78716C] mb-1">
                Dietary Preferences or Special Requests
              </label>
              <textarea
                rows={2}
                placeholder="Vegetarian, Jain, anniversary setup, flight arrival details..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#B45309]"
              />
            </div>

            {/* Price Estimation Bar */}
            <div className="flex items-center justify-between p-4 bg-[#1C1917] text-white rounded-2xl">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">
                  Estimated Total ({nights} Night{nights > 1 ? "s" : ""})
                </p>
                <p className="font-serif text-2xl font-bold text-amber-300">
                  {formatCurrency(estimatedTotal)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-medium block">
                  ✓ Organic Breakfast Included
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Pay at Check-in / UPI Available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Reservation Request</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
