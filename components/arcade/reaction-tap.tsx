"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Zap, RotateCcw, Award, Coins, AlertCircle } from "lucide-react";
import { useGameStore } from "@/store/use-game-store";
import {
  playArcadeCorrectSound,
  playArcadeWrongSound,
  playArcadeWinSound,
} from "@/lib/sound-effects";

export function ReactionTap() {
  const [gameState, setGameState] = useState<
    "idle" | "waiting" | "ready" | "result" | "early"
  >("idle");
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const highScore = useGameStore((state) => state.arcadeHighScores.reactionTap);
  const updateArcadeScore = useGameStore((state) => state.updateArcadeScore);
  const soundMuted = useGameStore((state) => state.soundMuted);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTest = useCallback(() => {
    setGameState("waiting");
    setReactionTime(0);

    // Random wait between 1.6s and 3.8s
    const delay = Math.floor(Math.random() * 2200) + 1600;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState("ready");
    }, delay);
  }, []);

  const handleScreenClick = () => {
    if (gameState === "waiting") {
      // Clicked too early!
      if (timerRef.current) clearTimeout(timerRef.current);
      playArcadeWrongSound(soundMuted);
      setGameState("early");
    } else if (gameState === "ready") {
      // Successful tap!
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);

      // Score formula: 1000 - ms, clamped between 50 and 950
      const score = Math.max(50, Math.min(950, 1000 - elapsed));
      setLastScore(score);

      updateArcadeScore("reactionTap", score);

      if (elapsed < 240) {
        playArcadeWinSound(soundMuted);
      } else {
        playArcadeCorrectSound(soundMuted);
      }

      setGameState("result");
    }
  };

  const getTier = (ms: number) => {
    if (ms < 210) return { label: "Dewa Refleks (Legendary)", color: "text-arcade-yellow" };
    if (ms < 280) return { label: "Kilat Cepat (Epic)", color: "text-arcade-purple dark:text-arcade-yellow" };
    if (ms < 370) return { label: "Refleks Bagus (Rare)", color: "text-arcade-blue" };
    return { label: "Kecepatan Standar (Common)", color: "text-text-muted" };
  };

  return (
    <div className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 space-y-5 select-none">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-darkline pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-arcade-yellow text-darkline border-2 border-darkline font-mono font-black text-xs uppercase tracking-wider shadow-xs mb-1">
            <Zap size={13} />
            <span>Mini Game 01</span>
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-text">
            Reaction Tap
          </h2>
          <p className="text-text-muted text-xs sm:text-sm">
            Uji refleks instanmu. Begitu layar berubah HIJAU, klik secepat kilat!
          </p>
        </div>

        {/* High Score Badge */}
        <div className="bg-surface-2 border-2 border-darkline rounded-xl px-3.5 py-1.5 text-right shrink-0">
          <span className="block text-[10px] font-mono font-bold text-text-muted uppercase">
            Skor Tertinggi
          </span>
          <span className="font-mono font-black text-base sm:text-lg text-arcade-purple dark:text-arcade-yellow">
            {highScore} poin
          </span>
        </div>
      </div>

      {/* Main Interactive Tap Area */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleScreenClick}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") handleScreenClick();
        }}
        className={`w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border-3 border-darkline shadow-retro flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${
          gameState === "idle"
            ? "bg-surface-2 hover:bg-surface-2/80"
            : gameState === "waiting"
            ? "bg-danger text-white animate-pulse"
            : gameState === "ready"
            ? "bg-arcade-mint text-darkline scale-[1.02]"
            : gameState === "early"
            ? "bg-danger/10 border-danger text-danger"
            : "bg-surface"
        }`}
      >
        {gameState === "idle" && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-arcade-yellow border-2 border-darkline shadow-retro-sm flex items-center justify-center mx-auto text-darkline">
              <Zap size={32} />
            </div>
            <h3 className="font-display font-black text-xl text-text">
              Siap Menguji Refleksmu?
            </h3>
            <p className="text-xs sm:text-sm font-mono text-text-muted max-w-sm mx-auto">
              Klik tombol di bawah. Tunggu layar merah berubah menjadi HIJAU, lalu tap secepatnya!
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="mt-2 px-6 py-2.5 bg-arcade-purple text-white border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              Mulai Uji Refleks
            </button>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="space-y-2 text-white">
            <h3 className="font-display font-black text-2xl sm:text-3xl">
              TAHAN...
            </h3>
            <p className="text-sm font-mono font-bold opacity-90">
              Jangan klik dulu! Tunggu hingga warna berubah hijau.
            </p>
          </div>
        )}

        {gameState === "ready" && (
          <div className="space-y-2 text-darkline">
            <h3 className="font-display font-black text-3xl sm:text-5xl animate-bounce">
              TAP SEKARANG!!
            </h3>
            <p className="text-sm font-mono font-black">
              KLIK SECEPAT MUNGKIN!
            </p>
          </div>
        )}

        {gameState === "early" && (
          <div className="space-y-3 text-text">
            <div className="w-12 h-12 rounded-full bg-danger/20 text-danger border-2 border-danger flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="font-display font-black text-xl text-danger">
              Terlalu Cepat! (False Start)
            </h3>
            <p className="text-xs font-mono text-text-muted max-w-xs mx-auto">
              Kamu klik saat layar masih merah. Bersabarlah menunggu sinyal hijau ya!
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="px-5 py-2 bg-surface border-2 border-darkline shadow-retro-sm rounded-xl font-display font-bold text-xs hover:bg-surface-2 transition-transform active:scale-95 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {gameState === "result" && (
          <div className="space-y-3 text-text">
            <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider block">
              Kecepatan Reaksimu
            </span>
            <div className="font-mono font-black text-4xl sm:text-6xl text-arcade-purple dark:text-arcade-yellow">
              {reactionTime} <span className="text-xl sm:text-2xl">ms</span>
            </div>
            <div className={`font-display font-black text-sm sm:text-base ${getTier(reactionTime).color}`}>
              {getTier(reactionTime).label}
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-mint bg-arcade-mint/20 px-2.5 py-1 rounded-md border border-arcade-mint">
                <Award size={13} />
                <span>+{lastScore} Skor (+20 XP)</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-yellow bg-arcade-yellow/20 px-2.5 py-1 rounded-md border border-arcade-yellow text-darkline dark:text-arcade-yellow">
                <Coins size={13} />
                <span>+10 Koin</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startTest();
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Main Sekali Lagi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
