import React, { useState } from "react";
import { OptionalFilters } from "@/types/activity";
import { SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";

interface ExtraFiltersProps {
  filters: OptionalFilters;
  onChange: (updated: OptionalFilters) => void;
  onReset: () => void;
}

export function ExtraFilters({
  filters,
  onChange,
  onReset,
}: ExtraFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount =
    (filters.duration !== "all" ? 1 : 0) +
    (filters.place !== "all" ? 1 : 0) +
    (filters.social !== "all" ? 1 : 0) +
    (filters.device !== "all" ? 1 : 0);

  return (
    <div className="w-full bg-surface border border-border rounded-lg transition-all overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="filter-panel"
        className="w-full min-h-[48px] px-5 py-3 flex items-center justify-between text-left hover:bg-surface-2 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={18} className="text-primary" />
          <span className="font-semibold text-text text-sm sm:text-base">
            Filter Tambahan (Opsional)
          </span>
          {activeCount > 0 ? (
            <span className="px-2 py-0.5 text-xs font-bold rounded-pill bg-primary text-primary-contrast">
              {activeCount} aktif
            </span>
          ) : null}
        </div>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div id="filter-panel" className="p-5 border-t border-border space-y-5 bg-surface-2/40">
          {/* Durasi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Durasi Maksimal
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "≤ 5 mnt", value: "5" },
                { label: "≤ 15 mnt", value: "15" },
                { label: "≤ 30 mnt", value: "30" },
                { label: "60+ mnt", value: "60+" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      duration: opt.value as OptionalFilters["duration"],
                    })
                  }
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-pill border transition-all cursor-pointer ${
                    filters.duration === opt.value
                      ? "bg-primary text-primary-contrast border-primary"
                      : "bg-surface text-text border-border hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tempat */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Lokasi / Tempat
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "Dalam Ruangan", value: "indoor" },
                { label: "Luar Ruangan", value: "outdoor" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      place: opt.value as OptionalFilters["place"],
                    })
                  }
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-pill border transition-all cursor-pointer ${
                    filters.place === opt.value
                      ? "bg-primary text-primary-contrast border-primary"
                      : "bg-surface text-text border-border hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sosial */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Jumlah Orang
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "Sendiri (Solo)", value: "solo" },
                { label: "Bareng Teman/Keluarga", value: "bareng" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      social: opt.value as OptionalFilters["social"],
                    })
                  }
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-pill border transition-all cursor-pointer ${
                    filters.social === opt.value
                      ? "bg-primary text-primary-contrast border-primary"
                      : "bg-surface text-text border-border hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Perangkat */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Perangkat yang Dibutuhkan
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "Tanpa Alat", value: "tanpa-alat" },
                { label: "Cukup HP", value: "hp" },
                { label: "Laptop / PC", value: "laptop" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      device: opt.value as OptionalFilters["device"],
                    })
                  }
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-pill border transition-all cursor-pointer ${
                    filters.device === opt.value
                      ? "bg-primary text-primary-contrast border-primary"
                      : "bg-surface text-text border-border hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {activeCount > 0 ? (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-danger transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                Reset Semua Filter Tambahan
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
