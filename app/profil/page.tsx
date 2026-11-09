"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ArrowLeft,
  RotateCcw,
  Flame,
  Coins,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Package,
  Zap,
  Shuffle,
  Crown,
  Compass,
  Cpu,
  Gamepad2,
  Disc,
  Pencil,
  Check,
} from "lucide-react";
import {
  useGameStore,
  calculateLevel,
  ALL_BADGES,
} from "@/store/use-game-store";
import { Pip } from "@/components/mascot/pip";

export default function ProfilPage() {
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const xp = useGameStore((state) => state.xp);
  const coins = useGameStore((state) => state.coins);
  const streak = useGameStore((state) => state.streak);
  const stats = useGameStore((state) => state.stats);
  const collectedMissions = useGameStore((state) => state.collectedMissions || []);
  const completedMissions = useGameStore((state) => state.completedMissions || []);
  const unlockedBadges = useGameStore((state) => state.unlockedBadges || []);
  const resetAllData = useGameStore((state) => state.resetAllData);

  const [hasMounted, setHasMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const levelInfo = calculateLevel(xp);

  const getPlayerTitle = (lvl: number) => {
    if (lvl >= 10) return "Legenda Gacha Arcade";
    if (lvl >= 7) return "Master Petualang";
    if (lvl >= 4) return "Kolektor Antusias";
    if (lvl >= 2) return "Pencari Inspirasi";
    return "Penjelajah Pemula";
  };

  const handleReset = () => {
    if (
      confirm(
        "Yakin ingin mereset seluruh data XP, level, koin, dan koleksimu? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      resetAllData();
      alert("Seluruh data game telah direset ke awal.");
    }
  };

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const size = 20;
    const colorClass = isUnlocked ? "text-darkline dark:text-arcade-yellow" : "text-text-muted";
    switch (iconName) {
      case "Package":
        return <Package size={size} className={colorClass} />;
      case "CheckCircle":
        return <CheckCircle2 size={size} className={colorClass} />;
      case "Flame":
        return <Flame size={size} className={colorClass} />;
      case "Zap":
        return <Zap size={size} className={colorClass} />;
      case "Shuffle":
        return <Shuffle size={size} className={colorClass} />;
      case "Crown":
        return <Crown size={size} className={colorClass} />;
      case "Compass":
        return <Compass size={size} className={colorClass} />;
      case "Cpu":
        return <Cpu size={size} className={colorClass} />;
      case "BookOpen":
        return <BookOpen size={size} className={colorClass} />;
      default:
        return <Gamepad2 size={size} className={colorClass} />;
    }
  };

  return (
    <main
      id="main-content"
      className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 select-none"
    >
      {/* Top Nav Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-text-muted hover:text-text bg-surface border-2 border-darkline shadow-retro-sm px-3.5 py-2 rounded-xl transition-transform active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Ke Mesin Gacha</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <section
        aria-labelledby="profile-heading"
        className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6 justify-between"
      >
        <div className="flex items-center gap-4 flex-1 text-center md:text-left flex-col sm:flex-row">
          <div className="w-20 h-20 rounded-2xl bg-arcade-purple border-3 border-darkline shadow-retro text-white flex flex-col items-center justify-center font-display font-black shrink-0">
            <span className="text-[10px] font-mono tracking-wider opacity-80 uppercase">Level</span>
            <span className="text-3xl leading-none">{levelInfo.level}</span>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-arcade-yellow text-darkline border border-darkline font-mono font-black text-xs uppercase tracking-wider shadow-xs">
              {getPlayerTitle(levelInfo.level)}
            </div>

            {isEditingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = inputName.trim();
                  if (trimmed) {
                    setPlayerName(trimmed);
                  }
                  setIsEditingName(false);
                }}
                className="flex items-center justify-center md:justify-start gap-2 pt-1"
              >
                <input
                  type="text"
                  maxLength={20}
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Nama panggilan..."
                  autoFocus
                  className="px-3 py-1.5 bg-surface-2 border-2 border-darkline rounded-xl text-base font-display font-black text-text focus:outline-none focus:ring-2 focus:ring-arcade-yellow shadow-retro-xs"
                />
                <button
                  type="submit"
                  aria-label="Simpan nama baru"
                  className="px-3.5 py-1.5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro-xs rounded-xl font-display font-black text-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Simpan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1.5 text-xs font-mono font-bold text-text-muted hover:text-text cursor-pointer"
                >
                  Batal
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <h1
                  id="profile-heading"
                  className="font-display font-black text-2xl sm:text-3xl text-text leading-tight truncate"
                >
                  {hasMounted && playerName ? playerName : "Pemain NgapainYuk"}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setInputName(playerName || "");
                    setIsEditingName(true);
                  }}
                  title="Ubah nama panggilan"
                  aria-label="Ubah nama panggilan"
                  className="p-1.5 rounded-lg bg-surface-2 border border-darkline shadow-retro-xs text-text hover:bg-surface text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Pencil size={13} />
                  <span className="text-[11px] hidden sm:inline">Ubah</span>
                </button>
              </div>
            )}

            <p className="text-text-muted text-xs font-mono font-bold">
              Total XP: {xp} · Progress Level: {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
            </p>

            {/* Level XP Progress Bar */}
            <div className="w-full max-w-sm h-3 bg-surface-2 border-2 border-darkline rounded-full overflow-hidden p-0.5 mt-2">
              <div
                className="h-full bg-arcade-purple dark:bg-arcade-yellow rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mascot Pip */}
        <div className="shrink-0 flex items-center justify-center">
          <Pip
            expression="happy"
            speechText={
              hasMounted && playerName
                ? `Halo ${playerName}! Levelmu ${levelInfo.level}! Terus selesaikan misi buat dapetin gelar Legenda!`
                : `Levelmu ${levelInfo.level}! Terus selesaikan misi buat dapetin gelar Legenda!`
            }
            size="md"
          />
        </div>
      </section>

      {/* Gamification Stats Summary Grid */}
      <section aria-label="Statistik Permainan">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-3 sm:p-4 text-center">
            <span className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-text-muted uppercase mb-1">
              <Disc size={13} className="text-arcade-purple" />
              <span>Total Putaran</span>
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-text">
              {stats.totalSpins}
            </span>
          </div>

          <div className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-3 sm:p-4 text-center">
            <span className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-text-muted uppercase mb-1">
              <Coins size={13} className="text-arcade-yellow" />
              <span>Koin Lemari</span>
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-arcade-yellow text-darkline dark:text-arcade-yellow">
              {coins}
            </span>
          </div>

          <div className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-3 sm:p-4 text-center">
            <span className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-text-muted uppercase mb-1">
              <BookOpen size={13} className="text-arcade-pink" />
              <span>Koleksi Terbuka</span>
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-text">
              {collectedMissions.length}
              <span className="text-xs text-text-muted font-normal"> / 90</span>
            </span>
          </div>

          <div className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-3 sm:p-4 text-center">
            <span className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-text-muted uppercase mb-1">
              <Flame size={13} className="text-danger" />
              <span>Streak Harian</span>
            </span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-danger">
              {streak.count}
              <span className="text-xs text-text-muted font-normal"> hari</span>
            </span>
          </div>
        </div>
      </section>

      {/* Daily Streak Card */}
      <section
        aria-label="Status Streak Harian"
        className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-danger/10 border-2 border-danger text-danger flex items-center justify-center shrink-0">
            <Flame size={24} className="fill-danger" />
          </div>
          <div>
            <h3 className="font-display font-black text-base text-text">
              Streak Aktivitas: {streak.count} Hari Beruntun
            </h3>
            <p className="text-xs text-text-muted font-mono">
              {streak.count >= 7
                ? "Luar biasa! Kamu menjaga kebiasaan aktif selama seminggu penuh!"
                : `Selesaikan minimal 1 misi setiap hari untuk mempertahankan apimu!`}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-extrabold text-arcade-purple dark:text-arcade-yellow bg-surface-2 px-3 py-1.5 rounded-lg border border-darkline">
          {streak.count < 3
            ? `${3 - streak.count} hari lagi ke Lencana Mulai Kebiasaan`
            : streak.count < 7
            ? `${7 - streak.count} hari lagi ke Lencana Pejuang Tangguh`
            : "Streak Maksimal Tercapai!"}
        </div>
      </section>

      {/* Achievement Badges Gallery */}
      <section aria-labelledby="badges-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="badges-heading"
              className="font-display font-black text-xl sm:text-2xl text-text leading-tight"
            >
              Galeri Lencana Prestasi
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              {unlockedBadges.length} dari {ALL_BADGES.length} lencana telah terbuka
            </p>
          </div>

          <div className="text-xs font-mono font-bold bg-surface-2 border border-darkline px-3 py-1.5 rounded-lg text-text">
            <span>+{unlockedBadges.length * 15} Koin Didapat</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`border-2 border-darkline rounded-xl p-3.5 sm:p-4 flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? "bg-surface shadow-retro-sm"
                    : "bg-surface-2/50 opacity-60 border-dashed"
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border-2 border-darkline flex items-center justify-center shrink-0 shadow-xs ${
                    isUnlocked
                      ? "bg-arcade-yellow text-darkline"
                      : "bg-slate-300 dark:bg-slate-700 text-text-muted"
                  }`}
                >
                  {isUnlocked ? (
                    renderBadgeIcon(badge.icon, true)
                  ) : (
                    <Lock size={18} className="text-text-muted" />
                  )}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className="font-display font-black text-sm sm:text-base text-text truncate">
                      {badge.name}
                    </h3>
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md border ${
                        isUnlocked
                          ? "bg-arcade-mint/20 text-arcade-mint border-arcade-mint"
                          : "bg-surface-2 text-text-muted border-darkline/40"
                      }`}
                    >
                      {isUnlocked ? "Terbuka" : "+15 Koin"}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Management Section */}
      <section className="pt-4 border-t-2 border-darkline flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-muted text-center sm:text-left">
          Seluruh progres game, lencana, koin, dan album kartu disimpan lokal di perambanmu tanpa akun dan tanpa iklan.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-danger border-2 border-darkline shadow-retro-sm px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
        >
          <RotateCcw size={14} />
          <span>Reset Semua Data Game</span>
        </button>
      </section>
    </main>
  );
}
