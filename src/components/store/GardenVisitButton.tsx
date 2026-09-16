"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import GardenVisitModal from "@/components/store/GardenVisitModal";

interface GardenVisitButtonProps {
  className?: string;
  label?: string;
}

export default function GardenVisitButton({
  className = "bg-[#B45309] hover:bg-[#92400E] text-white py-3 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all",
  label = "Schedule Garden Visit",
}: GardenVisitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
      <GardenVisitModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
