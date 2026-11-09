"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Flame,
  Clock,
  RotateCcw,
  Award,
  Coins,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { useGameStore } from "@/store/use-game-store";
import {
  playArcadeCorrectSound,
  playArcadeWrongSound,
  playArcadeWinSound,
} from "@/lib/sound-effects";

interface MathQuestion {
  text: string;
  correctAnswer: number;
  options: number[];
}

function generateMathQuestion(): MathQuestion {
  const operations = ["+", "-", "*"];
  const op = operations[Math.floor(Math.random() * operations.length)];

  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  if (op === "+") {
    num1 = Math.floor(Math.random() * 45) + 6;
    num2 = Math.floor(Math.random() * 45) + 6;
    answer = num1 + num2;
  } else if (op === "-") {
    num1 = Math.floor(Math.random() * 60) + 20;
    num2 = Math.floor(Math.random() * (num1 - 5)) + 5;
    answer = num1 - num2;
  } else {
    // Multiplication
    num1 = Math.floor(Math.random() * 10) + 3;
    num2 = Math.floor(Math.random() * 9) + 3;
    answer = num1 * num2;
  }

  // Generate 3 unique distractors
  const optionsSet = new Set<number>([answer]);
  const offsets = [-10, -5, -2, -1, 1, 2, 3, 5, 10];

  while (optionsSet.size < 4) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const candidate = answer + offset;
    if (candidate > 0 && candidate !== answer) {
      optionsSet.add(candidate);
    }
  }

  const options = Array.from(optionsSet);
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    text: `${num1} ${op === "*" ? "×" : op} ${num2}`,
    correctAnswer: answer,
    options,
  };
}

