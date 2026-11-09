import React, { useEffect, useRef } from "react";
import { Activity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { X, Trash2, ArrowRight, Bookmark } from "lucide-react";
import { Button } from "./ui/button";

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedActivities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onRemoveSaved: (id: string) => void;
}

export function SavedModal({
  isOpen,
  onClose,
  savedActivities,
  onSelectActivity,
  onRemoveSaved,
}: SavedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-surface border border-border rounded-lg shadow-e2 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark size={20} className="text-primary fill-primary" />
            <h2
              id="saved-modal-title"
              className="font-display text-xl font-bold text-text"
            >
              Aktivitas Tersimpan ({savedActivities.length})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Tutup jendela aktivitas tersimpan"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {savedActivities.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              <p className="text-base font-semibold mb-1 text-text">
                Belum ada aktivitas yang disimpan
              </p>
              <p className="text-sm">
                Klik ikon bookmark pada kartu aktivitas yang kamu sukai untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            savedActivities.map((act) => {
              const mainCat =
                CATEGORIES.find((c) => c.id === act.categories[0]) ||
                CATEGORIES[0];

              return (
                <div
                  key={act.id}
                  className="p-4 bg-surface-2 rounded-md border border-border flex items-center justify-between gap-3 hover:border-primary/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded-pill text-[10px] font-bold text-white uppercase"
                        style={{ backgroundColor: mainCat.color }}
                      >
                        {mainCat.label}
                      </span>
                      <span className="text-xs text-text-muted font-medium">
                        {act.duration_min} mnt
                      </span>
                    </div>
                    <h3 className="font-semibold text-text text-sm sm:text-base truncate">
                      {act.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onSelectActivity(act);
                        onClose();
                      }}
                      aria-label={`Buka aktivitas: ${act.title}`}
                      className="text-primary hover:bg-primary/10"
                    >
                      <ArrowRight size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveSaved(act.id)}
                      aria-label={`Hapus ${act.title} dari simpanan`}
                      className="text-text-muted hover:text-danger hover:bg-danger/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
