"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  ArrowLeft,
  Zap,
  Clock,
  Award,
  Coins,
  Footprints,
  Flame,
} from "lucide-react";
import { useGameStore } from "@/store/use-game-store";
import { ReactionTap } from "@/components/arcade/reaction-tap";
import { MemoryMatch } from "@/components/arcade/memory-match";
import { MathSprint } from "@/components/arcade/math-sprint";
import { Pip } from "@/components/mascot/pip";

type ActiveGame = "reaction" | "memory" | "math";

export default function ArcadePage() {
  const [activeGame, setActiveGame] = useState<ActiveGame>("reaction");

  const highScores = useGameStore((state) => state.arcadeHighScores);
  const unlockBadge = useGameStore((state) => state.unlockBadge);
  const xp = useGameStore((state) => state.xp);

  // Check if player unlocked the arcade master badge (played all 3 games)
  useEffect(() => {
    if (
      highScores.reactionTap > 0 &&
      highScores.memoryMatch > 0 &&
      highScores.mathSprint > 0
    ) {
      unlockBadge("arcade_master");
    }
  }, [highScores, unlockBadge]);

  const totalArcadeScore =
    highScores.reactionTap + highScores.memoryMatch + highScores.mathSprint;

  return (
    <main
      id="main-content"
      className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 select-none"
    >
      {/* Top Nav Back */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-text-muted hover:text-text bg-surface border-2 border-darkline shadow-retro-sm px-3.5 py-2 rounded-xl transition-transform active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Ke Mesin Gacha</span>
        </Link>

        <div className="text-xs font-mono font-bold bg-surface-2 border border-darkline px-3 py-1.5 rounded-lg text-text">
          <span>Total Skor Arcade: {totalArcadeScore} Pts</span>
        </div>
      </div>

      {/* Header Banner with Mascot Pip */}
      <section
        aria-labelledby="arcade-heading"
        className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6 justify-between"
      >
        <div className="space-y-3 flex-1 text-center md:text-left">
          <h1
            id="arcade-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-text tracking-tight leading-tight"
          >
            Pusat Game Instan NgapainYuk
          </h1>

          <p className="text-text-muted text-xs sm:text-sm max-w-xl leading-relaxed">
            Sedang bosan? Mainkan 3 mini game ringan langsung di peramban ini. Dapatkan skor tertinggi, koin bonus, dan lencana <strong>Jagoan Dingdong</strong>!
          </p>
        </div>

        {/* Mascot Pip */}
        <div className="shrink-0 flex items-center justify-center">
          <Pip
            expression="excited"
            speechText="Ayo coba pecahkan rekor! Reaction Tap, Memory Match, atau Math Sprint?"
            size="md"
          />
        </div>
      </section>

      {/* High Score Ticker Grid */}
      <section aria-label="Papan Skor Dingdong">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveGame("reaction")}
            className={`p-3 rounded-xl border-2 border-darkline text-center transition-all cursor-pointer ${
              activeGame === "reaction"
                ? "bg-arcade-yellow text-darkline shadow-retro-sm ring-2 ring-arcade-yellow"
                : "bg-surface text-text hover:bg-surface-2"
            }`}
          >
            <span className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase mb-1">
              <Zap size={12} className="text-arcade-purple dark:text-arcade-yellow" />
              <span>Reaction Tap</span>
            </span>
            <span className="font-mono font-black text-lg sm:text-2xl block">
              {highScores.reactionTap}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGame("memory")}
            className={`p-3 rounded-xl border-2 border-darkline text-center transition-all cursor-pointer ${
              activeGame === "memory"
                ? "bg-arcade-mint text-darkline shadow-retro-sm ring-2 ring-arcade-mint"
                : "bg-surface text-text hover:bg-surface-2"
            }`}
          >
            <span className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase mb-1">
              <Gamepad2 size={12} className="text-arcade-mint" />
              <span>Memory Match</span>
            </span>
            <span className="font-mono font-black text-lg sm:text-2xl block">
              {highScores.memoryMatch}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGame("math")}
            className={`p-3 rounded-xl border-2 border-darkline text-center transition-all cursor-pointer ${
              activeGame === "math"
                ? "bg-arcade-pink text-white shadow-retro-sm ring-2 ring-arcade-pink"
                : "bg-surface text-text hover:bg-surface-2"
            }`}
          >
            <span className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase mb-1">
              <Clock size={12} className="text-arcade-pink" />
              <span>Math Sprint</span>
            </span>
            <span className="font-mono font-black text-lg sm:text-2xl block">
              {highScores.mathSprint}
            </span>
          </button>
        </div>
      </section>

      {/* Active Game Section */}
      <section aria-label="Permainan Terpilih">
        {activeGame === "reaction" && <ReactionTap />}
        {activeGame === "memory" && <MemoryMatch />}
        {activeGame === "math" && <MathSprint />}
      </section>
    </main>
  );
}
