"use client";

import React from "react";
import { CategoryId, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

export type SortOption = "id-asc" | "id-desc" | "title-asc" | "xp-desc" | "duration-asc";

interface AdminFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryId | "all";
  onCategoryChange: (cat: CategoryId | "all") => void;
  selectedRarity: Rarity | "all";
  onRarityChange: (rarity: Rarity | "all") => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export function AdminFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRarity,
  onRarityChange,
  sortBy,
  onSortChange,
  onReset,
  hasActiveFilters,
  resultCount,
}: AdminFiltersProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-darkline bg-surface shadow-[2px_2px_0_var(--arcade-dark)] space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan judul, id, atau kata kunci..."
            className="w-full pl-9 pr-8 py-2 rounded-md border-2 border-darkline bg-bg text-text text-sm font-medium placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as CategoryId | "all")}
              className="appearance-none pl-3 pr-8 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow cursor-pointer"
            >
              <option value="all">Semua Kategori (9)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rarity Dropdown */}
          <div className="relative">
            <select
              value={selectedRarity}
              onChange={(e) => onRarityChange(e.target.value as Rarity | "all")}
              className="appearance-none pl-3 pr-8 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow cursor-pointer"
            >
              <option value="all">Semua Rarity</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow cursor-pointer"
            >
              <option value="id-asc">Urut: ID (A-Z)</option>
              <option value="id-desc">Urut: ID (Z-A)</option>
              <option value="title-asc">Urut: Judul (A-Z)</option>
              <option value="xp-desc">Urut: XP Terbanyak</option>
              <option value="duration-asc">Urut: Durasi Terpendek</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-arcade-yellow hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result feedback */}
      <div className="text-xs font-mono text-text-muted flex items-center justify-between">
        <span>Menampilkan {resultCount} misi</span>
        {hasActiveFilters && (
          <span className="text-arcade-yellow font-bold text-[11px]">
            * Filter aktif
          </span>
        )}
      </div>
    </div>
  );
}
