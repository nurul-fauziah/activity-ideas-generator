"use client";

import React, { useState } from "react";
import { Activity, CategoryId, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { RarityFrame } from "./rarity-frame";
import { CategoryIcon } from "@/components/category-icon";
import { useGameStore } from "@/store/use-game-store";
import {
  Clock,
  MapPin,
  Users,
  Smartphone,
  Laptop,
  Hand,
  RotateCw,
  Bookmark,
  Share2,
  CheckCircle2,
  Award,
  AlertCircle,
  Coins,
  X,
} from "lucide-react";

interface MissionCardProps {
  activity: Activity;
  isSaved: boolean;
  isMysteryBonus?: boolean;
  selectedCategories?: CategoryId[];
  onReroll: () => void;
  onToggleSave: (activity: Activity) => void;
  onShare: (activity: Activity) => void;
  onClaimReward: (activity: Activity) => void;
  onClose?: () => void;
}

export function MissionCard({
  activity,
  isSaved,
  isMysteryBonus = false,
  selectedCategories = [],
  onReroll,
  onToggleSave,
  onShare,
  onClaimReward,
  onClose,
}: MissionCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const playerName = useGameStore((state) => state.playerName);

  const mainCategory =
    CATEGORIES.find((cat) => cat.id === activity.categories[0]) || CATEGORIES[0];

  const getDeviceIcon = () => {
    switch (activity.device) {
      case "laptop":
        return <Laptop size={16} />;
      case "phone":
      case "hp":
        return <Smartphone size={16} />;
      default:
        return <Hand size={16} />;
    }
  };

  const getDeviceLabel = () => {
    switch (activity.device) {
      case "laptop":
        return "Laptop / PC";
      case "phone":
      case "hp":
        return "Cukup HP";
      default:
        return "Tanpa Alat";
    }
  };

  const getRarityBadge = () => {
    switch (activity.rarity) {
      case "legendary":
        return {
          label: "LEGENDARY",
          bg: "bg-amber-400 text-darkline border-darkline",
          xp: 100,
          coins: 40,
        };
      case "epic":
        return {
          label: "EPIC",
          bg: "bg-purple-600 text-white border-darkline",
          xp: 50,
          coins: 20,
        };
      case "rare":
        return {
          label: "RARE",
          bg: "bg-blue-500 text-white border-darkline",
          xp: 25,
          coins: 10,
        };
      default:
        return {
          label: "COMMON",
          bg: "bg-slate-300 dark:bg-slate-700 text-darkline dark:text-white border-darkline",
          xp: 10,
          coins: 5,
        };
    }
  };

  const rarityMeta = getRarityBadge();
  const calculatedXp = isMysteryBonus ? Math.round(rarityMeta.xp * 1.2) : rarityMeta.xp;

  const isPsychologyCategory = activity.categories.includes("psikologi");

  return (
    <RarityFrame rarity={activity.rarity} className="w-full">
      {/* Top Banner / Card Header */}
      <div className="bg-surface-2 px-5 py-3 border-b-2 border-darkline flex flex-wrap items-center justify-between gap-3">
        {/* Left: Serial Number & Rarity */}
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-xs bg-darkline text-white px-2 py-0.5 rounded-md">
            #{activity.id.replace(/^[a-z]+-/, "")}
          </span>
          <span
            className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-md border-2 uppercase tracking-wide ${rarityMeta.bg}`}
          >
            {rarityMeta.label}
          </span>
          {isMysteryBonus ? (
            <span className="font-mono font-extrabold text-[11px] bg-arcade-yellow text-darkline px-2 py-0.5 rounded-md border border-darkline animate-pulse">
              +20% XP Bonus!
            </span>
          ) : null}
        </div>

        {/* Right: Reward Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-arcade-mint/20 border border-darkline text-darkline dark:text-white px-2 py-0.5 rounded-md text-xs font-mono font-extrabold">
            <Award size={13} className="text-arcade-mint" />
            <span>+{calculatedXp} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-arcade-yellow/20 border border-darkline text-darkline dark:text-white px-2 py-0.5 rounded-md text-xs font-mono font-extrabold">
            <Coins size={13} className="text-arcade-yellow fill-arcade-yellow" />
            <span>+{rarityMeta.coins} Koin</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(activity)}
            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan kartu ini"}
            className="w-8 h-8 rounded-md bg-surface border-2 border-darkline shadow-retro-sm flex items-center justify-center text-text hover:bg-surface-2 transition-transform active:scale-90 cursor-pointer ml-1"
          >
            <Bookmark size={15} className={isSaved ? "fill-arcade-purple text-arcade-purple" : ""} />
          </button>

          <button
            type="button"
            onClick={() => onShare(activity)}
            aria-label="Bagikan misi ini"
            className="w-8 h-8 rounded-md bg-surface border-2 border-darkline shadow-retro-sm flex items-center justify-center text-text hover:bg-surface-2 transition-transform active:scale-90 cursor-pointer"
          >
            <Share2 size={15} />
          </button>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pop-up hasil misi"
              className="w-8 h-8 rounded-md bg-surface border-2 border-darkline shadow-retro-sm flex items-center justify-center text-text hover:bg-surface-2 transition-transform active:scale-90 cursor-pointer ml-1"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Category Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-display font-black text-white border-2 border-darkline shadow-retro-sm"
            style={{ backgroundColor: mainCategory.color }}
          >
            <CategoryIcon categoryId={mainCategory.id} size={13} strokeWidth={2.8} />
            <span>{mainCategory.label}</span>
          </span>
        </div>

        {/* Title & Description */}
        <div>
          {playerName ? (
            <span className="font-mono font-bold text-xs text-arcade-purple dark:text-arcade-yellow tracking-wider uppercase block mb-1.5">
              Misi Spesial untuk {playerName}:
            </span>
          ) : null}
          <h3 className="font-display font-black text-2xl sm:text-3xl text-text leading-tight mb-2">
            {activity.title}
          </h3>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Structured Meta Row - Solid retro border all around with clean rounded corners */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 border-2 border-darkline bg-surface-2 rounded-2xl shadow-retro-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text">
            <div className="w-7 h-7 rounded-lg bg-surface border border-darkline flex items-center justify-center shrink-0 shadow-2xs">
              <Clock size={14} className="text-arcade-purple" />
            </div>
            <span>{activity.duration_min} Menit</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text">
            <div className="w-7 h-7 rounded-lg bg-surface border border-darkline flex items-center justify-center shrink-0 shadow-2xs">
              <MapPin size={14} className="text-arcade-purple" />
            </div>
            <span>{activity.place === "indoor" ? "Dalam Ruang" : "Luar Ruang"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text">
            <div className="w-7 h-7 rounded-lg bg-surface border border-darkline flex items-center justify-center shrink-0 shadow-2xs">
              <Users size={14} className="text-arcade-purple" />
            </div>
            <span>{activity.social === "solo" ? "Sendiri (Solo)" : "Bareng Orang"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-text">
            <div className="w-7 h-7 rounded-lg bg-surface border border-darkline flex items-center justify-center shrink-0 shadow-2xs">
              <span className="text-arcade-purple">{getDeviceIcon()}</span>
            </div>
            <span>{getDeviceLabel()}</span>
          </div>
        </div>

        {/* Step-by-Step Action Plan */}
        <div>
          <h4 className="font-mono font-black text-xs uppercase tracking-wider text-text-muted mb-2.5">
            Langkah Menjalankan Misi:
          </h4>
          <ol className="space-y-2">
            {activity.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-text"
              >
                <span className="w-5 h-5 rounded-md bg-arcade-yellow text-darkline font-mono font-black text-xs border border-darkline flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <span className="leading-snug pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Psychology Category Disclaimer if applicable */}
        {isPsychologyCategory ? (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 rounded-xl text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-purple-600" />
            <span>
              <strong>Catatan:</strong> Aktivitas ini bersifat refleksi mandiri umum, bukan pengganti bantuan psikologis profesional.
            </span>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsCompleted(true);
              onClaimReward(activity);
            }}
            disabled={isCompleted}
            className={`flex-1 min-h-[50px] px-6 rounded-pill border-3 border-darkline font-display font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? "bg-arcade-mint text-darkline shadow-none cursor-default"
                : "bg-arcade-yellow text-darkline shadow-retro hover:scale-[1.02] active:scale-95 hover:shadow-retro-lg"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} />
                <span>Misi Selesai! Hadiah Diklaim</span>
              </>
            ) : (
              <>
                <Award size={18} />
                <span>Terima Misi & Klaim Hadiah</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReroll}
            className="sm:w-auto min-h-[50px] px-6 rounded-pill bg-surface border-3 border-darkline text-text shadow-retro font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-2 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCw size={16} />
            <span>Putar Mesin Lagi</span>
          </button>
        </div>
      </div>
    </RarityFrame>
  );
}
