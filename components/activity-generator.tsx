"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Activity, CategoryId, OptionalFilters } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import rawActivities from "@/data/activities.json";
import { CategoryChip } from "./category-chip";
import { ExtraFilters } from "./extra-filters";
import { ActivityCard } from "./activity-card";
import { EmptyState } from "./empty-state";
import { SavedModal } from "./saved-modal";
import { Toast, ToastMessage } from "./toast";
import { Button } from "./ui/button";
import { Shuffle, CheckSquare, Square, RotateCcw } from "lucide-react";

const allActivities = rawActivities as Activity[];

const STORAGE_SAVED_KEY = "ngapain_yuk_saved_activities";
const STORAGE_HISTORY_KEY = "ngapain_yuk_recent_history";

export function ActivityGenerator() {
  // State: Categories selection (empty by default)
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  // State: Optional filters
  const [extraFilters, setExtraFilters] = useState<OptionalFilters>({
    duration: "all",
    social: "all",
    place: "all",
    device: "all",
  });

  // State: Current active generated activity
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  // State: Generator state (idle, generated, empty)
  const [hasGenerated, setHasGenerated] = useState(false);

  // State: Saved favorites & Recent History in localStorage
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  const [recentHistory, setRecentHistory] = useState<string[]>([]);

  // State: Saved Modal & Toast
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load saved & history from localStorage on mount
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem(STORAGE_SAVED_KEY);
      if (savedStr) {
        setSavedActivities(JSON.parse(savedStr));
      }
      const histStr = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (histStr) {
        setRecentHistory(JSON.parse(histStr));
      }
    } catch {
      // Local storage fallback handled silently
    }
  }, []);

  // Check URL param for shared activity ID on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("id");
    if (sharedId) {
      const found = allActivities.find((a) => a.id === sharedId);
      if (found) {
        setCurrentActivity(found);
        setHasGenerated(true);
        // also auto-select its category
        setSelectedCategories(found.categories);
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

  // Save / Unsave Favorite Activity
  const handleToggleSave = useCallback(
    (activity: Activity) => {
      setSavedActivities((prev) => {
        const exists = prev.some((item) => item.id === activity.id);
        let updated: Activity[];
        if (exists) {
          updated = prev.filter((item) => item.id !== activity.id);
          showToast("Aktivitas dihapus dari daftar simpanan", "info");
        } else {
          updated = [activity, ...prev];
          showToast("Aktivitas berhasil disimpan!", "success");
        }
        try {
          localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [showToast]
  );

  // Remove saved item directly from modal
  const handleRemoveSaved = useCallback((id: string) => {
    setSavedActivities((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Share activity link
  const handleShare = useCallback(
    async (activity: Activity) => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${activity.id}`;
      const shareText = `Lagi senggang? Coba ini: "${activity.title}" (100% Gratis di NgapainYuk)`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: activity.title,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch {
          // Fallback to clipboard
        }
      }

      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showToast("Tautan aktivitas disalin ke clipboard!", "success");
      } catch {
        showToast("Gagal menyalin tautan", "info");
      }
    },
    [showToast]
  );

  // Toggle single category selection
  const handleToggleCategory = (id: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Select all categories
  const handleSelectAllCategories = () => {
    setSelectedCategories(CATEGORIES.map((c) => c.id));
  };

  // Clear categories selection
  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  // Reset optional extra filters
  const handleResetExtraFilters = () => {
    setExtraFilters({
      duration: "all",
      social: "all",
      place: "all",
      device: "all",
    });
  };

  // Core Generator Execution (PRD Section 8)
  const generateRandomActivity = useCallback(() => {
    if (selectedCategories.length === 0) return;

    // Step 1: Match selected categories: Prioritize primary category (act.categories[0])
    // so results match the exact intent of the selected category.
    let candidates = allActivities.filter((act) =>
      selectedCategories.includes(act.categories[0])
    );

    // Fallback if no primary category matches
    if (candidates.length === 0) {
      candidates = allActivities.filter((act) =>
        act.categories.some((c) => selectedCategories.includes(c))
      );
    }

    // Step 2: Apply optional extra filters (AND logic)
    if (extraFilters.duration !== "all") {
      const maxDuration = parseInt(extraFilters.duration, 10);
      if (extraFilters.duration === "60+") {
        candidates = candidates.filter((act) => act.duration_min >= 60);
      } else {
        candidates = candidates.filter((act) => act.duration_min <= maxDuration);
      }
    }

    if (extraFilters.place !== "all") {
      candidates = candidates.filter((act) => act.place === extraFilters.place);
    }

    if (extraFilters.social !== "all") {
      candidates = candidates.filter((act) => act.social === extraFilters.social);
    }

    if (extraFilters.device !== "all") {
      candidates = candidates.filter((act) => act.device === extraFilters.device);
    }

    // If no candidate matches the criteria at all
    if (candidates.length === 0) {
      setCurrentActivity(null);
      setHasGenerated(true);
      return;
    }

    // Step 3: Filter out last 10 items from recent history to prevent immediate repeats
    let pool = candidates.filter((act) => !recentHistory.includes(act.id));

    // If pool exhausted by recent history, reset history for these candidates
    if (pool.length === 0) {
      pool = candidates;
    }

    // Step 4: Pick uniformly at random
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    setCurrentActivity(chosen);
    setHasGenerated(true);

    // Update recent history (keep max 10 entries)
    setRecentHistory((prev) => {
      const updated = [chosen.id, ...prev.filter((id) => id !== chosen.id)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Smooth scroll to card if needed
    const cardEl = document.getElementById("activity-card-container");
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedCategories, extraFilters, recentHistory]);

  const isCurrentSaved = useMemo(() => {
    if (!currentActivity) return false;
    return savedActivities.some((act) => act.id === currentActivity.id);
  }, [currentActivity, savedActivities]);

  return (
    <div className="w-full space-y-10">
      {/* Category Selection Section */}
      <section aria-labelledby="category-section-title" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              id="category-section-title"
              className="font-display text-xl sm:text-2xl font-bold text-text"
            >
              Lagi Pengen Ngapain?
            </h2>
            <p className="text-sm text-text-muted">
              Pilih minimal satu suasana atau tujuan aktivitas yang kamu mau.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={handleSelectAllCategories}
              className="px-2.5 py-1 rounded-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Pilih Semua
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={handleClearCategories}
              className="px-2.5 py-1 rounded-sm text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              Hapus Pilihan
            </button>
          </div>
        </div>

        {/* Categories Chip Grid */}
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isSelected={selectedCategories.includes(cat.id)}
              onToggle={handleToggleCategory}
            />
          ))}
        </div>
      </section>

      {/* Extra Filters Accordion */}
      <section aria-label="Filter tambahan">
        <ExtraFilters
          filters={extraFilters}
          onChange={setExtraFilters}
          onReset={handleResetExtraFilters}
        />
      </section>

      {/* Primary Action Button */}
      <div className="flex flex-col items-center justify-center pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={generateRandomActivity}
          disabled={selectedCategories.length === 0}
          className="w-full sm:w-auto min-w-[280px] shadow-e2 text-base sm:text-lg"
        >
          <Shuffle size={20} />
          <span>
            {hasGenerated ? "Cari Ide Lain" : "Cariin Aktivitas Gratis"}
          </span>
        </Button>

        {selectedCategories.length === 0 ? (
          <p className="text-xs text-text-muted mt-2 text-center">
            Pilih minimal satu kategori di atas untuk memulai
          </p>
        ) : null}
      </div>

      {/* Output Section: Activity Card or Empty State */}
      <section id="activity-card-container" aria-live="polite" className="pt-4">
        {hasGenerated ? (
          currentActivity ? (
            <ActivityCard
              activity={currentActivity}
              isSaved={isCurrentSaved}
              selectedCategories={selectedCategories}
              onReroll={generateRandomActivity}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
          ) : (
            <EmptyState
              onResetFilters={() => {
                handleResetExtraFilters();
                generateRandomActivity();
              }}
            />
          )
        ) : null}
      </section>

      {/* Saved Activities Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedActivities={savedActivities}
        onSelectActivity={(act) => {
          setCurrentActivity(act);
          setHasGenerated(true);
        }}
        onRemoveSaved={handleRemoveSaved}
      />

      {/* Global Toast Announcement */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
