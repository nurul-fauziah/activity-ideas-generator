"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Lock, X, AlertCircle } from "lucide-react";

interface AdminPinModalProps {
  isOpen: boolean;
  onVerify: (pin: string) => void;
  onClose: () => void;
  errorMessage?: string | null;
}

export function AdminPinModal({
  isOpen,
  onVerify,
  onClose,
  errorMessage,
}: AdminPinModalProps) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setPin("");
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    onVerify(pin.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-surface border-2 border-darkline rounded-xl p-6 shadow-[6px_6px_0_var(--arcade-dark)] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-arcade-cream text-arcade-dark flex items-center justify-center shrink-0 border border-darkline/30">
            <KeyRound className="w-5 h-5 text-arcade-yellow" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        <div className="mt-3">
          <h2 className="font-display font-black text-lg text-text">
            Otorisasi PIN Admin
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Masukkan PIN rahasia untuk menyimpan perubahan ke katalog server.
          </p>

          {errorMessage && (
            <div className="mt-3 p-2.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-text mb-1 uppercase tracking-wider">
                PIN / Secret Key
              </label>
              <input
                type="password"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN (Default: 1234)"
                className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-arcade-yellow text-center"
              />
              <span className="text-[10px] text-text-muted mt-1 block text-center">
                * PIN bawaan pengembangan lokal adalah: <code className="font-bold">1234</code>
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-xs font-bold text-text shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!pin.trim()}
                className="px-4 py-2 rounded-md border-2 border-darkline bg-arcade-yellow text-white text-xs font-bold shadow-[2px_2px_0_var(--arcade-dark)] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Konfirmasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
