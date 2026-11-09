import React, { useState } from "react";
import { Activity, CategoryId } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { Button } from "./ui/button";
import {
  Clock,
  MapPin,
  Users,
  Smartphone,
  Laptop,
  Hand,
  RotateCw,
  Bookmark,
  Share2,
  CheckCircle2,
} from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  isSaved: boolean;
  selectedCategories?: CategoryId[];
  onReroll: () => void;
  onToggleSave: (activity: Activity) => void;
  onShare: (activity: Activity) => void;
}

export function ActivityCard({
  activity,
  isSaved,
  selectedCategories = [],
  onReroll,
  onToggleSave,
  onShare,
}: ActivityCardProps) {
  const [isCommitted, setIsCommitted] = useState(false);

  // Sort categories so any user-selected category is displayed first
  const displayCategories = [...activity.categories].sort((a, b) => {
    const aSelected = selectedCategories.includes(a);
    const bSelected = selectedCategories.includes(b);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const getDeviceIcon = () => {
    switch (activity.device) {
      case "laptop":
        return <Laptop size={16} />;
      case "hp":
        return <Smartphone size={16} />;
      default:
        return <Hand size={16} />;
    }
  };

  const getDeviceLabel = () => {
    switch (activity.device) {
      case "laptop":
        return "Laptop / PC";
      case "hp":
        return "Cukup HP";
      default:
        return "Tanpa Alat";
    }
  };

  return (
    <article
      aria-label={`Aktivitas: ${activity.title}`}
      className="w-full bg-surface border border-border rounded-lg shadow-e2 p-6 sm:p-8 transition-all relative overflow-hidden"
    >
      {/* Top Meta Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {displayCategories.map((catId) => {
            const meta = CATEGORIES.find((c) => c.id === catId);
            if (!meta) return null;
            return (
              <span
                key={catId}
                className="px-3 py-1 rounded-pill text-xs font-bold text-white tracking-wide"
                style={{ backgroundColor: meta.color }}
              >
                {meta.label}
              </span>
            );
          })}
          <span className="px-3 py-1 rounded-pill text-xs font-bold bg-success text-white tracking-wide">
            Gratis ✓
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSave(activity)}
            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan aktivitas ini"}
            className={isSaved ? "text-primary" : "text-text-muted"}
          >
            <Bookmark
              size={20}
              className={isSaved ? "fill-primary" : ""}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onShare(activity)}
            aria-label="Bagikan aktivitas"
            className="text-text-muted"
          >
            <Share2 size={20} />
          </Button>
        </div>
      </div>

      {/* Main Title & Description */}
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-text leading-tight mb-3">
        {activity.title}
      </h3>
      <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-6">
        {activity.description}
      </p>

      {/* Structured Meta Tags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
          <Clock size={16} className="text-primary shrink-0" />
          <span>{activity.duration_min} Menit</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
          <MapPin size={16} className="text-primary shrink-0" />
          <span>{activity.place === "indoor" ? "Dalam Ruang" : "Luar Ruang"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
          <Users size={16} className="text-primary shrink-0" />
          <span>{activity.social === "solo" ? "Sendiri (Solo)" : "Bareng Orang"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
          <span className="text-primary shrink-0">{getDeviceIcon()}</span>
          <span>{getDeviceLabel()}</span>
        </div>
      </div>

      {/* Sequential Action Steps */}
      <div className="mb-8">
        <h4 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
          Langkah Memulai:
        </h4>
        <ol className="space-y-2.5">
          {activity.steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm sm:text-base text-text"
            >
              <span className="w-6 h-6 rounded-full bg-surface-2 border border-border text-text font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Verification Note */}
      <div className="p-3.5 bg-surface-2 rounded-md border border-border text-xs text-text-muted mb-8">
        <strong>Verifikasi Bebas Biaya:</strong> {activity.free_check.notes}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          variant={isCommitted ? "primary" : "primary"}
          size="lg"
          onClick={() => setIsCommitted(!isCommitted)}
          className="flex-1"
        >
          {isCommitted ? (
            <>
              <CheckCircle2 size={20} className="text-white" />
              <span>Gas Dikerjakan!</span>
            </>
          ) : (
            <span>Gas, ini aja!</span>
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            setIsCommitted(false);
            onReroll();
          }}
          className="sm:w-auto"
        >
          <RotateCw size={18} />
          <span>Acak Lagi</span>
        </Button>
      </div>
    </article>
  );
}
