"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";

export type PipExpression =
  | "idle"
  | "excited"
  | "shocked"
  | "happy"
  | "mystery_star"
  | "thinking";

interface PipProps {
  expression?: PipExpression;
  speechText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  layout?: "horizontal" | "vertical";
  showSpeakerTag?: boolean;
  onClick?: () => void;
}

const FUN_CLICK_DIALOGUES = [
  "Hehe geli! Mau putar gacha lagi?",
  "Pip siap nemenin kamu beraktivitas!",
  "Coba koin Acak Total, seru banget lho!",
  "Kapsul apa yang bakal keluar hari ini ya?",
  "Tarik tuasnya kuat-kuat, siapa tahu dapat Legendary!",
  "Semangat! Ngapain bengong kalau bisa seru-seruan?",
  "Pip senang kamu main di sini!",
];

// Acrobatic action moves when Pip is clicked (Salto, Lompat, Goyang, Terbang)
const TRICK_ANIMATIONS: TargetAndTransition[] = [
  // 0: Salto 360° (Full mid-air flip)
  {
    y: [0, -14, -18, -10, 0],
    rotate: [0, -90, -180, -270, -360],
    scale: [1, 1.08, 1.14, 1.05, 1],
    transition: { duration: 0.55, ease: "easeInOut" },
  },
  // 1: Lompat Gembira (High spring bounce with squash & stretch)
  {
    y: [0, 4, -20, -16, 2, 0],
    scaleY: [1, 0.82, 1.25, 0.92, 1.05, 1],
    scaleX: [1, 1.18, 0.85, 1.08, 0.98, 1],
    rotate: [0, -6, 6, -3, 0],
    transition: { duration: 0.5, ease: "easeOut" },
  },
  // 2: Goyang Heboh / Wiggle Dance
  {
    y: [0, -6, -12, -6, -10, 0],
    rotate: [0, -18, 18, -14, 14, -6, 6, 0],
    scale: [1, 1.1, 1.12, 1.08, 1.04, 1],
    transition: { duration: 0.52, ease: "easeInOut" },
  },
  // 3: Melayang Terbang / UFO Float
  {
    y: [0, -16, -20, -14, -5, 0],
    rotate: [0, 10, -10, 6, -4, 0],
    scale: [1, 1.12, 1.18, 1.1, 1],
    transition: { duration: 0.58, ease: "easeInOut" },
  },
];

