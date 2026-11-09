import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="w-full bg-surface border border-border rounded-lg p-8 sm:p-12 text-center shadow-e1">
      <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4 text-text-muted">
        <SearchX size={32} />
      </div>
      <h3 className="font-display text-xl sm:text-2xl font-bold text-text mb-2">
        Belum Ada Aktivitas yang Cocok
      </h3>
      <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
        Kombinasi filter kategori dan opsi tambahan yang kamu pilih terlalu ketat.
        Coba longgarkan durasi atau tambah pilihan kategori untuk melihat ide aktivitas gratis lainnya.
      </p>
      <Button variant="primary" onClick={onResetFilters}>
        Longgarkan Filter
      </Button>
    </div>
  );
}
