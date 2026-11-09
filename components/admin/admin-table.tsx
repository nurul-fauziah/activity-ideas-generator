"use client";

import React from "react";
import { Activity, CategoryId, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import {
  Edit,
  Copy,
  Trash2,
  Clock,
  Coins,
  Award,
  Users,
  Wifi,
  WifiOff,
  Smartphone,
  Laptop,
  CheckCircle,
} from "lucide-react";

interface AdminTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDuplicate: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export function AdminTable({
  activities,
  onEdit,
  onDuplicate,
  onDelete,
}: AdminTableProps) {
  const getCategoryMeta = (catId: CategoryId) => {
    return CATEGORIES.find((c) => c.id === catId);
  };

  const getRarityBadge = (rarity: Rarity) => {
    switch (rarity) {
      case "legendary":
        return {
          label: "LEGENDARY",
          classes:
            "bg-arcade-yellow text-white border-arcade-yellow font-black",
        };
      case "epic":
        return {
          label: "EPIC",
          classes:
            "bg-arcade-purple text-white dark:bg-arcade-cream dark:text-arcade-dark border-arcade-purple font-bold",
        };
      case "rare":
        return {
          label: "RARE",
          classes:
            "bg-arcade-mint text-arcade-dark border-arcade-mint font-bold",
        };
      default:
        return {
          label: "COMMON",
          classes:
            "bg-surface-2 text-text-muted border-darkline/30 font-medium",
        };
    }
  };

  if (activities.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg border-2 border-dashed border-darkline/40 bg-surface">
        <p className="font-display font-bold text-lg text-text">
          Tidak ada misi yang cocok
        </p>
        <p className="text-xs text-text-muted mt-1">
          Coba ganti kata kunci pencarian atau reset filter di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-darkline bg-surface shadow-[3px_3px_0_var(--arcade-dark)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-darkline bg-surface-2 text-xs font-mono font-bold text-text-muted uppercase">
              <th className="py-3 px-4 w-32">ID & Rarity</th>
              <th className="py-3 px-4 min-w-[280px]">Misi & Deskripsi</th>
              <th className="py-3 px-4 min-w-[160px]">Kategori</th>
              <th className="py-3 px-4 w-28 text-center">Hadiah</th>
              <th className="py-3 px-4 w-36 text-center">Kondisi</th>
              <th className="py-3 px-4 w-32 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-darkline/15 font-sans">
            {activities.map((act) => {
              const rBadge = getRarityBadge(act.rarity);

              return (
                <tr
                  key={act.id}
                  className="hover:bg-surface-2/60 transition-colors group"
                >
                  {/* ID & Rarity */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-mono text-xs font-bold text-text block mb-1">
                      {act.id}
                    </span>
                    <span
                      className={`inline-block text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider ${rBadge.classes}`}
                    >
                      {rBadge.label}
                    </span>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-bold text-text text-sm sm:text-base leading-snug">
                      {act.title}
                    </div>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                    {act.steps && act.steps.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                        <span>{act.steps.length} langkah petunjuk</span>
                        {act.free_check?.verified && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                            • 100% Free
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Categories */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {act.categories.map((catId) => {
                        const meta = getCategoryMeta(catId);
                        return (
                          <span
                            key={catId}
                            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border border-darkline/20 bg-surface-2 text-text"
                          >
                            {meta?.label || catId}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Rewards */}
                  <td className="py-3.5 px-4 align-top text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono text-xs font-bold text-arcade-yellow flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        +{act.xp} XP
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-text-muted flex items-center gap-1 mt-0.5">
                        <Coins className="w-3 h-3" />
                        +{act.coins} Koin
                      </span>
                    </div>
                  </td>

                  {/* Conditions (Duration, Social, Device, Internet) */}
                  <td className="py-3.5 px-4 align-top text-center">
                    <div className="flex flex-col items-center gap-1 text-[11px] font-mono text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        {act.duration_min} Menit
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-text-muted" />
                        {act.social === "solo" ? "Solo" : "Bareng"}
                      </span>
                      <span className="flex items-center gap-1">
                        {act.needs_internet ? (
                          <span className="text-arcade-yellow flex items-center gap-0.5">
                            <Wifi className="w-3 h-3" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <WifiOff className="w-3 h-3" /> Offline
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit(act)}
                        title="Edit Misi"
                        className="p-1.5 rounded border border-darkline/40 bg-surface hover:bg-surface-2 text-text shadow-[1px_1px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit</span>
                      </button>

                      {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => onDuplicate(act)}
                        title="Duplikat Misi"
                        className="p-1.5 rounded border border-darkline/40 bg-surface hover:bg-surface-2 text-text shadow-[1px_1px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-text-muted" />
                        <span className="sr-only">Duplikat</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(act)}
                        title="Hapus Misi"
                        className="p-1.5 rounded border border-red-500/40 bg-surface hover:bg-red-500/10 text-red-600 dark:text-red-400 shadow-[1px_1px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
