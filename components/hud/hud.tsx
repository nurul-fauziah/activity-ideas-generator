"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameStore, calculateLevel } from "@/store/use-game-store";
import { useTheme } from "@/components/theme-provider";
import { startBGM, stopBGM } from "@/lib/arcade-bgm";
import {
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Music,
  Sun,
  Moon,
  Gamepad2,
  BookOpen,
  User,
  Disc,
} from "lucide-react";

export function HUD() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const xp = useGameStore((state) => state.xp);
  const coins = useGameStore((state) => state.coins);
  const streak = useGameStore((state) => state.streak);
  const soundMuted = useGameStore((state) => state.soundMuted);
  const setSoundMuted = useGameStore((state) => state.setSoundMuted);
  const playerName = useGameStore((state) => state.playerName);

  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const levelInfo = calculateLevel(xp);

  // Profile label: player name if filled, else "Profil"
  const profileLabel =
    hasMounted && playerName && playerName.trim() !== ""
      ? playerName
      : "Profil";

  // Sync BGM with sound state
  useEffect(() => {
    if (!soundMuted) {
      startBGM();
    } else {
      stopBGM();
    }

    return () => {
      stopBGM();
    };
  }, [soundMuted]);

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      startBGM();
    } else {
      stopBGM();
    }
  };

  const navLinks = [
    { href: "/", label: "Mesin", icon: Disc },
    { href: "/koleksi", label: "Koleksi", icon: BookOpen },
    { href: "/arcade", label: "Arcade", icon: Gamepad2 },
    { href: "/profil", label: "Profil", icon: User },
  ];

  return (
    <>
      {/* Top HUD Bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-xs border-b-2 border-darkline select-none">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand + Level & XP Bar */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Retro Brand Mark: Custom Gashapon Mascot Emblem & Logotype */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
              aria-label="Kembali ke Mesin Gacha Beranda"
            >
              {/* Custom Gacha Capsule Mascot Emblem */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface border-2 border-darkline shadow-retro-sm p-1 flex items-center justify-center group-hover:scale-105 group-hover:rotate-6 transition-all shrink-0 relative overflow-hidden bg-gradient-to-b from-arcade-purple/15 to-arcade-yellow/15">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Pip Antenna in Rosy Copper & Blackberry Cream */}
                  <path
                    d="M 20 8 L 20 4"
                    stroke="#503047"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="20"
                    cy="4"
                    r="2.5"
                    fill="#C05746"
                    stroke="#503047"
                    strokeWidth="1.5"
                  />

                  {/* Capsule Shell Top (Blackberry Cream) */}
                  <path
                    d="M 8 20 C 8 13.5 13.5 9 20 9 C 26.5 9 32 13.5 32 20 Z"
                    fill="#503047"
                    stroke="#503047"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Glossy Reflection Highlight */}
                  <path
                    d="M 12 16 C 14 12 18 11 22 11"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />

                  {/* Capsule Seam Rim (Rosy Copper Belt) */}
                  <rect
                    x="7"
                    y="19"
                    width="26"
                    height="3"
                    rx="1.5"
                    fill="#C05746"
                    stroke="#503047"
                    strokeWidth="1.5"
                  />

                  {/* Capsule Shell Bottom (Pure White) */}
                  <path
                    d="M 8 21 C 8 27.5 13.5 33 20 33 C 26.5 33 32 27.5 32 21 Z"
                    fill="#FFFFFF"
                    stroke="#503047"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Pip Eyes */}
                  <circle cx="15.5" cy="17" r="1.8" fill="#FFFFFF" />
                  <circle cx="24.5" cy="17" r="1.8" fill="#FFFFFF" />
                  <circle cx="15.8" cy="17" r="1" fill="#503047" />
                  <circle cx="24.8" cy="17" r="1" fill="#503047" />

                  {/* Cheerful Mouth */}
                  <path
                    d="M 17.5 24 Q 20 27 22.5 24"
                    stroke="#503047"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Cute Cheek Blushes in Muted Olive / Soft Copper */}
                  <ellipse cx="12" cy="24" rx="1.5" ry="1" fill="#C05746" opacity="0.6" />
                  <ellipse cx="28" cy="24" rx="1.5" ry="1" fill="#C05746" opacity="0.6" />
                </svg>
              </div>

              {/* Dynamic Styled Wordmark */}
              <div className="flex flex-col -space-y-0.5">
                <span className="font-display font-black text-lg sm:text-xl text-text tracking-tight flex items-center leading-tight">
                  <span>Ngapain</span>
                  <span className="text-arcade-purple dark:text-arcade-yellow ml-0.5">Yuk</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-text-muted hidden sm:block">
                  Arcade Gacha Misi
                </span>
              </div>
            </Link>

            {/* Level & XP Gauge */}
            <div className="flex items-center gap-2 bg-surface-2 border-2 border-darkline shadow-retro-sm rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5">
              <div className="bg-arcade-yellow text-darkline font-mono font-black text-xs sm:text-sm px-1.5 py-0.5 rounded-sm border border-darkline shrink-0">
                LV.{levelInfo.level}
              </div>
              <div className="flex flex-col gap-0.5 w-20 sm:w-28">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-text-muted leading-none">
                  <span>XP</span>
                  <span>{levelInfo.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full border border-darkline overflow-hidden">
                  <div
                    className="h-full bg-arcade-mint transition-all duration-300"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const label = item.href === "/profil" ? profileLabel : item.label;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-display font-bold text-sm border-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-arcade-yellow text-darkline border-darkline shadow-retro-sm"
                      : "bg-transparent text-text border-transparent hover:border-darkline hover:bg-surface-2"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="max-w-[110px] truncate">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Currency & Toggles */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Coins Counter */}
            <div
              className="flex items-center gap-1.5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro-sm rounded-lg px-2.5 sm:px-3 py-1 font-mono font-extrabold text-xs sm:text-sm"
              title="Koin Anda (dipakai untuk putaran ekstra)"
            >
              <Coins size={16} className="fill-current" />
              <span>{coins}</span>
            </div>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 bg-arcade-pink text-white border-2 border-darkline shadow-retro-sm rounded-lg px-2 sm:px-2.5 py-1 font-mono font-extrabold text-xs sm:text-sm"
              title={`Streak Harian: ${streak.count} hari berturut-turut!`}
            >
              <Flame size={16} className="fill-current" />
              <span>{streak.count}</span>
            </div>

            {/* Audio & BGM Music Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundMuted ? "Putar musik arcade & aktifkan suara" : "Senyapkan musik & suara"}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-darkline shadow-retro-sm flex items-center justify-center transition-all cursor-pointer ${
                soundMuted
                  ? "bg-surface text-text-muted hover:bg-surface-2"
                  : "bg-arcade-yellow text-darkline shadow-retro-xs scale-105"
              }`}
            >
              {soundMuted ? (
                <VolumeX size={18} />
              ) : (
                <div className="flex items-center justify-center relative">
                  <Volume2 size={18} className="text-darkline animate-pulse" />
                </div>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ganti ke mode arcade siang" : "Ganti ke mode arcade malam"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface border-2 border-darkline shadow-retro-sm flex items-center justify-center text-text hover:bg-surface-2 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-arcade-yellow" />
              ) : (
                <Moon size={18} className="text-arcade-purple" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Ponsel Bawah"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xs border-t-2 border-darkline py-1.5 px-3 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const label = item.href === "/profil" ? profileLabel : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-xs font-display font-bold transition-transform cursor-pointer active:scale-95 ${
                isActive
                  ? "text-arcade-purple dark:text-arcade-yellow font-black"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <div
                className={`p-1 rounded-md border-2 ${
                  isActive
                    ? "bg-arcade-yellow text-darkline border-darkline shadow-retro-sm"
                    : "border-transparent text-current"
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="text-[11px] max-w-[65px] truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
