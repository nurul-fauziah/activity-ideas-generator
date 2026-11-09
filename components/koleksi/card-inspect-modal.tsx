"use client";

import React from "react";
import { Activity, CategoryId } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import {
  X,
  Clock,
  MapPin,
  Users,
  Laptop,
  CheckCircle2,
  Award,
  Coins,
  Bookmark,
  Share2,
} from "lucide-react";
import { useGameStore } from "@/store/use-game-store";

interface CardInspectModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (activity: Activity) => void;
}

export function CardInspectModal({
  activity,
  isOpen,
  onClose,
  onShare,
}: CardInspectModalProps) {
  const isSaved = useGameStore((state) =>
    activity ? state.savedMissions.includes(activity.id) : false
  );
  const toggleSaveMission = useGameStore((state) => state.toggleSaveMission);
  const completeMission = useGameStore((state) => state.completeMission);
  const isCompleted = useGameStore((state) =>
    activity
      ? state.completedMissions.some((m) => m.id === activity.id)
      : false
  );
  const playerName = useGameStore((state) => state.playerName);

  if (!isOpen || !activity) return null;

  const category =
    CATEGORIES.find((cat) => cat.id === activity.categories[0]) || CATEGORIES[0];

  const getRarityBadgeStyle = () => {
    switch (activity.rarity) {
      case "rare":
        return "bg-arcade-blue text-white border-darkline";
      case "epic":
        return "bg-arcade-purple text-white border-darkline";
      case "legendary":
        return "bg-arcade-yellow text-darkline border-darkline";
      default:
        return "bg-slate-200 dark:bg-slate-800 text-text border-darkline";
    }
  };

  const handleToggleSave = () => {
    toggleSaveMission(activity.id);
  };

  const handleClaim = () => {
    if (!isCompleted) {
      completeMission(activity);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspect-card-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface border-3 border-darkline shadow-retro-xl rounded-2xl overflow-hidden my-8 select-none">
        {/* Header Bar */}
        <div className="bg-surface-2 px-5 py-3 border-b-2 border-darkline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs bg-darkline text-white px-2 py-0.5 rounded-md">
              #{activity.id.replace(/^[a-z]+-/, "")}
            </span>
            <span
              className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-md border-2 uppercase tracking-wide ${getRarityBadgeStyle()}`}
            >
              {activity.rarity}
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">
              {category.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail kartu"
            className="w-8 h-8 rounded-lg bg-surface border-2 border-darkline flex items-center justify-center text-text hover:bg-surface-2 transition-transform active:scale-90 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title & Description */}
          <div>
            {playerName ? (
              <span className="font-mono font-bold text-xs text-arcade-purple dark:text-arcade-yellow tracking-wider uppercase block mb-1">
                Misi untuk {playerName}:
              </span>
            ) : null}
            <h2
              id="inspect-card-title"
              className="font-display font-black text-xl sm:text-2xl text-text leading-tight mb-2"
            >
              {activity.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-darkline rounded-lg text-text">
              <Clock size={13} className="text-arcade-purple dark:text-arcade-yellow" />
              <span>{activity.duration_min} menit</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-darkline rounded-lg text-text">
              <MapPin size={13} className="text-arcade-mint" />
              <span>{activity.place === "indoor" ? "Indoor" : "Outdoor"}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-darkline rounded-lg text-text">
              <Users size={13} className="text-arcade-pink" />
              <span>{activity.social === "solo" ? "Solo" : "Bareng"}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-darkline rounded-lg text-text">
              <Laptop size={13} className="text-arcade-blue" />
              <span>{activity.device === "none" ? "Tanpa Alat" : activity.device === "phone" ? "Cukup HP" : "Laptop/PC"}</span>
            </span>
          </div>

          {/* Steps Section */}
          <div className="bg-surface-2/60 border-2 border-darkline rounded-xl p-4 space-y-2.5">
            <h4 className="font-mono font-extrabold text-xs uppercase tracking-wider text-text flex items-center gap-1.5">
              <span>Langkah Misi</span>
            </h4>
            <ol className="space-y-2 text-xs sm:text-sm text-text list-decimal list-inside leading-relaxed">
              {activity.steps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Rewards Row */}
          <div className="flex items-center justify-between p-3 bg-surface border-2 border-darkline rounded-xl">
            <span className="text-xs font-mono font-bold text-text-muted">
              Hadiah Misi
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-mint">
                <Award size={14} />
                <span>+{activity.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-arcade-yellow text-darkline dark:text-arcade-yellow">
                <Coins size={14} />
                <span>+{activity.coins} Koin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-surface-2 p-4 border-t-2 border-darkline flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`min-h-[44px] px-4 rounded-xl border-2 border-darkline font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? "bg-arcade-yellow text-darkline shadow-retro-sm"
                : "bg-surface text-text hover:bg-surface-2"
            }`}
          >
            <Bookmark size={15} className={isSaved ? "fill-darkline" : ""} />
            <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
          </button>

          <button
            type="button"
            onClick={() => onShare(activity)}
            className="min-h-[44px] px-4 rounded-xl bg-surface border-2 border-darkline text-text hover:bg-surface-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 size={15} />
            <span>Bagikan</span>
          </button>

          <button
            type="button"
            onClick={handleClaim}
            disabled={isCompleted}
            className={`flex-1 min-h-[44px] px-4 rounded-xl border-2 border-darkline font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? "bg-arcade-mint text-darkline cursor-default"
                : "bg-arcade-purple text-white shadow-retro-sm hover:scale-[1.02] active:scale-95"
            }`}
          >
            <CheckCircle2 size={16} />
            <span>{isCompleted ? "Misi Selesai" : "Selesaikan Misi"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