export function MathSprint() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const highScore = useGameStore((state) => state.arcadeHighScores.mathSprint);
  const updateArcadeScore = useGameStore((state) => state.updateArcadeScore);
  const soundMuted = useGameStore((state) => state.soundMuted);

  const endGame = useCallback(() => {
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
  }, [soundMuted]);

  // Start new round
  const startSprint = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setFeedback(null);
    setCurrentQuestion(generateMathQuestion());
    setIsPlaying(true);
    setIsGameOver(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [endGame]);

  // Handle score update when game finishes
  useEffect(() => {
    if (isGameOver && score > 0) {
      updateArcadeScore("mathSprint", score);
    }
  }, [isGameOver, score, updateArcadeScore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectAnswer = (chosen: number) => {
    if (!isPlaying || !currentQuestion) return;

    setAnsweredCount((c) => c + 1);

    if (chosen === currentQuestion.correctAnswer) {
      // Correct!
      playArcadeCorrectSound(soundMuted);
      setFeedback("correct");

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setScore((s) => s + 10 * multiplier);
      setCorrectCount((c) => c + 1);
    } else {
      // Wrong!
      playArcadeWrongSound(soundMuted);
      setFeedback("wrong");
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(generateMathQuestion());
    }, 280);
  };

  return (
    <div className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 space-y-5 select-none">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-darkline pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-arcade-pink text-white border-2 border-darkline font-mono font-black text-xs uppercase tracking-wider shadow-xs mb-1">
            <Zap size={13} />
            <span>Mini Game 03</span>
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-text">
            Math Sprint 30s
          </h2>
          <p className="text-text-muted text-xs sm:text-sm">
            Jawab hitungan sebanyak mungkin dalam 30 detik. Raih combo untuk multiplier skor!
          </p>
        </div>

        {/* High Score */}
        <div className="bg-surface-2 border-2 border-darkline rounded-xl px-3.5 py-1.5 text-right shrink-0">
          <span className="block text-[10px] font-mono font-bold text-text-muted uppercase">
            Skor Tertinggi
          </span>
          <span className="font-mono font-black text-sm sm:text-base text-arcade-pink">
            {highScore} poin
          </span>
        </div>
      </div>

      {/* In-Game HUD Bar */}
      <div className="flex items-center justify-between bg-surface-2 border-2 border-darkline rounded-xl p-3 text-xs font-mono font-bold">
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-1.5 font-black ${
              timeLeft <= 5 ? "text-danger animate-ping" : "text-text"
            }`}
          >
            <Clock size={14} className="text-arcade-purple dark:text-arcade-yellow" />
            <span>{timeLeft}s</span>
          </span>

          <span className="flex items-center gap-1 text-arcade-yellow text-darkline dark:text-arcade-yellow">
            <Flame size={14} className="text-danger" />
            <span>Combo: x{streak >= 5 ? 3 : streak >= 3 ? 2 : 1} ({streak})</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-sm text-arcade-purple dark:text-arcade-yellow">
            {score} Pts
          </span>
          <button
            type="button"
            onClick={startSprint}
            className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-darkline rounded-lg text-text hover:bg-surface-2 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{isPlaying ? "Ulang" : "Mulai"}</span>
          </button>
        </div>
      </div>

      {/* Main Play Area */}
      {!isPlaying && !isGameOver ? (
        <div className="min-h-[260px] flex flex-col items-center justify-center text-center p-6 bg-surface-2/40 border-2 border-dashed border-darkline/60 rounded-xl space-y-3">
          <div className="w-16 h-16 rounded-xl bg-arcade-pink text-white border-2 border-darkline shadow-retro-sm flex items-center justify-center mx-auto">
            <Zap size={32} />
          </div>
          <h3 className="font-display font-black text-xl text-text">
            Siap Uji Kecepatan Hitungmu?
          </h3>
          <p className="text-xs font-mono text-text-muted max-w-sm">
            Waktu hanya 30 detik! Jawab benar berturut-turut untuk melipatgandakan poin combo.
          </p>
          <button
            type="button"
            onClick={startSprint}
            className="px-6 py-2.5 bg-arcade-pink text-white border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Mulai Sprint (30 Detik)
          </button>
        </div>
      ) : isGameOver ? (
        <div className="min-h-[260px] flex flex-col items-center justify-center text-center p-6 bg-surface border-3 border-darkline shadow-retro rounded-xl space-y-4 animate-in zoom-in-95">
          <span className="inline-block px-3 py-1 bg-arcade-pink text-white border-2 border-darkline rounded-pill font-mono font-black text-xs uppercase tracking-wider">
            Waktu Habis!
          </span>
          <h3 className="font-display font-black text-3xl text-text">
            Skor Akhir: {score} Poin
          </h3>
          <p className="text-xs font-mono text-text-muted">
            Benar: <strong>{correctCount} / {answeredCount} soal</strong> · Streak Tertinggi: <strong>{maxStreak}x</strong>
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-mint bg-arcade-mint/20 px-3 py-1.5 rounded-lg border border-arcade-mint">
              <Award size={14} />
              <span>+{score} Skor (+20 XP)</span>
            </span>
            <span className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-yellow bg-arcade-yellow/20 px-3 py-1.5 rounded-lg border border-arcade-yellow text-darkline dark:text-arcade-yellow">
              <Coins size={14} />
              <span>+10 Koin</span>
            </span>
          </div>

          <button
            type="button"
            onClick={startSprint}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro rounded-pill font-display font-black text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Main Sekali Lagi</span>
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-6 max-w-md mx-auto">
          {/* Question Display Card */}
          <div
            className={`min-h-[110px] rounded-2xl border-3 border-darkline shadow-retro flex items-center justify-center text-center p-4 transition-all ${
              feedback === "correct"
                ? "bg-arcade-mint/20 border-arcade-mint scale-[1.02]"
                : feedback === "wrong"
                ? "bg-danger/20 border-danger"
                : "bg-surface"
            }`}
          >
            <span className="font-mono font-black text-3xl sm:text-4xl text-text tracking-wider">
              {currentQuestion.text} = ?
            </span>
          </div>

          {/* 4 Answer Choice Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(opt)}
                className="min-h-[58px] rounded-xl bg-surface border-2 border-darkline shadow-retro-sm hover:bg-surface-2 active:scale-95 transition-all font-mono font-black text-xl text-text flex items-center justify-center cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
