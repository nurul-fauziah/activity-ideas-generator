"use client";

import React from "react";
import { CategoryId, CategoryMeta } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { CategoryIcon } from "@/components/category-icon";
import { Shuffle, Check } from "lucide-react";

interface CoinPickerProps {
  selectedCategories: CategoryId[];
  isMysterySelected: boolean;
  onSelectCategory: (id: CategoryId) => void;
  onSelectMystery: () => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export function CoinPicker({
  selectedCategories,
  isMysterySelected,
  onSelectCategory,
  onSelectMystery,
  onSelectAll,
  onClear,
}: CoinPickerProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-text">
            Pilih Koin Mood
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Pilih satu atau beberapa koin suasana, atau pilih koin holografik <strong>Acak Total</strong>!
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            Pilih Semua
          </button>
          <span className="text-border">|</span>
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            Reset Koin
          </button>
        </div>
      </div>

      {/* Coins Row / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* SPECIAL MYSTERY COIN (Positioned First, Holographic, Slightly Larger) */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isMysterySelected}
          aria-label="Acak total: campuran semua kategori"
          onClick={onSelectMystery}
          className={`col-span-2 sm:col-span-1 min-h-[56px] px-3.5 py-2.5 rounded-xl border-2 border-darkline flex items-center justify-between sm:justify-center sm:flex-col gap-2 transition-all cursor-pointer select-none active:scale-95 ${
            isMysterySelected
              ? "bg-holographic text-white shadow-retro scale-[1.03] ring-3 ring-arcade-yellow"
              : "bg-surface hover:bg-holographic hover:text-white shadow-retro-sm hover:shadow-retro hover:scale-[1.02]"
          }`}
        >
          <div className="flex items-center gap-2.5 sm:flex-col sm:gap-1">
            <div className="w-8 h-8 rounded-full bg-darkline/80 text-white flex items-center justify-center border-2 border-white/60 shrink-0 shadow-inner">
              <Shuffle size={18} className="animate-spin-slow" />
            </div>
            <div className="text-left sm:text-center">
              <span className="font-display font-black text-xs sm:text-sm block leading-tight">
                Acak Total
              </span>
              <span className="text-[10px] font-mono font-bold opacity-90 block">
                +20% Bonus XP!
              </span>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 border-darkline flex items-center justify-center shrink-0 ${
              isMysterySelected
                ? "bg-arcade-yellow text-darkline font-bold"
                : "bg-surface text-transparent"
            }`}
          >
            <Check size={12} strokeWidth={3.5} />
          </div>
        </button>

        {/* Regular Category Mood Coins */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          const isDimmed = isMysterySelected;

          return (
            <button
              key={cat.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-[56px] px-3 py-2 rounded-xl border-2 border-darkline flex items-center justify-between sm:justify-center sm:flex-col gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                isDimmed
                  ? "opacity-35 grayscale-[50%] bg-surface text-text-muted border-dashed pointer-events-auto"
                  : isSelected
                  ? "shadow-retro text-white translate-x-[-1px] translate-y-[-1px]"
                  : "bg-surface text-text shadow-retro-sm hover:bg-surface-2 hover:shadow-retro"
              }`}
              style={{
                backgroundColor: isSelected && !isDimmed ? cat.color : undefined,
              }}
            >
              <div className="flex items-center gap-2.5 sm:flex-col sm:gap-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 border-darkline ${
                    isSelected && !isDimmed
                      ? "bg-white/30 text-white"
                      : "bg-surface-2 text-text"
                  }`}
                >
                  <CategoryIcon categoryId={cat.id} size={15} strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-xs sm:text-[13px] truncate leading-tight">
                  {cat.label}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 border-darkline flex items-center justify-center shrink-0 ${
                  isSelected && !isDimmed
                    ? "bg-white text-darkline font-bold"
                    : "bg-surface-2 text-transparent"
                }`}
              >
                <Check size={12} strokeWidth={3.5} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
