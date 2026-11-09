"use client";

import React, { useState } from "react";
import { OptionalFilters } from "@/types/activity";
import { Wrench, ChevronDown, RotateCcw, Clock, MapPin, Users, Laptop } from "lucide-react";

interface MachineSettingsProps {
  filters: OptionalFilters;
  onChange: (updated: OptionalFilters) => void;
  onReset: () => void;
}

export function MachineSettings({
  filters,
  onChange,
  onReset,
}: MachineSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount =
    (filters.duration !== "all" ? 1 : 0) +
    (filters.place !== "all" ? 1 : 0) +
    (filters.social !== "all" ? 1 : 0) +
    (filters.device !== "all" ? 1 : 0);

  return (
    <div className="w-full bg-surface border-2 border-darkline shadow-retro-sm rounded-xl overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="machine-settings-panel"
        className="w-full min-h-[48px] px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-surface-2 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-arcade-purple text-white border-2 border-darkline flex items-center justify-center shrink-0">
            <Wrench size={14} />
          </div>
          <div>
            <span className="font-display font-black text-sm sm:text-base text-text">
              Pengaturan Mesin (Filter Opsional)
            </span>
          </div>
          {activeCount > 0 ? (
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-pill bg-arcade-pink text-white border border-darkline">
              {activeCount} Aktif
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
        <div
          id="machine-settings-panel"
          className="p-4 sm:p-5 border-t-2 border-darkline bg-surface-2/60 space-y-4"
        >
          {/* Durasi */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
              <Clock size={13} className="text-arcade-purple dark:text-arcade-yellow" />
              <span>Batas Durasi Aktivitas</span>
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
                  className={`min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-darkline transition-all cursor-pointer ${
                    filters.duration === opt.value
                      ? "bg-arcade-yellow text-darkline shadow-retro-sm"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tempat */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
              <MapPin size={13} className="text-arcade-mint" />
              <span>Lokasi Tempat</span>
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
                  className={`min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-darkline transition-all cursor-pointer ${
                    filters.place === opt.value
                      ? "bg-arcade-mint text-darkline shadow-retro-sm"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sosial */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
              <Users size={13} className="text-arcade-pink" />
              <span>Jumlah Orang</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "Sendiri (Solo)", value: "solo" },
                { label: "Bareng Teman/Keluarga", value: "group" },
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
                  className={`min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-darkline transition-all cursor-pointer ${
                    filters.social === opt.value
                      ? "bg-arcade-pink text-white shadow-retro-sm"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Perangkat */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
              <Laptop size={13} className="text-arcade-blue" />
              <span>Kebutuhan Perangkat</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Bebas", value: "all" },
                { label: "Tanpa Alat", value: "none" },
                { label: "Cukup HP", value: "phone" },
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
                  className={`min-h-[36px] px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-darkline transition-all cursor-pointer ${
                    filters.device === opt.value
                      ? "bg-arcade-blue text-white shadow-retro-sm"
                      : "bg-surface text-text hover:bg-surface-2"
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
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-muted hover:text-danger transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Semua Pengaturan</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
