"use client";

import React, { useEffect } from "react";
import { Activity } from "@/types/activity";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  activity: Activity | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  activity,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-surface border-2 border-darkline rounded-xl p-6 shadow-[6px_6px_0_var(--arcade-dark)] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-text-muted hover:text-text p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        <div className="mt-3">
          <h2 className="font-display font-black text-lg text-text">
            Hapus Misi Ini?
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Misi berikut akan dihapus dari daftar aktivitas:
          </p>

          <div className="mt-3 p-3 rounded-md bg-surface-2 border border-darkline/20">
            <span className="font-mono text-xs font-bold text-arcade-yellow block">
              {activity.id}
            </span>
            <p className="text-sm font-bold text-text mt-0.5 line-clamp-2">
              {activity.title}
            </p>
          </div>

          <p className="text-[11px] text-text-muted mt-3">
            * Perubahan baru akan benar-benar permanen ke file setelah kamu menekan tombol <strong className="text-text">Simpan Perubahan</strong>.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-xs font-bold text-text shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md border-2 border-red-600 bg-red-600 text-white text-xs font-bold shadow-[2px_2px_0_var(--arcade-dark)] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            Ya, Hapus Misi
          </button>
        </div>
      </div>
    </div>
  );
}
