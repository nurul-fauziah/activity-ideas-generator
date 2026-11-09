"use client";

import React, { useEffect } from "react";
import { useGameStore } from "@/store/use-game-store";
import { Award, X } from "lucide-react";
import confetti from "canvas-confetti";

export function BadgeToast() {
  const newBadge = useGameStore((state) => state.newBadgeUnlocked);
  const clearNewBadge = useGameStore((state) => state.clearNewBadge);

  useEffect(() => {
    if (!newBadge) return;

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8, x: 0.85 },
        colors: ["#FFB800", "#FFC93C", "#5B3DF5", "#2FBF71"],
      });
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      clearNewBadge();
    }, 4500);

    return () => clearTimeout(timer);
  }, [newBadge, clearNewBadge]);

  if (!newBadge) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-right duration-300"
    >
      <div className="bg-surface border-3 border-darkline shadow-retro-lg rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 max-w-sm select-none">
        <div className="w-11 h-11 rounded-lg bg-arcade-yellow border-2 border-darkline shadow-retro-sm text-darkline flex items-center justify-center shrink-0">
          <Award size={24} className="fill-arcade-yellow animate-bounce" />
        </div>

        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-arcade-purple dark:text-arcade-yellow">
            <Award size={12} className="inline shrink-0" />
            <span>Lencana Baru Terbuka (+15 Koin)</span>
          </span>
          <h4 className="font-display font-black text-sm sm:text-base text-text truncate">
            {newBadge.name}
          </h4>
          <p className="text-xs text-text-muted truncate">
            {newBadge.description}
          </p>
        </div>

        <button
          type="button"
          onClick={clearNewBadge}
          className="text-text-muted hover:text-text p-1 cursor-pointer shrink-0"
          aria-label="Tutup pemberitahuan lencana"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
