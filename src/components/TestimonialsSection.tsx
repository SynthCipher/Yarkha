"use client";

import React, { useState } from "react";
import { TESTIMONIALS, FAQS } from "@/data/farmhouseData";
import { Star, ChevronDown, HelpCircle, MessageSquareQuote } from "lucide-react";

export default function TestimonialsSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#F3EDE2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DEC9] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Guest Chronicles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
            Memories Carved by the Indus
          </h2>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#FAF7F2] p-8 rounded-3xl shadow-lg border border-stone-200/80 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-6 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                <p className="font-serif italic text-base sm:text-lg text-[#292524] leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  {t.guestName}
                </h4>
                <p className="text-xs text-[#78716C] mt-0.5">
                  {t.origin} · <span className="text-[#B45309]">{t.tripType}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DEC9] text-[#92400E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Traveler Information</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif font-semibold text-base sm:text-lg text-[#1C1917] hover:text-[#B45309] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#78716C] transition-transform duration-300 shrink-0 ${
                      openFaq === idx ? "rotate-180 text-[#B45309]" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-[#57534E] leading-relaxed font-sans border-t border-stone-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
