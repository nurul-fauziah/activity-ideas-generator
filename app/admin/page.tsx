"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Activity, CategoryId, Rarity } from "@/types/activity";
import initialActivities from "@/data/activities.json";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminFilters, SortOption } from "@/components/admin/admin-filters";
import { AdminTable } from "@/components/admin/admin-table";
import { ActivityEditorModal } from "@/components/admin/activity-editor-modal";
import { DeleteConfirmModal } from "@/components/admin/delete-confirm-modal";
import { AdminPinModal } from "@/components/admin/admin-pin-modal";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

const PIN_STORAGE_KEY = "ngapain_admin_pin";

export default function AdminPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Security: PIN Authentication state
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalError, setPinModalError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("id-asc");

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  // Read saved session PIN if present
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(PIN_STORAGE_KEY);
      if (cached) {
        setAdminPin(cached);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // Load activities from API or fallback
  const loadActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activities");
      if (res.ok) {
        const data = (await res.json()) as { activities: Activity[] };
        if (data.activities && Array.isArray(data.activities)) {
          setActivities(data.activities);
          setIsLoaded(true);
          setHasUnsavedChanges(false);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setActivities(initialActivities as Activity[]);
    setIsLoaded(true);
    setHasUnsavedChanges(false);
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Handle Save with PIN verification
  const handleSaveToDisk = async (pinOverride?: string) => {
    const pinToUse = pinOverride || adminPin;

    if (!pinToUse) {
      setPinModalError(null);
      setIsPinModalOpen(true);
      return;
    }

    setIsSaving(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pinToUse,
        },
        body: JSON.stringify({ activities }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        isReadOnly?: boolean;
      };

      if (res.status === 401) {
        // PIN Salah
        setAdminPin(null);
        try {
          sessionStorage.removeItem(PIN_STORAGE_KEY);
        } catch {}
        setPinModalError("PIN salah atau tidak valid. Silakan coba lagi.");
        setIsPinModalOpen(true);
        return;
      }

      if (res.ok && data.success) {
        // Simpan PIN ke sessionStorage jika berhasil
        setAdminPin(pinToUse);
        try {
          sessionStorage.setItem(PIN_STORAGE_KEY, pinToUse);
        } catch {}
        setIsPinModalOpen(false);

        setHasUnsavedChanges(false);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        setLastSavedAt(timeStr);
        setNotification({
          type: "success",
          message: data.message || "Berhasil disimpan ke data/activities.json!",
        });
      } else {
        // If read-only serverless environment, offer download
        if (data.isReadOnly) {
          handleDownloadJson();
          setNotification({
            type: "info",
            message:
              "Server berjalan di mode read-only. File activities.json otomatis diunduh ke komputermu!",
          });
        } else {
          setNotification({
            type: "error",
            message: data.message || "Gagal menyimpan perubahan ke server.",
          });
        }
      }
    } catch {
      setNotification({
        type: "error",
        message: "Gagal terhubung ke server. Kamu bisa menggunakan tombol 'Unduh JSON'.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Lock session / clear PIN
  const handleLockSession = () => {
    setAdminPin(null);
    try {
      sessionStorage.removeItem(PIN_STORAGE_KEY);
    } catch {}
    setNotification({
      type: "info",
      message: "Sesi admin telah dikunci. PIN akan diminta kembali saat menyimpan.",
    });
  };

  // Handle Download JSON
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activities.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Copy JSON
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(activities, null, 2);
    navigator.clipboard.writeText(jsonStr);
  };

  // Filter & Sort Logic
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = act.title?.toLowerCase().includes(q);
          const matchDesc = act.description?.toLowerCase().includes(q);
          const matchId = act.id?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchId) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          if (!act.categories?.includes(selectedCategory)) return false;
        }

        // Rarity
        if (selectedRarity !== "all") {
          if (act.rarity !== selectedRarity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "id-asc") return a.id.localeCompare(b.id);
        if (sortBy === "id-desc") return b.id.localeCompare(a.id);
        if (sortBy === "title-asc") return a.title.localeCompare(b.title);
        if (sortBy === "xp-desc") return (b.xp || 0) - (a.xp || 0);
        if (sortBy === "duration-asc")
          return (a.duration_min || 0) - (b.duration_min || 0);
        return 0;
      });
  }, [activities, searchQuery, selectedCategory, selectedRarity, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== "all" ||
    selectedRarity !== "all" ||
    sortBy !== "id-asc";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedRarity("all");
    setSortBy("id-asc");
  };

  // Create or Update Activity
  const handleSaveActivity = (savedActivity: Activity) => {
    if (activityToEdit) {
      // Update existing
      setActivities((prev) =>
        prev.map((act) => (act.id === savedActivity.id ? savedActivity : act))
      );
      setNotification({
        type: "success",
        message: `Misi '${savedActivity.id}' berhasil diperbarui di daftar.`,
      });
    } else {
      // Add new to top
      setActivities((prev) => [savedActivity, ...prev]);
      setNotification({
        type: "success",
        message: `Misi baru '${savedActivity.id}' berhasil ditambahkan ke daftar.`,
      });
    }
    setHasUnsavedChanges(true);
    setIsEditorOpen(false);
    setActivityToEdit(null);
  };

  // Duplicate
  const handleDuplicateActivity = (act: Activity) => {
    const newId = `${act.id}-copy-${Math.floor(10 + Math.random() * 90)}`;
    const cloned: Activity = {
      ...act,
      id: newId,
      title: `${act.title} (Salinan)`,
    };
    setActivityToEdit(cloned);
    setIsEditorOpen(true);
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!activityToDelete) return;
    setActivities((prev) => prev.filter((a) => a.id !== activityToDelete.id));
    setHasUnsavedChanges(true);
    setNotification({
      type: "info",
      message: `Misi '${activityToDelete.id}' telah dihapus dari daftar.`,
    });
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  };

  const existingIds = useMemo(() => activities.map((a) => a.id), [activities]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="font-mono text-sm font-bold animate-pulse text-arcade-yellow">
          Memuat Katalog Misi...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col pb-16">
      {/* Admin Header */}
      <AdminHeader
        totalCount={activities.length}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        isPinAuthenticated={Boolean(adminPin)}
        onLock={handleLockSession}
        onAddNew={() => {
          setActivityToEdit(null);
          setIsEditorOpen(true);
        }}
        onSave={() => handleSaveToDisk()}
        onDownload={handleDownloadJson}
        onCopyJson={handleCopyJson}
        onReload={loadActivities}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 mt-6 space-y-6 flex-1">
        {/* Toast Notification Banner */}
        {notification && (
          <div
            className={`p-3.5 rounded-lg border-2 flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-150 shadow-[2px_2px_0_var(--arcade-dark)] ${
              notification.type === "success"
                ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
                : notification.type === "error"
                ? "bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/30"
                : "bg-arcade-cream/50 text-arcade-dark border-darkline/20"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {notification.type === "error" && (
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              )}
              {notification.type === "info" && (
                <Info className="w-4 h-4 text-arcade-yellow shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="hover:opacity-75 cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <AdminStats activities={activities} />

        {/* Search, Filter, Sort Controls */}
        <AdminFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedRarity={selectedRarity}
          onRarityChange={setSelectedRarity}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          resultCount={filteredActivities.length}
        />

        {/* Activities Table */}
        <AdminTable
          activities={filteredActivities}
          onEdit={(act) => {
            setActivityToEdit(act);
            setIsEditorOpen(true);
          }}
          onDuplicate={handleDuplicateActivity}
          onDelete={(act) => {
            setActivityToDelete(act);
            setIsDeleteModalOpen(true);
          }}
        />
      </main>

      {/* Editor Modal */}
      <ActivityEditorModal
        isOpen={isEditorOpen}
        activityToEdit={activityToEdit}
        existingIds={existingIds}
        onSave={handleSaveActivity}
        onClose={() => {
          setIsEditorOpen(false);
          setActivityToEdit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        activity={activityToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setActivityToDelete(null);
        }}
      />

      {/* Admin PIN Authentication Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        errorMessage={pinModalError}
        onVerify={(enteredPin) => handleSaveToDisk(enteredPin)}
        onClose={() => {
          setIsPinModalOpen(false);
          setPinModalError(null);
        }}
      />
    </div>
  );
}
