"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Gamepad2,
  Coins,
  Flame,
  Disc,
  Crown,
  Zap,
  Award,
  Compass,
  RotateCcw,
  Clock,
  Footprints,
} from "lucide-react";
import { useGameStore } from "@/store/use-game-store";
import {
  playArcadeCorrectSound,
  playArcadeWrongSound,
  playArcadeWinSound,
} from "@/lib/sound-effects";

interface CardItem {
  id: number;
  iconId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICON_PAIRS = [
  { id: "gamepad", icon: Gamepad2, color: "text-arcade-purple" },
  { id: "coins", icon: Coins, color: "text-arcade-yellow" },
  { id: "flame", icon: Flame, color: "text-danger" },
  { id: "disc", icon: Disc, color: "text-arcade-blue" },
  { id: "crown", icon: Crown, color: "text-arcade-yellow" },
  { id: "zap", icon: Zap, color: "text-arcade-mint" },
  { id: "award", icon: Award, color: "text-arcade-pink" },
  { id: "compass", icon: Compass, color: "text-arcade-purple" },
];

function generateShuffledCards(): CardItem[] {
  const cards: CardItem[] = [];
  let idCounter = 0;

  ICON_PAIRS.forEach((item) => {
    // 2 cards per icon
    cards.push({ id: idCounter++, iconId: item.id, isFlipped: false, isMatched: false });
    cards.push({ id: idCounter++, iconId: item.id, isFlipped: false, isMatched: false });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function MemoryMatch() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const highScore = useGameStore((state) => state.arcadeHighScores.memoryMatch);
  const updateArcadeScore = useGameStore((state) => state.updateArcadeScore);
  const soundMuted = useGameStore((state) => state.soundMuted);

  // Initialize deck
  const startNewGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newCards = generateShuffledCards();
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedCount(0);
    setSeconds(0);
    setIsPlaying(true);
    setIsGameOver(false);
    setFinalScore(0);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (!isPlaying || isGameOver) return;
    if (flippedIndices.length >= 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.iconId === secondCard.iconId) {
        // MATCH!
        playArcadeCorrectSound(soundMuted);
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx].isMatched = true;
            next[secondIdx].isMatched = true;
            return next;
          });
          setFlippedIndices([]);
          setMatchedCount((c) => {
            const nextCount = c + 1;
            if (nextCount === ICON_PAIRS.length) {
              // Game Won!
              if (timerRef.current) clearInterval(timerRef.current);
              setIsPlaying(false);
              setIsGameOver(true);
              playArcadeWinSound(soundMuted);
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.6 },
                });
              } catch {
                // ignore
              }

              // Score calculation: 1000 - moves*25 - seconds*8
              const computedScore = Math.max(
                50,
                Math.round(1000 - (moves + 1) * 25 - seconds * 8)
              );
              setFinalScore(computedScore);
              updateArcadeScore("memoryMatch", computedScore);
            }
            return nextCount;
          });
        }, 350);
      } else {
        // MISMATCH
        playArcadeWrongSound(soundMuted);
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx].isFlipped = false;
            next[secondIdx].isFlipped = false;
            return next;
          });
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const getCardIcon = (iconId: string) => {
    const pair = ICON_PAIRS.find((p) => p.id === iconId);
    if (!pair) return null;
    const IconComp = pair.icon;
    return <IconComp size={24} className={pair.color} />;
  };

  return (
    <div className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 space-y-5 select-none">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-darkline pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-arcade-mint text-darkline border-2 border-darkline font-mono font-black text-xs uppercase tracking-wider shadow-xs mb-1">
            <Gamepad2 size={13} />
            <span>Mini Game 02</span>
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-text">
            Memory Match
          </h2>
          <p className="text-text-muted text-xs sm:text-sm">
            Temukan dan cocokkan 8 pasang ikon arcade secepat mungkin!
          </p>
        </div>

        {/* High Score & Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-surface-2 border-2 border-darkline rounded-xl px-3 py-1.5 text-right shrink-0">
            <span className="block text-[10px] font-mono font-bold text-text-muted uppercase">
              Skor Tertinggi
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-arcade-mint">
              {highScore} poin
            </span>
          </div>
        </div>
      </div>

      {/* Live In-Game Bar */}
      <div className="flex items-center justify-between bg-surface-2 border-2 border-darkline rounded-xl p-3 text-xs font-mono font-bold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-text">
            <Clock size={14} className="text-arcade-purple dark:text-arcade-yellow" />
            <span>{seconds}s</span>
          </span>
          <span className="flex items-center gap-1.5 text-text">
            <Footprints size={14} className="text-arcade-pink" />
            <span>{moves} Langkah</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted">
            Cocok: {matchedCount} / {ICON_PAIRS.length}
          </span>
          <button
            type="button"
            onClick={startNewGame}
            className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-darkline rounded-lg text-text hover:bg-surface-2 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{isPlaying ? "Ulang" : "Mulai"}</span>
          </button>
        </div>
      </div>

      {/* Main Card Grid */}
      {!isPlaying && !isGameOver ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-surface-2/40 border-2 border-dashed border-darkline/60 rounded-xl space-y-3">
          <div className="w-16 h-16 rounded-xl bg-arcade-mint text-darkline border-2 border-darkline shadow-retro-sm flex items-center justify-center mx-auto">
            <Gamepad2 size={32} />
          </div>
          <h3 className="font-display font-black text-xl text-text">
            Uji Ingatan Visualmu
          </h3>
          <p className="text-xs font-mono text-text-muted max-w-sm">
            Ada 16 kartu tersembunyi dengan 8 pasang ikon arcade. Cocokkan semuanya dalam langkah tersedikit!
          </p>
          <button
            type="button"
            onClick={startNewGame}
            className="px-6 py-2.5 bg-arcade-mint text-darkline border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Mulai Permainan
          </button>
        </div>
      ) : isGameOver ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-surface border-3 border-darkline shadow-retro rounded-xl space-y-4 animate-in zoom-in-95">
          <span className="inline-block px-3 py-1 bg-arcade-mint text-darkline border-2 border-darkline rounded-pill font-mono font-black text-xs uppercase tracking-wider">
            Selesai Sempurna!
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-text">
            Semua Pasangan Ditemukan!
          </h3>
          <p className="text-xs font-mono text-text-muted">
            Waktu: <strong>{seconds} detik</strong> · Total: <strong>{moves} langkah</strong>
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-mint bg-arcade-mint/20 px-3 py-1.5 rounded-lg border border-arcade-mint">
              <Award size={14} />
              <span>+{finalScore} Skor (+20 XP)</span>
            </span>
            <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-yellow bg-arcade-yellow/20 px-3 py-1.5 rounded-lg border border-arcade-yellow text-darkline dark:text-arcade-yellow">
              <Coins size={14} />
              <span>+10 Koin</span>
            </span>
          </div>

          <button
            type="button"
            onClick={startNewGame}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Main Lagi</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-md mx-auto">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped}
                className={`aspect-square rounded-xl border-2 border-darkline flex items-center justify-center transition-all cursor-pointer select-none active:scale-90 ${
                  card.isMatched
                    ? "bg-arcade-mint/20 border-arcade-mint shadow-none cursor-default"
                    : isRevealed
                    ? "bg-surface shadow-retro-sm scale-105"
                    : "bg-surface-2 hover:bg-surface hover:shadow-retro-xs"
                }`}
              >
                {isRevealed ? (
                  getCardIcon(card.iconId)
                ) : (
                  <span className="font-mono font-black text-lg text-text-muted/60">
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
