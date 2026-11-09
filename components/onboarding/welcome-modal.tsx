"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/use-game-store";
import { Pip } from "@/components/mascot/pip";
import { ArrowRight, User } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [inputName, setInputName] = useState("");
  const setPlayerName = useGameStore((state) => state.setPlayerName);

  useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (trimmed) {
      setPlayerName(trimmed);
    } else {
      setPlayerName("Pemain");
    }
    onClose();
  };

  const handleSkip = () => {
    setPlayerName("Pemain");
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-surface border-3 border-darkline shadow-retro-xl rounded-2xl overflow-hidden select-none"
        >
          {/* Header Marquee Bar */}
          <div className="bg-arcade-purple text-white px-5 py-2.5 border-b-3 border-darkline flex items-center justify-between text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-arcade-yellow" />
              <span>REGISTRASI KARTU PEMAIN</span>
            </span>
            <span className="text-[11px] text-arcade-cream/80">100% LOKAL & GRATIS</span>
          </div>

          <div className="p-6 sm:p-7 space-y-5 text-center">
            {/* Mascot Pip Greeting */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Pip
                expression="happy"
                size="md"
              />
              <h2
                id="welcome-modal-title"
                className="font-display font-black text-2xl text-text leading-tight mt-1"
              >
                Kenalan Dulu Yuk!
              </h2>
              <p className="text-text-muted text-xs sm:text-sm max-w-xs leading-relaxed">
                Siapa nama panggilanmu? Namamu akan tercatat di tiket profil dan setiap kapsul misi yang kamu dapatkan!
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={20}
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Ketik nama panggilanmu..."
                  autoFocus
                  className="w-full text-center px-4 py-3 bg-surface-2 border-2 border-darkline rounded-xl font-display font-black text-base text-text placeholder:text-text-muted/60 focus:bg-surface focus:outline-none focus:ring-3 focus:ring-arcade-yellow transition-all shadow-retro-xs"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-arcade-yellow text-darkline border-2 border-darkline shadow-retro rounded-xl font-display font-black text-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mulai Petualangan Arcade!</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-2 text-xs font-mono font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  Lewati dulu (pakai nama &apos;Pemain&apos;)
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
