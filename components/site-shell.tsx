"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { Activity, CategoryId, OptionalFilters, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import rawActivities from "@/data/activities.json";
import { useGameStore } from "@/store/use-game-store";
import { CoinPicker } from "./gacha/coin-picker";
import { MachineSettings } from "./gacha/machine-settings";
import { GachaMachine, MachinePhase } from "./gacha/gacha-machine";
import { MissionModal } from "./gacha/mission-modal";
import { EmptyState } from "./empty-state";
import { SavedModal } from "./saved-modal";
import { Toast, ToastMessage } from "./toast";
import { Pip, PipExpression } from "./mascot/pip";
import { WelcomeModal } from "./onboarding/welcome-modal";
import { Disc, Gift, Compass, Layers, Shield } from "lucide-react";

const allActivities = rawActivities as Activity[];

export function SiteShell() {
  // Game Store actions
  const completeMission = useGameStore((state) => state.completeMission);
  const toggleSaveMission = useGameStore((state) => state.toggleSaveMission);
  const recordSpin = useGameStore((state) => state.recordSpin);
  const recordCollectedMission = useGameStore((state) => state.recordCollectedMission);
  const canClaimDailySpin = useGameStore((state) => state.canClaimDailySpin);
  const claimDailySpin = useGameStore((state) => state.claimDailySpin);
  const savedMissionIds = useGameStore((state) => state.savedMissions);
  const soundMuted = useGameStore((state) => state.soundMuted);
  const playerName = useGameStore((state) => state.playerName);

  // Gacha State
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [isMysterySelected, setIsMysterySelected] = useState<boolean>(false);
  const [isDailySpinActive, setIsDailySpinActive] = useState<boolean>(false);
  const [extraFilters, setExtraFilters] = useState<OptionalFilters>({
    duration: "all",
    social: "all",
    place: "all",
    device: "all",
  });

  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [gachaPhase, setGachaPhase] = useState<MachinePhase>("idle");
  const [recentHistory, setRecentHistory] = useState<string[]>([]);

  // UI state
  const [hasMounted, setHasMounted] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Set hasMounted to true on client to prevent SSR hydration mismatch for persisted store data
  useEffect(() => {
    setHasMounted(true);
    if (!useGameStore.getState().playerName) {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  // Check URL param on mount (shared activity)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("id");
    if (sharedId) {
      const found = allActivities.find((a) => a.id === sharedId);
      if (found) {
        setCurrentActivity(found);
        setGachaPhase("opened");
        setSelectedCategories([found.categories[0]]);
      }
    }
  }, []);

  const showToast = useCallback((text: string, type: "success" | "info" = "success") => {
    setToast({
      id: Date.now().toString(),
      text,
      type,
    });
  }, []);

  // Coin selection logic
  const handleToggleCategory = (id: CategoryId) => {
    setIsMysterySelected(false); // deselect mystery
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSelectMystery = () => {
    setIsMysterySelected((prev) => {
      const next = !prev;
      if (next) setSelectedCategories([]); // deselect others
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    setIsMysterySelected(false);
    setSelectedCategories(CATEGORIES.map((c) => c.id));
  };

  const handleClearCategories = () => {
    setIsMysterySelected(false);
    setSelectedCategories([]);
  };

  const handleResetExtraFilters = () => {
    setExtraFilters({
      duration: "all",
      social: "all",
      place: "all",
      device: "all",
    });
  };

  // Helper to trigger confetti celebration
  const triggerConfetti = (isGold = false) => {
    try {
      if (isGold) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFB800", "#FFC93C", "#FFE699", "#FFFFFF"],
        });
      } else {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#5B3DF5", "#FFC93C", "#FF5CAA", "#2FBF71", "#3D8BFD"],
        });
      }
    } catch {
      // Fallback
    }
  };

  // Core Candidate Picker (with weighted rarity)
  const pickTargetActivity = useCallback((): Activity | null => {
    let pool: Activity[] = [];

    if (isMysterySelected) {
      // Mystery Coin: balanced across all categories
      pool = [...allActivities];
    } else if (selectedCategories.length > 0) {
      // Category Coin(s): prioritize primary category match
      pool = allActivities.filter((act) =>
        selectedCategories.includes(act.categories[0])
      );
      if (pool.length === 0) {
        pool = allActivities.filter((act) =>
          act.categories.some((c) => selectedCategories.includes(c))
        );
      }
    } else {
      return null;
    }

    // Apply optional extra filters (AND logic)
    if (extraFilters.duration !== "all") {
      const maxDuration = parseInt(extraFilters.duration, 10);
      if (extraFilters.duration === "60+") {
        pool = pool.filter((act) => act.duration_min >= 60);
      } else {
        pool = pool.filter((act) => act.duration_min <= maxDuration);
      }
    }

    if (extraFilters.place !== "all") {
      pool = pool.filter((act) => act.place === extraFilters.place);
    }

    if (extraFilters.social !== "all") {
      pool = pool.filter((act) => act.social === extraFilters.social);
    }

    if (extraFilters.device !== "all") {
      pool = pool.filter((act) => act.device === extraFilters.device);
    }

    if (pool.length === 0) return null;

    // Filter out 10 recent history items to avoid immediate repeats
    let validPool = pool.filter((act) => !recentHistory.includes(act.id));
    if (validPool.length === 0) validPool = pool;

    // Weighted Rarity Selection (PRD Section 2)
    // Default: Common 60%, Rare 25%, Epic 12%, Legendary 3%
    // Mystery Coin: Common 50%, Rare 28%, Epic 17%, Legendary 5%
    // Daily Spin Guarantee: Rare 50%, Epic 35%, Legendary 15% (No Common)
    const rand = Math.random() * 100;
    let targetRarity: Rarity = "common";

    if (isDailySpinActive) {
      if (rand < 15) targetRarity = "legendary";
      else if (rand < 50) targetRarity = "epic";
      else targetRarity = "rare";
    } else if (isMysterySelected) {
      if (rand < 5) targetRarity = "legendary";
      else if (rand < 22) targetRarity = "epic";
      else if (rand < 50) targetRarity = "rare";
      else targetRarity = "common";
    } else {
      if (rand < 3) targetRarity = "legendary";
      else if (rand < 15) targetRarity = "epic";
      else if (rand < 40) targetRarity = "rare";
      else targetRarity = "common";
    }

    // Filter by target rarity if candidates exist
    const rarityPool = validPool.filter((a) => a.rarity === targetRarity);
    const finalCandidates = rarityPool.length > 0 ? rarityPool : validPool;

    const chosen = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
    return chosen;
  }, [isMysterySelected, selectedCategories, extraFilters, recentHistory]);

  // Spin sequence trigger (with loading animation!)
  const handleStartSpin = useCallback(() => {
    if (!isMysterySelected && selectedCategories.length === 0) {
      showToast("Pilih minimal satu koin mood terlebih dahulu!", "info");
      return;
    }

    const chosen = pickTargetActivity();
    if (!chosen) {
      setCurrentActivity(null);
      setGachaPhase("opened"); // show empty state
      return;
    }

    setCurrentActivity(chosen);
    setGachaPhase("spinning");

    // Record spin to store
    recordSpin(isMysterySelected, chosen.categories[0], chosen.rarity);

    // Update local recent history
    setRecentHistory((prev) => [chosen.id, ...prev.filter((id) => id !== chosen.id)].slice(0, 10));

    // After 2.1 seconds of smooth arcade animation, the bottom capsule drops directly into the chute
    const timer = setTimeout(() => {
      setGachaPhase("capsule_ready");
    }, 2100);

    return () => clearTimeout(timer);
  }, [isMysterySelected, selectedCategories, pickTargetActivity, recordSpin, showToast]);

  // Skip animation handler for instant drop
  const handleSkipAnimation = useCallback(() => {
    if (gachaPhase === "spinning") {
      setGachaPhase("capsule_ready");
    }
  }, [gachaPhase]);

  // Trigger Daily Guaranteed Spin (Rare+)
  const handleTriggerDailySpin = useCallback(() => {
    if (!canClaimDailySpin()) {
      showToast("Putaran harian sudah kamu klaim hari ini. Kembali lagi besok!", "info");
      return;
    }

    claimDailySpin();
    setIsDailySpinActive(true);
    setIsMysterySelected(true);
    setSelectedCategories([]);

    const guaranteedPool = allActivities.filter((a) => a.rarity !== "common");
    const rand = Math.random() * 100;
    let targetRarity: Rarity = "rare";
    if (rand < 20) targetRarity = "legendary";
    else if (rand < 55) targetRarity = "epic";
    else targetRarity = "rare";

    const rarityCandidates = guaranteedPool.filter((a) => a.rarity === targetRarity);
    const chosen =
      rarityCandidates[Math.floor(Math.random() * rarityCandidates.length)] ||
      guaranteedPool[0];

    setCurrentActivity(chosen);
    setGachaPhase("spinning");
    recordSpin(true, chosen.categories[0], chosen.rarity);

    showToast("Daily Spin Aktif! Kapsul jaminan Rare ke atas!", "success");

    const timer = setTimeout(() => {
      setGachaPhase("capsule_ready");
      setIsDailySpinActive(false);
    }, 2100);

    return () => clearTimeout(timer);
  }, [canClaimDailySpin, claimDailySpin, recordSpin, showToast]);

  // Open capsule handler
  const handleOpenCapsule = useCallback(() => {
    if (!currentActivity) return;
    setGachaPhase("opened");

    // Add to Kapsulpedia collection
    const { isNew } = recordCollectedMission(currentActivity);
    if (isNew) {
      showToast(
        `Kartu #${currentActivity.id.replace(/^[a-z]+-/, "")} baru tersimpan di Kapsulpedia! (+5 Koin)`,
        "info"
      );
    }

    // Toast celebration notices
    if (currentActivity.rarity === "legendary") {
      showToast("WOOOW! Kamu dapat Kapsul Legendary!", "success");
    } else if (currentActivity.rarity === "epic") {
      showToast("MANTAP! Kapsul Epic Berhasil Dibuka!", "success");
    }
  }, [currentActivity, recordCollectedMission, showToast]);

  // Close mission result pop-up modal
  const handleCloseResultModal = useCallback(() => {
    setGachaPhase("idle");
  }, []);

  // Claim Mission Reward
  const handleClaimReward = useCallback(
    (activity: Activity) => {
      const { xpGained, coinsGained, leveledUp } = completeMission(
        activity,
        isMysterySelected
      );
      triggerConfetti(false);

      if (leveledUp) {
        showToast(
          `LEVEL UP! Kamu mendapat +${xpGained} XP dan +${coinsGained} Koin!`,
          "success"
        );
      } else {
        showToast(
          `Misi selesai! Hadiah +${xpGained} XP & +${coinsGained} Koin berhasil diklaim!`,
          "success"
        );
      }
    },
    [completeMission, isMysterySelected, showToast]
  );

  // Toggle Save Mission
  const handleToggleSave = useCallback(
    (activity: Activity) => {
      const isSaved = toggleSaveMission(activity.id);
      if (isSaved) {
        showToast("Kartu misi disimpan ke Koleksimu!", "success");
      } else {
        showToast("Kartu misi dihapus dari daftar simpanan", "info");
      }
    },
    [toggleSaveMission, showToast]
  );

  // Share activity link
  const handleShare = useCallback(
    async (activity: Activity) => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${activity.id}`;
      const shareText = `Lagi senggang? Coba misi [${activity.rarity.toUpperCase()}]: "${activity.title}" (100% Gratis di NgapainYuk)`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: activity.title,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch {
          // fallback
        }
      }

      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showToast("Tautan kartu misi disalin ke clipboard!", "success");
      } catch {
        showToast("Gagal menyalin tautan", "info");
      }
    },
    [showToast]
  );

  // Mascot Pip's dynamic state
  const getPipState = (): { expression: PipExpression; text: string } => {
    if (gachaPhase === "spinning") {
      return {
        expression: "shocked",
        text: isMysterySelected
          ? "Wooo! Kapsul pelangi misteri lagi dikocok heboh!"
          : "Kocok terus mesinnya! Bola-bola kapsul lagi berguncang!",
      };
    }
    if (gachaPhase === "capsule_ready") {
      return {
        expression: "excited",
        text: "Kapsulnya jatuh ke lubang bawah! Tap untuk buka yuk!",
      };
    }
    if (gachaPhase === "opened" && currentActivity) {
      if (currentActivity.rarity === "legendary") {
        return {
          expression: "mystery_star",
          text: "WAAAH! Beneran dapet LEGENDARY! Hoki banget kamu!",
        };
      }
      return {
        expression: "happy",
        text: "Kapsul kebuka! Misi seru siap kamu gas sekarang!",
      };
    }
    if (isMysterySelected) {
      return {
        expression: "mystery_star",
        text: "Gak mau mikir? Serahin ke Pip! Mode Acak Total aktif!",
      };
    }
    if (selectedCategories.length > 0) {
      return {
        expression: "excited",
        text: `${selectedCategories.length} koin dipilih! Sekarang putar tuas mesin gachanya!`,
      };
    }
    return {
      expression: "idle",
      text: playerName
        ? `Halo ${playerName}! Masukin koin mood kamu, lalu putar tuas mesin gacha!`
        : "Halo! Aku Pip! Masukin koin mood kamu, lalu putar tuas mesin gacha!",
    };
  };

  const pipState = getPipState();

  const isCurrentSaved = useMemo(() => {
    if (!currentActivity) return false;
    return savedMissionIds.includes(currentActivity.id);
  }, [currentActivity, savedMissionIds]);

  const hasCoinsSelected = isMysterySelected || selectedCategories.length > 0;

  // Saved activities for modal
  const savedActivitiesList = useMemo(() => {
    return allActivities.filter((a) => savedMissionIds.includes(a.id));
  }, [savedMissionIds]);

  return (
    <div className="min-h-screen flex flex-col text-text">
      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Hero Section: Arcade Attract Screen & Operator Console */}
        <section
          aria-labelledby="hero-title"
          className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl overflow-hidden"
        >
          {/* Arcade Cabinet Top Marquee Strip */}
          <div className="bg-arcade-purple text-white px-4 sm:px-6 py-2 border-b-3 border-darkline flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-arcade-mint animate-pulse" />
              <span>UNIT GACHA #01 · FREE PLAY</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-arcade-cream/90">
              <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                1 KOIN = 1 MISI
              </span>
              <span className="hidden sm:inline">TANPA DAFTAR</span>
            </div>
          </div>

          <div className="p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between">
            <div className="space-y-3.5 flex-1 text-center md:text-left">
              <h1
                id="hero-title"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-text tracking-tight leading-[1.05]"
              >
                Putar Mesinnya, Buka Kapsulnya!
              </h1>
              <p className="text-text-muted text-sm sm:text-base max-w-lg leading-relaxed mx-auto md:mx-0">
                Bingung mau ngapain hari ini? Masukkan koin mood kamu, putar tuas arcade, dan dapatkan misi aktivitas seru 100% bebas biaya!
              </p>

              {/* Tactile Cabinet Specification Rack (Modular arcade cells, zero pills) */}
              <div className="pt-1 flex justify-center md:justify-start">
                <div className="inline-grid grid-cols-3 divide-x-2 divide-darkline bg-surface-2 border-2 border-darkline rounded-lg shadow-retro-xs overflow-hidden text-center">
                  <div className="px-3.5 sm:px-4 py-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block leading-none mb-1">
                      Katalog
                    </span>
                    <span className="font-mono font-black text-xs sm:text-sm text-text block">
                      40 Misi
                    </span>
                  </div>
                  <div className="px-3.5 sm:px-4 py-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block leading-none mb-1">
                      Variasi
                    </span>
                    <span className="font-mono font-black text-xs sm:text-sm text-text block">
                      9 Mood
                    </span>
                  </div>
                  <div className="px-3.5 sm:px-4 py-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted block leading-none mb-1">
                      Harga
                    </span>
                    <span className="font-mono font-black text-xs sm:text-sm text-arcade-purple dark:text-arcade-yellow block">
                      100% Gratis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Pip Arcade Operator Station */}
            <div className="shrink-0 flex flex-col items-center justify-center pt-2 md:pt-0">
              <div className="relative flex flex-col items-center">
                <Pip
                  expression={pipState.expression}
                  speechText={pipState.text}
                  layout="vertical"
                  showSpeakerTag={true}
                  size="md"
                />

                {/* Integrated Arcade Control Deck & Coin Slot motif */}
                <div className="w-44 -mt-1 flex flex-col items-center">
                  <div className="w-full h-3.5 bg-arcade-purple border-2 border-darkline rounded-t-sm shadow-retro-xs flex items-center justify-between px-2.5 relative overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-arcade-cream/80 border border-darkline" />
                    <span className="text-[8px] font-mono font-black text-white/90 tracking-widest">
                      COIN ENTRY ⏷
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-arcade-cream/80 border border-darkline" />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-text-muted mt-2 tracking-wide uppercase hover:text-text cursor-pointer select-none">
                    Tap Pip Untuk Ngobrol
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Coin Picker Section */}
        <section aria-label="Pemilihan Koin Mood">
          <CoinPicker
            selectedCategories={selectedCategories}
            isMysterySelected={isMysterySelected}
            onSelectCategory={handleToggleCategory}
            onSelectMystery={handleSelectMystery}
            onSelectAll={handleSelectAllCategories}
            onClear={handleClearCategories}
          />
        </section>

        {/* 2. Machine Settings (Optional Filters) */}
        <section aria-label="Pengaturan Mesin">
          <MachineSettings
            filters={extraFilters}
            onChange={setExtraFilters}
            onReset={handleResetExtraFilters}
          />
        </section>

        {/* 3. The Gacha Machine Centerpiece */}
        <section aria-label="Mesin Gacha Utama" className="py-2 space-y-4">
          {/* Daily Spin Free Bonus Banner (guarded by hasMounted to eliminate SSR hydration mismatch) */}
          {hasMounted && canClaimDailySpin() && gachaPhase !== "spinning" ? (
            <div className="bg-arcade-yellow text-darkline border-3 border-darkline shadow-retro rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-white border-2 border-darkline shadow-retro-sm flex items-center justify-center shrink-0">
                  <Gift size={20} className="text-arcade-purple animate-bounce" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm sm:text-base leading-tight">
                    Daily Spin Bonus Hari Ini Siap!
                  </h3>
                  <p className="text-xs font-mono font-bold text-darkline/80">
                    Klaim 1 putaran bonus gratis dengan jaminan kapsul Rare ke atas!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerDailySpin}
                className="w-full sm:w-auto px-4 py-2 bg-arcade-purple text-white border-2 border-darkline shadow-retro-sm rounded-lg font-display font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Putar Daily Spin Sekarang
              </button>
            </div>
          ) : null}

          <GachaMachine
            phase={gachaPhase}
            hasCoinsSelected={hasCoinsSelected}
            isMystery={isMysterySelected}
            selectedCategories={selectedCategories}
            onTriggerSpin={handleStartSpin}
            onOpenCapsule={handleOpenCapsule}
            onSkipAnimation={handleSkipAnimation}
            capsuleRarity={currentActivity?.rarity}
            capsuleCategory={currentActivity?.categories[0]}
          />
        </section>

      </main>

      {/* Pop-up Modal Hasil Kapsul Misi Gacha (Floating on Top with Blurred Backdrop & Close 'X') */}
      <MissionModal
        isOpen={gachaPhase === "opened"}
        activity={currentActivity}
        isSaved={isCurrentSaved}
        isMysteryBonus={isMysterySelected}
        selectedCategories={selectedCategories}
        onClose={handleCloseResultModal}
        onReroll={handleStartSpin}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
        onClaimReward={handleClaimReward}
        onResetFilters={handleResetExtraFilters}
      />

      {/* Confident Designed Footer */}
      <footer className="w-full border-t-2 border-darkline bg-surface mt-16 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-display font-black text-lg text-text block">
              NgapainYuk Arcade Gacha
            </span>
            <p className="text-xs text-text-muted mt-0.5">
              100% free · Tanpa akun · Tanpa paywall · Simpanan tersimpan lokal di browsermu.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-text-muted">
            Platform Komitmen 100% Free
          </div>
        </div>
      </footer>

      {/* Welcome Onboarding Modal for First Time Visitors */}
      {hasMounted && !playerName ? (
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          onClose={() => setIsWelcomeModalOpen(false)}
        />
      ) : null}

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedActivities={savedActivitiesList}
        onSelectActivity={(act) => {
          setCurrentActivity(act);
          setGachaPhase("opened");
        }}
        onRemoveSaved={toggleSaveMission}
      />

      {/* Global Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
