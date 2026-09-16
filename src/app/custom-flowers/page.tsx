"use client";

import React, { useState } from "react";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import { useAuth } from "@/hooks/useAuth";
import {
  Flower,
  Calendar,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
  Check,
  Sparkles,
  Send,
  LayoutDashboard,
} from "lucide-react";
import { FLOWER_OCCASIONS, USER_ROLES } from "@/config/constants";

export default function CustomFlowersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.FARM_MANAGER;

  const [contactName, setContactName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [occasion, setOccasion] = useState<string>(FLOWER_OCCASIONS.WEDDING);
  const [preferredDate, setPreferredDate] = useState("");
  const [budgetRange, setBudgetRange] = useState("₹2,000 – ₹5,000");
  const [flowerPreferences, setFlowerPreferences] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [messageNote, setMessageNote] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/flowers/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          phone,
          email,
          occasion,
          preferredDate,
          budgetRange,
          flowerPreferences,
          colorPalette,
          messageNote,
          additionalRequirements,
          referenceImages: referenceUrl ? [referenceUrl] : [],
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to submit request");
      }

      setSubmittedEnquiry(json.data.enquiryNumber);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917]">
      <StoreHeader />

      <main className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#92400E] text-xs font-bold uppercase tracking-wider mb-4">
              <Flower className="w-3.5 h-3.5" />
              <span>Bespoke Floral Design</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
              Custom Flowers & Event Styling
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-3 font-light leading-relaxed">
              From traditional Ladakhi wedding stages and monastery altar decor to anniversary bouquets, our florists create custom arrangements using morning-harvested mountain flowers.
            </p>
          </div>

          {/* Form or Confirmation */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xl">
            {submittedEnquiry ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 mb-1">
                  Enquiry Registered: #{submittedEnquiry}
                </span>
                <h2 className="font-serif font-bold text-2xl text-[#1C1917] mb-3">
                  Julley! We Have Received Your Request
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] max-w-md leading-relaxed mb-8 font-light">
                  Thank you, <span className="font-semibold">{contactName}</span>. Our lead floral designer will review your preferences and contact you at <span className="font-semibold">{phone}</span> within 24 hours with design concepts and quotes.
                </p>

                <a
                  href={`https://wa.me/919419178901?text=${encodeURIComponent(`Julley! I just submitted custom flower enquiry #${submittedEnquiry} for my event on ${preferredDate}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-full transition-all shadow-md"
                >
                  Discuss Urgently on WhatsApp
                </a>
              </div>
            ) : isAdmin ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center mb-5">
                  <Flower className="w-8 h-8" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3">
                  Admin Mode Active
                </span>
                <h2 className="font-serif font-bold text-2xl text-[#1C1917] mb-2">
                  Floral Request Form Disabled for Admin
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] max-w-md leading-relaxed mb-6">
                  You are logged in as an administrator. Storefront floral requests are hidden for administrative accounts. You can view, review, and fulfill customer floral requests directly from the Admin Portal.
                </p>
                <Link
                  href="/admin"
                  className="bg-[#B45309] hover:bg-[#92400E] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-full transition-all shadow-md inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Admin Portal</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                      <User className="w-4 h-4 text-[#B45309]" />
                      <input
                        type="text"
                        placeholder="e.g. Stanzin Norbu"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Phone Number / WhatsApp *
                    </label>
                    <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                      <Phone className="w-4 h-4 text-[#B45309]" />
                      <input
                        type="tel"
                        placeholder="+91 94191 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <Mail className="w-4 h-4 text-[#B45309]" />
                    <input
                      type="email"
                      placeholder="your.name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Occasion & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Occasion / Celebration *
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                    >
                      {Object.entries(FLOWER_OCCASIONS).map(([key, val]) => (
                        <option key={key} value={val}>
                          {val.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Required Date *
                    </label>
                    <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                      <Calendar className="w-4 h-4 text-[#B45309]" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Budget & Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Estimated Budget Range
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                    >
                      <option value="Under ₹1,500">Under ₹1,500 (Small Bouquet)</option>
                      <option value="₹1,500 – ₹3,500">₹1,500 – ₹3,500 (Premium Arrangement)</option>
                      <option value="₹3,500 – ₹10,000">₹3,500 – ₹10,000 (Event Centerpieces)</option>
                      <option value="₹10,000 – ₹50,000">₹10,000 – ₹50,000 (Wedding / Altar Stage)</option>
                      <option value="Above ₹50,000">Above ₹50,000 (Full Event Decor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                      Color Palette Preferences
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Traditional Gold & Yellow, Pastel Lilac & White"
                      value={colorPalette}
                      onChange={(e) => setColorPalette(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Flower Preferences */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                    Preferred Flowers
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marigolds, Lavender, Sunflowers, Cosmos, Wild Grasses"
                    value={flowerPreferences}
                    onChange={(e) => setFlowerPreferences(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                {/* Reference Image URL */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                    Inspiration / Reference Image Link (Cloudinary or Web URL)
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <ImageIcon className="w-4 h-4 text-[#B45309]" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or Cloudinary link"
                      value={referenceUrl}
                      onChange={(e) => setReferenceUrl(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Detailed Requirements */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-widest text-[#78716C] mb-1.5">
                    Event Details & Message Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide venue location in Leh, setup timing, personalized greeting card text, or specific traditional Ladakhi ceremony requirements..."
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-3.5 text-xs text-[#1C1917] font-medium focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Request..." : "Submit Custom Flower Request"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
