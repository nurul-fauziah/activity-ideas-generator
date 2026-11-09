"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Activity, CategoryId } from "@/types/activity";
import { MissionCard } from "./mission-card";
import { EmptyState } from "../empty-state";
import { useGameStore } from "@/store/use-game-store";
import { playCapsuleOpenSound } from "@/lib/sound-effects";
import { X } from "lucide-react";

interface MissionModalProps {
  isOpen: boolean;
  activity: Activity | null;
  isSaved: boolean;
  isMysteryBonus: boolean;
  selectedCategories: CategoryId[];
  onClose: () => void;
  onReroll: () => void;
  onToggleSave: (activity: Activity) => void;
  onShare: (activity: Activity) => void;
  onClaimReward: (activity: Activity) => void;
  onResetFilters?: () => void;
}

export function MissionModal({
  isOpen,
  activity,
  isSaved,
  isMysteryBonus,
  selectedCategories,
  onClose,
  onReroll,
  onToggleSave,
  onShare,
  onClaimReward,
  onResetFilters,
}: MissionModalProps) {
  // Modal Stages: "capsule" (pure floating capsule in dark) -> "opening" (splitting & card emerging from inside) -> "card" (card revealed)
  const [stage, setStage] = useState<"capsule" | "opening" | "card">("capsule");
  const soundMuted = useGameStore((state) => state.soundMuted);

  // Reset stage to capsule whenever modal is opened with an activity
  useEffect(() => {
    if (isOpen) {
      if (activity) {
        setStage("capsule");
      } else {
        setStage("card"); // Empty state directly
      }
    }
  }, [isOpen, activity?.id]);

  // Close on Escape key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  const handleCrackCapsule = () => {
    if (stage !== "capsule") return;
    setStage("opening");
    playCapsuleOpenSound(soundMuted);

    // Trigger celebratory confetti exactly when the mission card emerges from inside the capsule!
    setTimeout(() => {
      try {
        if (activity?.rarity === "legendary") {
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.55 },
            colors: ["#C05746", "#FFC93C", "#FFE699", "#FFFFFF"],
          });
        } else if (activity?.rarity === "epic") {
          confetti({
            particleCount: 65,
            spread: 65,
            origin: { y: 0.55 },
            colors: ["#503047", "#C05746", "#ADC698", "#FFFFFF"],
          });
        } else {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.55 },
            colors: ["#ADC698", "#D0E3C4", "#C05746", "#503047"],
          });
        }
      } catch {
        // Fallback safely if canvas-confetti is unavailable
      }
    }, 280);

    // After the smooth emergence completes, set stage to card
    setTimeout(() => {
      setStage("card");
    }, 850);
  };

  const getGlowColor = () => {
    if (activity?.rarity === "legendary") {
      return "radial-gradient(circle, rgba(192,87,70,0.85) 0%, transparent 70%)";
    }
    if (activity?.rarity === "epic") {
      return "radial-gradient(circle, rgba(80,48,71,0.9) 0%, transparent 70%)";
    }
    return "radial-gradient(circle, rgba(173,198,152,0.8) 0%, transparent 70%)";
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="mission-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mission-popup-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            // Close when clicking directly on the backdrop in card stage
            if (e.target === e.currentTarget && stage === "card") {
              onClose();
            }
          }}
        >
          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg"
          >
            <X size={18} />
          </button>

          {/* Center Stage Container */}
          <div className="relative w-full max-w-xl mx-auto my-auto flex flex-col items-center justify-center min-h-[360px]">
            {/* Ambient Radiant Glow Burst */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{
                scale: stage === "opening" ? [0.6, 2.5] : [0.95, 1.15, 0.95],
                opacity: stage === "opening" ? [0.95, 0.3] : [0.6, 0.85, 0.6],
              }}
              transition={
                stage === "opening"
                  ? { duration: 0.85, ease: "easeOut" }
                  : { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }
              className="absolute inset-0 -z-10 rounded-full pointer-events-none blur-3xl"
              style={{ background: getGlowColor() }}
            />

            {activity ? (
              <div className="relative w-full flex flex-col items-center justify-center">
                {/* ===================================================
                    THE PURE FLOATING CAPSULE (NO OUTER CARD / NO FRAMES)
                    =================================================== */}
                {stage === "capsule" || stage === "opening" ? (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto">
                    <motion.div
                      animate={
                        stage === "capsule"
                          ? {
                              y: [0, -10, 0],
                              rotate: [-2, 2, -2],
                            }
                          : {
                              scale: [1, 1.05],
                            }
                      }
                      transition={
                        stage === "capsule"
                          ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
                          : { duration: 0.2 }
                      }
                      whileHover={stage === "capsule" ? { scale: 1.08, rotate: 0 } : {}}
                      whileTap={stage === "capsule" ? { scale: 0.94 } : {}}
                      onClick={handleCrackCapsule}
                      className="relative w-44 h-44 sm:w-56 sm:h-56 cursor-pointer select-none flex items-center justify-center focus:outline-none"
                    >
                      <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                      >
                        {/* Top Capsule Half - Slides smoothly UP when opening */}
                        <motion.g
                          animate={
                            stage === "opening"
                              ? { y: -140, rotate: -22, opacity: 0 }
                              : { y: 0, rotate: 0, opacity: 1 }
                          }
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <path
                            d="M 16 50 C 16 28 32 14 50 14 C 68 14 84 28 84 50 Z"
                            fill="#503047"
                            stroke="#503047"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          {/* Curved Glossy Highlight */}
                          <path
                            d="M 26 44 C 30 26 42 20 58 20"
                            stroke="#FFFFFF"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            opacity="0.85"
                          />
                        </motion.g>

                        {/* Center Joint Seam */}
                        <motion.rect
                          x="13"
                          y="47"
                          width="74"
                          height="7"
                          rx="3.5"
                          fill="#C05746"
                          stroke="#503047"
                          strokeWidth="2.5"
                          animate={
                            stage === "opening"
                              ? { scaleX: [1, 1.5], opacity: [1, 0] }
                              : { scaleX: 1, opacity: 1 }
                          }
                          transition={{ duration: 0.4 }}
                        />

                        {/* Bottom Capsule Half - Slides smoothly DOWN when opening */}
                        <motion.g
                          animate={
                            stage === "opening"
                              ? { y: 140, rotate: 18, opacity: 0 }
                              : { y: 0, rotate: 0, opacity: 1 }
                          }
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <path
                            d="M 16 51 C 16 73 32 87 50 87 C 68 87 84 73 84 51 Z"
                            fill="#D0E3C4"
                            stroke="#503047"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                          {/* Inner Shimmer */}
                          <ellipse
                            cx="50"
                            cy="66"
                            rx="20"
                            ry="10"
                            fill="#FFFFFF"
                            opacity="0.65"
                          />
                        </motion.g>

                        {/* Center Radiant Light Beam when opening */}
                        {stage === "opening" ? (
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="#FFFFFF"
                            initial={{ scale: 0.2, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        ) : null}
                      </svg>
                    </motion.div>

                    {/* Subtle Hint Text beneath the pure capsule (no cards) */}
                    {stage === "capsule" ? (
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7], y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="mt-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-white text-xs font-mono font-bold tracking-wider uppercase shadow-md pointer-events-none select-none"
                      >
                        Ketuk Kapsul Untuk Membuka
                      </motion.div>
                    ) : null}
                  </div>
                ) : null}

                {/* ===================================================
                    THE MISSION CARD: EMERGES SMOOTHLY FROM INSIDE THE CAPSULE
                    =================================================== */}
                <AnimatePresence>
                  {stage === "opening" || stage === "card" ? (
                    <motion.div
                      key="emerging-mission-card"
                      initial={{ scale: 0.15, opacity: 0, y: 0 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1], // Smooth cinematic ease-out
                      }}
                      className="w-full relative z-30"
                    >
                      <MissionCard
                        activity={activity}
                        isSaved={isSaved}
                        isMysteryBonus={isMysteryBonus}
                        selectedCategories={selectedCategories}
                        onReroll={() => {
                          onClose();
                          onReroll();
                        }}
                        onToggleSave={onToggleSave}
                        onShare={onShare}
                        onClaimReward={onClaimReward}
                        onClose={onClose}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty State (if no candidate matches filters) */
              <div className="relative bg-surface border-3 border-darkline shadow-retro-xl rounded-2xl p-6 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup pop-up"
                  className="absolute top-4 right-4 w-8 h-8 rounded-md bg-surface-2 border-2 border-darkline shadow-retro-sm flex items-center justify-center text-text hover:bg-surface active:scale-90 transition-transform cursor-pointer"
                >
                  <X size={16} />
                </button>
                <EmptyState
                  onResetFilters={() => {
                    if (onResetFilters) onResetFilters();
                    onClose();
                    onReroll();
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
