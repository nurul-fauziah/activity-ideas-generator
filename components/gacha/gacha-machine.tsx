"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CategoryId, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import {
  Disc,
  RotateCw,
  FastForward,
  ArrowDown,
  Coins,
  CheckCircle2,
  Shuffle,
} from "lucide-react";
import {
  playCoinSound,
  playCrankSound,
  playRattleSound,
  playDropSound,
  playCapsuleOpenSound,
} from "@/lib/sound-effects";
import { useGameStore } from "@/store/use-game-store";

export type MachinePhase = "idle" | "spinning" | "capsule_ready" | "opened";

interface GachaMachineProps {
  phase: MachinePhase;
  hasCoinsSelected: boolean;
  isMystery: boolean;
  selectedCategories: CategoryId[];
  onTriggerSpin: () => void;
  onOpenCapsule: () => void;
  onSkipAnimation: () => void;
  capsuleRarity?: Rarity;
  capsuleCategory?: CategoryId;
}

export function GachaMachine({
  phase,
  hasCoinsSelected,
  isMystery,
  selectedCategories,
  onTriggerSpin,
  onOpenCapsule,
  onSkipAnimation,
  capsuleRarity = "common",
  capsuleCategory = "senang-senang",
}: GachaMachineProps) {
  const soundMuted = useGameStore((state) => state.soundMuted);

  // Animation Refs
  const machineRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const crankRef = useRef<HTMLButtonElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const chuteCapsuleRef = useRef<HTMLDivElement>(null);
  const masterTimeline = useRef<gsap.core.Timeline | null>(null);

  // Capsule Cracking Animation state
  const [isCracking, setIsCracking] = useState<boolean>(false);

  // Realistic Piled-Up Capsules in user's Rosy Copper, Muted Olive, Tea Green, White, Blackberry Cream palette
  const piledCapsules = [
    // Layer 1: Perimeter balls flush against the curved bottom glass border (touching the darkline outline)
    { id: 1, color: "#C05746", left: 50, top: 92, rotate: 12, size: 40, zIndex: 2 }, // Rosy Copper (Center bottom)
    { id: 2, color: "#ADC698", left: 36, top: 90, rotate: -22, size: 39, zIndex: 1 }, // Muted Olive
    { id: 3, color: "#503047", left: 64, top: 90, rotate: 25, size: 39, zIndex: 1 }, // Blackberry Cream
    { id: 4, color: "#D0E3C4", left: 24, top: 84, rotate: -38, size: 38, zIndex: 2 }, // Tea Green
    { id: 5, color: "#C05746", left: 76, top: 84, rotate: 32, size: 38, zIndex: 2 }, // Rosy Copper
    { id: 6, color: "#ADC698", left: 14, top: 74, rotate: -45, size: 37, zIndex: 1 }, // Muted Olive
    { id: 7, color: "#D4705F", left: 86, top: 74, rotate: 40, size: 37, zIndex: 1 }, // Soft Rosy Copper
    { id: 8, color: "#503047", left: 8, top: 62, rotate: -55, size: 36, zIndex: 1 }, // Blackberry Cream
    { id: 9, color: "#ADC698", left: 92, top: 62, rotate: 50, size: 36, zIndex: 1 }, // Muted Olive

    // Layer 2: Deep resting tier
    { id: 10, color: "#D0E3C4", left: 43, top: 81, rotate: -15, size: 40, zIndex: 3 }, // Tea Green
    { id: 11, color: "#C05746", left: 57, top: 81, rotate: 18, size: 40, zIndex: 3 }, // Rosy Copper
    { id: 12, color: "#ADC698", left: 30, top: 74, rotate: 28, size: 39, zIndex: 4 }, // Muted Olive
    { id: 13, color: "#503047", left: 70, top: 74, rotate: -24, size: 39, zIndex: 4 }, // Blackberry Cream
    { id: 14, color: "#D4705F", left: 20, top: 66, rotate: -12, size: 38, zIndex: 3 }, // Rosy Copper
    { id: 15, color: "#ADC698", left: 80, top: 66, rotate: 16, size: 38, zIndex: 3 }, // Muted Olive

    // Layer 3: Mid-tier stack
    { id: 16, color: "#C05746", left: 50, top: 70, rotate: -8, size: 41, zIndex: 5 }, // Rosy Copper
    { id: 17, color: "#503047", left: 37, top: 64, rotate: 22, size: 39, zIndex: 6 }, // Blackberry Cream
    { id: 18, color: "#D0E3C4", left: 63, top: 64, rotate: -30, size: 39, zIndex: 6 }, // Tea Green
    { id: 19, color: "#ADC698", left: 27, top: 55, rotate: 14, size: 38, zIndex: 5 }, // Muted Olive
    { id: 20, color: "#C05746", left: 73, top: 55, rotate: -18, size: 38, zIndex: 5 }, // Rosy Copper

    // Layer 4: Crest tier (summit of the pile)
    { id: 21, color: "#ADC698", left: 43, top: 55, rotate: 34, size: 39, zIndex: 7 }, // Muted Olive
    { id: 22, color: "#503047", left: 57, top: 55, rotate: -26, size: 39, zIndex: 7 }, // Blackberry Cream
    { id: 23, color: "#C05746", left: 50, top: 45, rotate: 10, size: 38, zIndex: 8 }, // Rosy Copper
  ];

  // Rarity color mappings harmonized with custom palette
  const getCapsuleRarityColor = () => {
    switch (capsuleRarity) {
      case "rare":
        return "#ADC698"; // Muted Olive
      case "epic":
        return "#503047"; // Blackberry Cream
      case "legendary":
        return "#C05746"; // Rosy Copper
      default:
        return "#D0E3C4"; // Tea Green
    }
  };

  // Master GSAP Timeline when phase switches to "spinning"
  useEffect(() => {
    if (phase !== "spinning") {
      setIsCracking(false);
      // Reset all balls to pristine pile state when not spinning
      if (globeRef.current) {
        const balls = globeRef.current.querySelectorAll(".gacha-ball");
        if (balls && balls.length > 0) {
          gsap.set(balls, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
        }
      }
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Instant skip for reduced motion accessibility
      playDropSound(soundMuted);
      return;
    }

    // Kill any existing timeline
    if (masterTimeline.current) {
      masterTimeline.current.kill();
    }

    const tl = gsap.timeline();
    masterTimeline.current = tl;

    // 1. Coin slides down into slot smoothly
    playCoinSound(soundMuted);
    if (coinRef.current) {
      tl.fromTo(
        coinRef.current,
        { y: -20, opacity: 1, scale: 1 },
        { y: 15, opacity: 0, duration: 0.38, ease: "power2.in" }
      );
    }

    // 2. Crank Lever rotates 720 degrees smoothly with weighted mechanical easing
    playCrankSound(soundMuted);
    if (crankRef.current) {
      tl.to(
        crankRef.current,
        {
          rotation: "+=720",
          duration: 1.35,
          ease: "power2.inOut",
        },
        "-=0.05"
      );
    }

    // Synchronized Spin Start Anchor
    tl.addLabel("spinStart", "-=1.2");

    // 3. Globe casing vibrates gently during the crank rotation
    playRattleSound(soundMuted);
    if (globeRef.current) {
      tl.to(
        globeRef.current,
        {
          x: "random(-4, 4)",
          y: "random(-3, 3)",
          repeat: 14,
          yoyo: true,
          duration: 0.08,
          ease: "sine.inOut",
        },
        "spinStart"
      );
      tl.to(globeRef.current, { x: 0, y: 0, duration: 0.1 }, "spinStart+=1.25");

      // Smooth, Natural Tumbling of ALL 23 capsules:
      // All balls animate simultaneously with graceful floating arcs, mid-air swirls, and a soft bounce-settle
      const balls = globeRef.current.querySelectorAll(".gacha-ball");
      if (balls && balls.length > 0) {
        balls.forEach((ball, i) => {
          // Compute smooth upward trajectory for each individual ball
          const angle = (i / balls.length) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
          const burstDist = gsap.utils.random(40, 85);
          const targetX = Math.cos(angle) * burstDist;
          // Float smoothly into the upper glass dome
          const targetY = -Math.abs(Math.sin(angle) * burstDist + gsap.utils.random(35, 95));
          const rot1 = gsap.utils.random(-540, 540);

          // Phase A: All 23 balls smoothly float upward into the dome
          tl.to(
            ball,
            {
              x: targetX,
              y: targetY,
              rotation: rot1,
              duration: 0.42 + (i % 5) * 0.03,
              ease: "power2.out",
            },
            "spinStart"
          );

          // Phase B: Mid-air swirling and churning (graceful sine arcs, not rushed)
          tl.to(
            ball,
            {
              x: () => gsap.utils.random(-75, 75),
              y: () => gsap.utils.random(-110, -15),
              rotation: `+=${gsap.utils.random(-270, 270)}`,
              duration: 0.3 + (i % 4) * 0.03,
              repeat: 2,
              yoyo: true,
              ease: "sine.inOut",
            },
            "spinStart+=0.38"
          );

          // Phase C: Fall back down and settle into the natural pile with a smooth bounce
          tl.to(
            ball,
            {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.52,
              ease: "bounce.out",
            },
            "spinStart+=1.15"
          );
        });

        // Phase D ("yang bawah yang keambil"):
        // The bottom-most center ball (balls[0] at left: 50%, top: 92%) smoothly drops
        // down through the dispenser hole as the pile settles!
        const bottomBall = balls[0];
        if (bottomBall) {
          tl.to(
            bottomBall,
            {
              y: 50,
              opacity: 0,
              scale: 0.55,
              duration: 0.32,
              ease: "power2.in",
            },
            "spinStart+=1.55"
          );
        }
      }
    }

    // 4. Dropped Capsule lands with tactile thud in the chute tray below
    tl.add(() => {
      playDropSound(soundMuted);
    }, "spinStart+=1.75");

    return () => {
      if (masterTimeline.current) {
        masterTimeline.current.kill();
      }
    };
  }, [phase, soundMuted]);

  // Handle skip animation
  const handleSkip = useCallback(() => {
    if (masterTimeline.current) {
      masterTimeline.current.kill();
    }
    onSkipAnimation();
  }, [onSkipAnimation]);

  // Handle capsule click to trigger crack animation & smooth reveal
  const handleCapsuleClick = useCallback(() => {
    if (isCracking) return;
    setIsCracking(true);
    playCapsuleOpenSound(soundMuted);

    // Tactile crack & light burst delay before opening the reveal modal
    setTimeout(() => {
      onOpenCapsule();
      setIsCracking(false);
    }, 550);
  }, [isCracking, soundMuted, onOpenCapsule]);

  return (
    <div
      ref={machineRef}
      className="w-full max-w-lg mx-auto bg-surface border-3 border-darkline shadow-retro-xl rounded-2xl overflow-hidden select-none"
    >
      {/* Top Arcade Signboard */}
      <div className="bg-arcade-purple text-white px-4 py-2.5 border-b-3 border-darkline flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-arcade-yellow animate-ping" />
          <span className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase text-arcade-yellow">
            GACHA-O-MATIC 3000
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold bg-darkline/60 px-2.5 py-0.5 rounded-full text-white/90">
          100% GRATIS
        </div>
      </div>

      {/* Glass Globe Section (Contains Tumbling Capsules) */}
      <div className="p-6 bg-gradient-to-b from-arcade-cream/80 to-arcade-cream/20 flex flex-col items-center justify-center relative">
        {/* Globe Container */}
        <div
          ref={globeRef}
          className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full border-3 border-darkline shadow-retro bg-sky-100/40 dark:bg-slate-900/40 backdrop-blur-xs relative overflow-hidden flex items-center justify-center transition-all ${
            phase === "spinning"
              ? isMystery
                ? "ring-4 ring-arcade-yellow"
                : "ring-4 ring-arcade-purple"
              : ""
          }`}
        >
          {/* Glass Dome Reflections */}
          <div className="absolute top-3 left-6 w-16 h-8 bg-white/60 rounded-full -rotate-45 pointer-events-none z-20" />
          <div className="absolute bottom-4 right-8 w-8 h-4 bg-white/30 rounded-full rotate-45 pointer-events-none z-20" />

          {/* Mini Capsules naturally PILED UP inside the Globe */}
          <div className="w-full h-full relative pointer-events-none">
            {piledCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="gacha-ball absolute rounded-full border-2 border-darkline shadow-retro-xs overflow-hidden"
                style={{
                  left: `${capsule.left}%`,
                  top: `${capsule.top}%`,
                  width: `${capsule.size}px`,
                  height: `${capsule.size}px`,
                  zIndex: capsule.zIndex,
                  backgroundColor: capsule.color,
                  transform: `translate(-50%, -50%) rotate(${capsule.rotate}deg)`,
                }}
              >
                {/* Two-tone capsule shell: Top shiny translucent color, bottom white/cream seam */}
                <div className="w-full h-1/2 bg-white/45 border-b-2 border-darkline/80 relative">
                  {/* Miniature reflection highlight */}
                  <div className="absolute top-1 left-2 w-2.5 h-1 bg-white/80 rounded-full -rotate-30" />
                </div>
              </div>
            ))}

            {/* Glowing Accent for Mystery Acak Total */}
            {isMystery ? (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-holographic border-2 border-darkline shadow-retro-sm flex items-center justify-center text-white animate-spin-slow">
                  <Shuffle size={15} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Phase Guidance Label */}
        <div className="mt-4 text-center">
          {phase === "spinning" ? (
            <div className="flex items-center gap-2 bg-arcade-yellow text-darkline border-2 border-darkline font-mono font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-retro-sm animate-pulse">
              <Disc className="animate-spin" size={16} />
              <span>
                {isMystery
                  ? "Mengocok Kapsul Pelangi Misteri..."
                  : "Mengocok Mesin Kapsul..."}
              </span>
            </div>
          ) : phase === "capsule_ready" ? (
            <div className="flex items-center gap-1.5 bg-arcade-mint text-darkline border-2 border-darkline font-mono font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-retro-sm animate-bounce">
              <ArrowDown size={14} className="shrink-0" />
              <span>Kapsul Siap Dibuka di Lubang Bawah</span>
            </div>
          ) : (
            <p className="text-xs font-mono font-bold text-text-muted">
              {hasCoinsSelected
                ? "Koin terpasang! Putar tuas mesin untuk memulai"
                : "Pilih minimal 1 koin aktivitas di atas untuk memutar mesin"}
            </p>
          )}
        </div>
      </div>

      {/* Control Panel: Coin Slot + Crank Lever */}
      <div className="bg-surface-2 p-5 border-t-3 border-darkline space-y-5">
        <div className="flex items-center justify-between gap-4">
          {/* Coin Slot */}
          <div className="flex-1 bg-surface border-2 border-darkline rounded-xl p-3 shadow-retro-sm text-center relative overflow-hidden">
            <span className="block text-[10px] font-mono font-extrabold uppercase text-text-muted mb-1">
              Slot Koin
            </span>

            {/* Simulated Animated Coin Insertion */}
            <div
              ref={coinRef}
              className={`w-6 h-6 mx-auto rounded-full border-2 border-darkline shadow-xs flex items-center justify-center mb-1 ${
                isMystery ? "bg-holographic text-white" : "bg-arcade-yellow text-darkline"
              } ${hasCoinsSelected ? "opacity-100" : "opacity-30"}`}
            >
              {isMystery ? <Shuffle size={12} /> : <Coins size={12} />}
            </div>

            <div className="h-2 w-16 bg-darkline rounded-full mx-auto shadow-inner" />

            <div className="text-xs font-mono font-bold text-arcade-purple dark:text-arcade-yellow mt-1.5 flex items-center justify-center gap-1">
              {hasCoinsSelected ? (
                <>
                  <CheckCircle2 size={13} className="text-arcade-mint" />
                  <span>{isMystery ? "Koin Pelangi Masuk" : "Koin Aktivitas Masuk"}</span>
                </>
              ) : (
                <span className="text-text-muted">Kosong</span>
              )}
            </div>
          </div>

          {/* Mechanical Gashapon Butterfly Turn Lever (Tuas Putar Gacha Asli) */}
          <div className="flex flex-col items-center">
            {/* Mounting Escutcheon Plate with circular base, guide track, and rivets */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-surface border-3 border-darkline shadow-retro flex items-center justify-center p-2">
              {/* Mechanical Corner Rivets */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 border border-darkline" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 border border-darkline" />
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 border border-darkline" />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 border border-darkline" />

              {/* Rotational Direction Track */}
              <div className="absolute inset-3 rounded-full border border-dashed border-darkline/25 pointer-events-none" />

              {/* Butterfly Turn Lever Bar (Spun 720° on activation) */}
              <button
                ref={crankRef}
                type="button"
                disabled={!hasCoinsSelected || phase === "spinning"}
                onClick={onTriggerSpin}
                aria-label="Putar tuas gacha arcade"
                title={hasCoinsSelected ? "Putar tuas mesin gacha!" : "Pilih koin terlebih dahulu"}
                className={`relative z-10 w-24 sm:w-28 h-9 sm:h-10 rounded-full border-3 border-darkline flex items-center justify-between px-2.5 transition-all select-none ${
                  !hasCoinsSelected || phase === "spinning"
                    ? "bg-slate-300 dark:bg-slate-700 text-text-muted opacity-50 cursor-not-allowed shadow-none"
                    : "bg-arcade-yellow text-darkline shadow-retro-sm hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing hover:bg-yellow-300"
                }`}
              >
                {/* Left Wing Ribbed Grips */}
                <div className="flex gap-0.5 pointer-events-none">
                  <div className="w-1 h-3.5 sm:h-4 bg-darkline/30 rounded-full" />
                  <div className="w-1 h-3.5 sm:h-4 bg-darkline/30 rounded-full" />
                </div>

                {/* Center Axle Hub Cap with Rotate Indicator */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-darkline bg-arcade-purple text-white flex items-center justify-center shadow-xs shrink-0">
                  <RotateCw
                    size={13}
                    className={phase === "spinning" ? "animate-spin" : ""}
                  />
                </div>

                {/* Right Wing Ribbed Grips */}
                <div className="flex gap-0.5 pointer-events-none">
                  <div className="w-1 h-3.5 sm:h-4 bg-darkline/30 rounded-full" />
                  <div className="w-1 h-3.5 sm:h-4 bg-darkline/30 rounded-full" />
                </div>
              </button>
            </div>

            {/* Sub-label under the tuas */}
            <span className="mt-1.5 font-mono font-black text-[10px] sm:text-[11px] tracking-wider uppercase text-text-muted flex items-center gap-1">
              <RotateCw size={11} className="text-arcade-purple dark:text-arcade-yellow" />
              TUAS PUTAR GACHA
            </span>
          </div>
        </div>

        {/* Skip Animation helper button when spinning */}
        {phase === "spinning" ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-muted hover:text-text bg-surface border border-darkline px-3 py-1 rounded-full cursor-pointer hover:bg-surface-2 transition-colors"
            >
              <FastForward size={14} />
              <span>Lewati Animasi</span>
            </button>
          </div>
        ) : null}

        {/* Bottom Output Hatch / Chute Tray (Dispenser Kapsul) */}
        <div className="pt-3 border-t-2 border-darkline/40">
          <div className="bg-darkline/95 rounded-xl p-4 border-2 border-darkline text-center min-h-[110px] flex items-center justify-center shadow-inner relative overflow-hidden">
            {/* Top Chute Flap Slit Graphic (visual metallic opening where capsule emerges) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/60 rounded-b-md border-b border-white/10" />

            <AnimatePresence mode="wait">
              {phase === "capsule_ready" ? (
                /* The Dropped Capsule Ball Animation + Button Transformation */
                <motion.div
                  key="capsule-dropped-container"
                  initial={{ y: -65, scale: 0.5, rotate: -180, opacity: 0 }}
                  animate={{
                    y: [ -65, 8, -4, 0 ],
                    scale: [ 0.5, 1.1, 0.95, 1 ],
                    rotate: [ -180, 25, -6, 0 ],
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.65,
                    times: [0, 0.6, 0.8, 1],
                    ease: "easeOut",
                  }}
                  className="flex items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={handleCapsuleClick}
                    disabled={isCracking}
                    className={`group flex items-center bg-surface p-2 sm:p-2.5 rounded-full border-2 border-darkline shadow-retro hover:scale-105 active:scale-95 transition-all cursor-pointer ring-3 ring-arcade-yellow/80 hover:ring-arcade-yellow ${
                      isCracking ? "scale-105 ring-4 ring-white" : ""
                    }`}
                  >
                    {/* The Dropped Capsule Ball with Gloss & Rarity Color */}
                    <div
                      ref={chuteCapsuleRef}
                      className={`w-12 h-12 rounded-full border-2 border-darkline shrink-0 flex flex-col items-center justify-between shadow-retro-xs overflow-hidden relative transition-all duration-300 ${
                        isCracking ? "scale-115 rotate-12 ring-4 ring-arcade-yellow shadow-retro" : ""
                      }`}
                      style={{
                        backgroundColor: isMystery ? undefined : getCapsuleRarityColor(),
                      }}
                    >
                      {/* Top Half */}
                      <div
                        className={`w-full h-1/2 bg-white/60 border-b-2 border-darkline transition-transform duration-500 ease-out ${
                          isCracking ? "-translate-y-3 -rotate-6" : ""
                        } ${isMystery ? "bg-holographic" : ""}`}
                      />
                      {/* Bottom Half */}
                      <div
                        className={`w-full h-1/2 transition-transform duration-500 ease-out ${
                          isCracking ? "translate-y-3 rotate-6" : ""
                        } ${isMystery ? "bg-holographic" : ""}`}
                      />

                      {/* Cracking Light Flash Burst */}
                      {isCracking ? (
                        <div className="absolute inset-0 bg-white/90 animate-ping rounded-full pointer-events-none" />
                      ) : null}
                    </div>

                    {/* Button Label that Smoothly Expands Out from the Ball */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                      className="overflow-hidden whitespace-nowrap px-3 text-left"
                    >
                      <span className="font-display font-black text-sm text-text block leading-tight">
                        Buka Kapsulmu
                      </span>
                      {/* <span className="text-[10px] font-mono font-bold text-text-muted block mt-0.5">
                        Ketuk untuk melihat misi
                      </span> */}
                    </motion.div>
                  </button>
                </motion.div>
              ) : phase === "spinning" ? (
                <motion.div
                  key="capsule-sliding-down"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-1.5 text-arcade-yellow"
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold animate-pulse">
                    <ArrowDown size={14} className="animate-bounce" />
                    <span>Kapsul meluncur keluar...</span>
                    <ArrowDown size={14} className="animate-bounce" />
                  </div>
                  <div className="w-24 h-1.5 bg-arcade-yellow/20 rounded-full overflow-hidden border border-arcade-yellow/40">
                    <motion.div
                      animate={{ x: [-20, 80] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                      className="w-8 h-full bg-arcade-yellow rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chute-idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xs font-mono font-bold text-white/50 tracking-wider">
                    [ Lubang Pengeluaran Kapsul ]
                  </span>
                  <span className="text-[10px] font-mono text-white/30">
                    Putar tuas untuk mengeluarkan bola
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
