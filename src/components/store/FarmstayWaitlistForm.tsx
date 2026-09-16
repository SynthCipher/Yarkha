"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function FarmstayWaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [season, setSeason] = useState("Spring Blossom (April – May)");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-stone-900/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-sm text-center">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2">
          You&apos;re on the Opening Waitlist!
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed font-light">
          Julley, {name}! Thank you for your interest in Stakna Farmstay. We will contact you at{" "}
          <span className="text-amber-300 font-medium">{email}</span> with private preview invitations before reservations open to the public.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/90 border border-stone-800 p-8 rounded-3xl backdrop-blur-sm">
      <h3 className="text-xl font-serif font-bold text-white mb-2">
        Join Private Opening Waitlist
      </h3>
      <p className="text-xs text-stone-400 mb-6 font-light">
        Receive behind-the-scenes building updates and priority reservation window.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-stone-300 font-medium mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Tsering Dorjey"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. tsering@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-stone-300 font-medium mb-1">Preferred Visit Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          >
            <option>Spring Blossom (April – May)</option>
            <option>High Summer & Harvest (June – August)</option>
            <option>Golden Autumn & Pashmina Weaving (September – October)</option>
            <option>Crisp Winter Retreat & Stargazing (November – February)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <span>Request Early Access</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
