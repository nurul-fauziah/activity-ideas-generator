"use client";

import React from "react";
import { Activity } from "@/types/activity";
import { Sparkles, Trophy, Clock, Users, Wifi } from "lucide-react";

interface AdminStatsProps {
  activities: Activity[];
}

export function AdminStats({ activities }: AdminStatsProps) {
  const total = activities.length;

  const rarityCounts = activities.reduce(
    (acc, act) => {
      acc[act.rarity] = (acc[act.rarity] || 0) + 1;
      return acc;
    },
    { common: 0, rare: 0, epic: 0, legendary: 0 } as Record<string, number>
  );

  const soloCount = activities.filter((a) => a.social === "solo").length;
  const groupCount = activities.filter(
    (a) => a.social === "group" || a.social === "bareng"
  ).length;

  const noDeviceCount = activities.filter(
    (a) => a.device === "none" || a.device === "tanpa-alat"
  ).length;

  const avgDuration =
    total > 0
      ? Math.round(
          activities.reduce((sum, a) => sum + (a.duration_min || 0), 0) / total
        )
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {/* Total Misi */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-text-muted uppercase block">
          Total Misi
        </span>
        <div className="text-2xl font-black font-display text-text mt-1">
          {total}
        </div>
        <span className="text-[10px] text-text-muted">Katalog Aktif</span>
      </div>

      {/* Legendary */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-arcade-yellow uppercase block">
          Legendary
        </span>
        <div className="text-2xl font-black font-display text-arcade-yellow mt-1">
          {rarityCounts.legendary}
        </div>
        <span className="text-[10px] text-text-muted">
          {total > 0 ? Math.round((rarityCounts.legendary / total) * 100) : 0}% peluang
        </span>
      </div>

      {/* Epic */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-arcade-purple dark:text-arcade-cream uppercase block">
          Epic
        </span>
        <div className="text-2xl font-black font-display text-text mt-1">
          {rarityCounts.epic}
        </div>
        <span className="text-[10px] text-text-muted">
          {total > 0 ? Math.round((rarityCounts.epic / total) * 100) : 0}% peluang
        </span>
      </div>

      {/* Rare & Common */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-arcade-mint uppercase block">
          Rare / Common
        </span>
        <div className="text-2xl font-black font-display text-text mt-1">
          {rarityCounts.rare} / {rarityCounts.common}
        </div>
        <span className="text-[10px] text-text-muted">Misi harian</span>
      </div>

      {/* Rata-rata Durasi */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-text-muted uppercase block">
          Rata Durasi
        </span>
        <div className="text-2xl font-black font-display text-text mt-1">
          {avgDuration}m
        </div>
        <span className="text-[10px] text-text-muted">Per aktivitas</span>
      </div>

      {/* Format Solo vs Bareng */}
      <div className="p-3.5 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)]">
        <span className="text-[11px] font-mono font-bold text-text-muted uppercase block">
          Solo / Bareng
        </span>
        <div className="text-2xl font-black font-display text-text mt-1">
          {soloCount} / {groupCount}
        </div>
        <span className="text-[10px] text-text-muted">{noDeviceCount} tanpa gawai</span>
      </div>
    </div>
  );
}
