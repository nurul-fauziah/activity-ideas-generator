"use client";

import React from "react";
import { Rarity } from "@/types/activity";

interface RarityFrameProps {
  rarity: Rarity;
  children: React.ReactNode;
  className?: string;
}

export function RarityFrame({ rarity, children, className = "" }: RarityFrameProps) {
  const getFrameStyles = () => {
    switch (rarity) {
      case "legendary":
        return "border-3 border-[#FFB800] bg-surface shadow-[6px_6px_0px_#1F1A2B] shimmer-gold ring-2 ring-[#FFB800]/50";
      case "epic":
        return "border-3 border-[#9B51E0] bg-surface shadow-[5px_5px_0px_#1F1A2B] ring-2 ring-[#9B51E0]/40";
      case "rare":
        return "border-3 border-[#3D8BFD] bg-surface shadow-[5px_5px_0px_#1F1A2B] ring-2 ring-[#3D8BFD]/30";
      default:
        return "border-3 border-darkline bg-surface shadow-retro-lg";
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all ${getFrameStyles()} ${className}`}>
      {children}
    </div>
  );
}
