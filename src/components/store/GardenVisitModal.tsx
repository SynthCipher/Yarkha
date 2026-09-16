"use client";

import React, { useState } from "react";
import { Flower, Calendar, Users, Send, X, CheckCircle2, MapPin } from "lucide-react";

interface GardenVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GardenVisitModal({ isOpen, onClose }: GardenVisitModalProps) {
  const [formData, setFormData] = useState({
    visitorName: "",
    email: "",
    phone: "",
    preferredDate: "",
    groupSize: 2,
    purpose: "Floral Photography & Altar Flowers",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/garden-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit garden visit request");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-[#1C1917]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Garden Visit Requested!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 max-w-sm mx-auto">
              Julley! We have received your request to visit our Stakna flower gardens. Our team will contact you via phone or email to confirm the exact hour and gate directions.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="bg-[#1C1917] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Flower className="w-4 h-4 text-[#B45309]" />
              <span>Stakna Riverfront Gardens</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1">
              Visit the Flower Garden
            </h2>
            <p className="text-xs text-stone-600 mb-6">
              Walk among high-altitude marigolds, cosmos, and lavender along the Indus. Free guided visits for florists, meditation practitioners, and mindful travelers.
            </p>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    placeholder="e.g. Sonam Angmo"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sonam@example.com"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Group Size</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Purpose of Visit</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                >
                  <option>Floral Photography & Altar Flowers</option>
                  <option>Wedding & Event Floral Consultation</option>
                  <option>Mindful Garden Walk & Meditation</option>
                  <option>High-Altitude Permaculture Learning</option>
                  <option>School or Community Group Tour</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Confirm Garden Visit Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
