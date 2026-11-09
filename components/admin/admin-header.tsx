"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Save,
  Download,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";

interface AdminHeaderProps {
  totalCount: number;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  isPinAuthenticated: boolean;
  onLock: () => void;
  onAddNew: () => void;
  onSave: () => void;
  onDownload: () => void;
  onCopyJson: () => void;
  onReload: () => void;
}

export function AdminHeader({
  totalCount,
  hasUnsavedChanges,
  isSaving,
  lastSavedAt,
  isPinAuthenticated,
  onLock,
  onAddNew,
  onSave,
  onDownload,
  onCopyJson,
  onReload,
}: AdminHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyJson();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b-2 border-darkline bg-surface px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Navigation & Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-text transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-arcade-yellow" />
            <span>Kembali ke Arcade</span>
          </Link>

          <div className="h-4 w-px bg-darkline/30 hidden sm:block" />

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-xl sm:text-2xl text-text tracking-tight flex items-center gap-2">
                <span className="text-arcade-yellow">⚙️</span> Kelola Misi Gacha
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-arcade-cream text-arcade-dark border border-arcade-dark/20">
                {totalCount} Misi
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Tambah, edit, dan atur distribusi katalog aktivitas NgapainYuk.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lock / Unlock Session Status */}
          {isPinAuthenticated ? (
            <button
              type="button"
              onClick={onLock}
              title="Kunci sesi admin (Hapus PIN tersimpan)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded border border-darkline/30 bg-surface hover:bg-surface-2 text-emerald-700 dark:text-emerald-300 cursor-pointer shadow-[1px_1px_0_var(--arcade-dark)]"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesi Terbuka</span>
            </button>
          ) : (
            <div
              title="PIN dibutuhkan untuk menyimpan perubahan ke file server"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold rounded border border-darkline/30 bg-surface-2 text-text-muted"
            >
              <Lock className="w-3.5 h-3.5 text-text-muted" />
              <span>Terkunci</span>
            </div>
          )}

          {/* Status Badge */}
          {hasUnsavedChanges ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              <span>Belum disimpan ke file</span>
            </div>
          ) : lastSavedAt ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium font-mono rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
              <span>Tersimpan {lastSavedAt}</span>
            </div>
          ) : null}

          {/* Reload */}
          <button
            type="button"
            onClick={onReload}
            title="Muat ulang dari server"
            className="p-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-text font-bold shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-text-muted hover:text-text" />
            <span className="sr-only">Muat Ulang</span>
          </button>

          {/* Copy JSON */}
          <button
            type="button"
            onClick={handleCopy}
            title="Salin semua data sebagai JSON"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-xs font-bold text-text shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-muted" />
                <span className="hidden sm:inline">Salin JSON</span>
              </>
            )}
          </button>

          {/* Download JSON */}
          <button
            type="button"
            onClick={onDownload}
            title="Unduh file activities.json ke komputermu"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-xs font-bold text-text shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-text-muted" />
            <span className="hidden sm:inline">Unduh JSON</span>
          </button>

          {/* Save to Local Server */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            title="Simpan langsung ke file data/activities.json"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border-2 border-darkline text-xs font-bold transition-all shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              hasUnsavedChanges
                ? "bg-arcade-yellow text-white hover:brightness-105"
                : "bg-surface-2 text-text-muted opacity-75 cursor-not-allowed shadow-none"
            }`}
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>

          {/* Add New Activity */}
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border-2 border-darkline bg-arcade-mint text-arcade-dark font-bold text-xs shadow-[2px_2px_0_var(--arcade-dark)] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Misi</span>
          </button>
        </div>
      </div>
    </header>
  );
}