export function Pip({
  expression = "idle",
  speechText,
  size = "md",
  className = "",
  layout = "horizontal",
  showSpeakerTag = false,
  onClick,
}: PipProps) {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [clickDialogue, setClickDialogue] = useState<string | null>(null);
  const [currentTrick, setCurrentTrick] = useState<number>(0);
  const [isTricking, setIsTricking] = useState<boolean>(false);

  const sizeMap = {
    sm: "w-14 h-16",
    md: "w-20 h-24",
    lg: "w-28 h-32",
  };

  // Periodic natural eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleMascotClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Pick a new random fun dialogue different from current
    const available = FUN_CLICK_DIALOGUES.filter((m) => m !== (clickDialogue || speechText));
    const randomMsg =
      available[Math.floor(Math.random() * available.length)] || FUN_CLICK_DIALOGUES[0];
    setClickDialogue(randomMsg);

    // Trigger next energetic acrobatic trick (Salto, Lompat, Goyang, Terbang)
    setCurrentTrick((prev) => (prev + 1) % TRICK_ANIMATIONS.length);
    setIsTricking(true);
    setTimeout(() => {
      setIsTricking(false);
    }, 600);

    if (onClick) onClick();
  };

  const currentSpeech = clickDialogue || speechText;
  const effectiveExpression = isTricking ? "excited" : expression;

  const renderEyes = () => {
    if (isBlinking && effectiveExpression !== "happy") {
      // Blinking closed eye line
      return (
        <>
          <path
            d="M 32 47 L 44 47"
            stroke="#1F1A2B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 56 47 L 68 47"
            stroke="#1F1A2B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      );
    }

    switch (effectiveExpression) {
      case "excited":
        return (
          <>
            <circle cx="38" cy="46" r="6.5" fill="#1F1A2B" />
            <circle cx="40" cy="44" r="2.5" fill="#FFFFFF" />
            <circle cx="62" cy="46" r="6.5" fill="#1F1A2B" />
            <circle cx="64" cy="44" r="2.5" fill="#FFFFFF" />
          </>
        );
      case "happy":
        return (
          <>
            <path
              d="M 33 48 Q 38 41 43 48"
              stroke="#1F1A2B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 57 48 Q 62 41 67 48"
              stroke="#1F1A2B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case "shocked":
        return (
          <>
            <circle cx="37" cy="45" r="7.5" fill="#1F1A2B" />
            <circle cx="39" cy="43" r="3" fill="#FFFFFF" />
            <circle cx="63" cy="45" r="7.5" fill="#1F1A2B" />
            <circle cx="65" cy="43" r="3" fill="#FFFFFF" />
          </>
        );
      case "mystery_star":
        return (
          <>
            <g transform="translate(38, 46) scale(0.85)">
              <polygon
                points="0,-8 2.5,-2.5 8,-2.5 4,1 5.5,7 0,3.5 -5.5,7 -4,1 -8,-2.5 -2.5,-2.5"
                fill="#FFC93C"
                stroke="#1F1A2B"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(62, 46) scale(0.85)">
              <polygon
                points="0,-8 2.5,-2.5 8,-2.5 4,1 5.5,7 0,3.5 -5.5,7 -4,1 -8,-2.5 -2.5,-2.5"
                fill="#FFC93C"
                stroke="#1F1A2B"
                strokeWidth="1.5"
              />
            </g>
          </>
        );
      case "thinking":
        return (
          <>
            <path
              d="M 33 39 Q 38 36 43 38"
              stroke="#1F1A2B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="38" cy="47" r="5" fill="#1F1A2B" />
            <circle cx="62" cy="47" r="5" fill="#1F1A2B" />
          </>
        );
      default:
        return (
          <>
            <circle cx="38" cy="47" r="5.5" fill="#1F1A2B" />
            <circle cx="40" cy="45" r="2" fill="#FFFFFF" />
            <circle cx="62" cy="47" r="5.5" fill="#1F1A2B" />
            <circle cx="64" cy="45" r="2" fill="#FFFFFF" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (effectiveExpression) {
      case "excited":
      case "happy":
        return (
          <path
            d="M 40 56 Q 50 68 60 56 Z"
            fill="#FF5CAA"
            stroke="#1F1A2B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      case "shocked":
        return (
          <ellipse
            cx="50"
            cy="59"
            rx="4.5"
            ry="6"
            fill="#1F1A2B"
          />
        );
      case "mystery_star":
        return (
          <path
            d="M 42 56 Q 50 69 58 56 Z"
            fill="#FF5CAA"
            stroke="#1F1A2B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      case "thinking":
        return (
          <ellipse
            cx="50"
            cy="58"
            rx="3"
            ry="2.5"
            fill="#1F1A2B"
          />
        );
      default:
        return (
          <path
            d="M 44 57 Q 50 63 56 57"
            stroke="#1F1A2B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        );
    }
  };

  const isVertical = layout === "vertical";

  const speechBubble = (
    <div
      className={`${
        isVertical ? "w-60 sm:w-68 min-h-[58px]" : "w-48 sm:w-60 min-h-[58px]"
      } flex items-center shrink-0`}
    >
      <AnimatePresence mode="wait">
        {currentSpeech ? (
          <motion.div
            key={currentSpeech}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className={`w-full relative bg-surface border-2 border-darkline shadow-retro-xs rounded-xl px-3.5 py-2.5 text-xs font-semibold text-text leading-snug cursor-pointer select-none focus:outline-none outline-none ${
              isVertical ? "text-center pt-3 pb-2.5" : ""
            }`}
            onClick={handleMascotClick}
          >
            {showSpeakerTag ? (
              <div className="absolute -top-2.5 left-3 bg-arcade-purple text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-darkline uppercase tracking-wider">
                Operator Pip
              </div>
            ) : null}
            {/* Speech Bubble Tail */}
            {isVertical ? (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-surface border-r-2 border-b-2 border-darkline rotate-45" />
            ) : (
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2.5 h-2.5 bg-surface border-l-2 border-b-2 border-darkline -rotate-45" />
            )}
            <p className="line-clamp-2">{currentSpeech}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      className={`relative select-none ${
        isVertical
          ? "flex flex-col items-center gap-2"
          : "inline-flex items-center gap-3"
      } ${className}`}
    >
      {isVertical ? speechBubble : null}

      {/* Pip Mascot SVG with Acrobatic Motion on Click & Calm Bobbing on Idle */}
      <motion.div
        key={isTricking ? `trick-${currentTrick}` : "idle"}
        onClick={handleMascotClick}
        animate={
          isTricking
            ? TRICK_ANIMATIONS[currentTrick]
            : { y: [0, -4, 0] }
        }
        transition={
          isTricking
            ? undefined
            : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${sizeMap[size]} shrink-0 cursor-pointer pt-1 focus:outline-none outline-none`}
      >
        <svg
          viewBox="0 -14 100 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[3px_3px_0px_#1F1A2B]"
        >
          {/* Animated Antenna / Star on top */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{ originX: "50px", originY: "16px" }}
          >
            <path
              d="M 50 16 L 50 6"
              stroke="#503047"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="6"
              r="5"
              fill="#C05746"
              stroke="#503047"
              strokeWidth="2.5"
            />
          </motion.g>

          {/* Little Feet in Muted Olive */}
          <motion.ellipse
            cx="35"
            cy="108"
            rx="9"
            ry="6"
            fill="#ADC698"
            stroke="#503047"
            strokeWidth="2.5"
            animate={{ scaleY: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="65"
            cy="108"
            rx="9"
            ry="6"
            fill="#ADC698"
            stroke="#503047"
            strokeWidth="2.5"
            animate={{ scaleY: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Bottom Capsule Half (White) */}
          <path
            d="M 20 60 L 20 82 C 20 98 80 98 80 82 L 80 60 Z"
            fill="#FFFFFF"
            stroke="#503047"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Top Capsule Half (Blackberry Cream) */}
          <path
            d="M 20 60 L 20 38 C 20 22 80 22 80 38 L 80 60 Z"
            fill={expression === "mystery_star" ? "url(#pipRainbow)" : "#503047"}
            stroke="#503047"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Capsule Center Joint Belt (Rosy Copper) */}
          <rect
            x="17"
            y="57"
            width="66"
            height="7"
            rx="3.5"
            fill="#C05746"
            stroke="#503047"
            strokeWidth="2.5"
          />

          {/* Cute Little Hands (Gently waving) */}
          <motion.ellipse
            cx="17"
            cy="70"
            rx="5"
            ry="6"
            fill="#FFFFFF"
            stroke="#503047"
            strokeWidth="2.5"
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="83"
            cy="70"
            rx="5"
            ry="6"
            fill="#FFFFFF"
            stroke="#503047"
            strokeWidth="2.5"
            animate={{ rotate: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />

          {/* Cute Cheeks */}
          <ellipse cx="28" cy="54" rx="4.5" ry="2.5" fill="#C05746" opacity="0.6" />
          <ellipse cx="72" cy="54" rx="4.5" ry="2.5" fill="#C05746" opacity="0.6" />

          {/* Dynamic Face Features */}
          {renderEyes()}
          {renderMouth()}

          {/* Rainbow Gradient Definition */}
          <defs>
            <linearGradient id="pipRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="33%" stopColor="#FFC93C" />
              <stop offset="66%" stopColor="#2FBF71" />
              <stop offset="100%" stopColor="#3D8BFD" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {!isVertical ? speechBubble : null}
    </div>
  );
}
