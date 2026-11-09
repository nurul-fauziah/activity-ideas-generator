"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Activity, CategoryId, Rarity } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import rawActivities from "@/data/activities.json";
import { useGameStore } from "@/store/use-game-store";
import { CardInspectModal } from "@/components/koleksi/card-inspect-modal";
import { Pip } from "@/components/mascot/pip";
import {
  BookOpen,
  ArrowLeft,
  Lock,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  Disc,
} from "lucide-react";

const allActivities = rawActivities as Activity[];

export default function KoleksiPage() {
  const collectedMissions = useGameStore((state) => state.collectedMissions || []);
  const completedMissions = useGameStore((state) => state.completedMissions || []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "collected" | "locked">("all");

  // Inspection Modal State
  const [inspectedActivity, setInspectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set of collected IDs (including any previously completed missions)
  const collectedSet = useMemo(() => {
    const set = new Set<string>(collectedMissions);
    completedMissions.forEach((m) => set.add(m.id));
    return set;
  }, [collectedMissions, completedMissions]);

  const completedSet = useMemo(() => {
    return new Set<string>(completedMissions.map((m) => m.id));
  }, [completedMissions]);

  // Overall Stats
  const totalCount = allActivities.length;
  const collectedCount = allActivities.filter((a) => collectedSet.has(a.id)).length;
  const progressPercent = Math.round((collectedCount / totalCount) * 100);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return allActivities.filter((act) => {
      // Category filter
      if (selectedCategory !== "all" && act.categories[0] !== selectedCategory) {
        return false;
      }
      // Rarity filter
      if (selectedRarity !== "all" && act.rarity !== selectedRarity) {
        return false;
      }
      // Status filter
      const isCollected = collectedSet.has(act.id);
      if (selectedStatus === "collected" && !isCollected) return false;
      if (selectedStatus === "locked" && isCollected) return false;

      return true;
    });
  }, [selectedCategory, selectedRarity, selectedStatus, collectedSet]);

  const handleShare = async (activity: Activity) => {
    const text = `Aktivitas gratis seru: "${activity.title}" (${activity.duration_min} menit). Cari inspirasi kegiatan gratis di NgapainYuk!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: activity.title,
          text,
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.origin}`);
        setToastMessage("Teks misi berhasil disalin ke clipboard!");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  const getRarityBadge = (rarity: Rarity) => {
    switch (rarity) {
      case "rare":
        return "bg-arcade-blue text-white";
      case "epic":
        return "bg-arcade-purple text-white";
      case "legendary":
        return "bg-arcade-yellow text-darkline";
      default:
        return "bg-slate-300 dark:bg-slate-700 text-text";
    }
  };

  return (
    <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 select-none">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-text-muted hover:text-text bg-surface border-2 border-darkline shadow-retro-sm px-3.5 py-2 rounded-xl transition-transform active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Ke Mesin Gacha</span>
        </Link>

        <div className="text-xs font-mono font-bold bg-surface-2 border border-darkline px-3 py-1.5 rounded-lg text-text">
          <span>{collectedCount} / {totalCount} Kapsul Terkumpul</span>
        </div>
      </div>

      {/* Header Banner with Mascot */}
      <section aria-labelledby="koleksi-heading" className="bg-surface border-3 border-darkline shadow-retro-lg rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-3 flex-1 text-center md:text-left">
          <h1
            id="koleksi-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-text tracking-tight leading-tight"
          >
            Koleksi Kartu Aktivitasmu
          </h1>

          <p className="text-text-muted text-xs sm:text-sm max-w-xl leading-relaxed">
            Semua kartu misi yang kamu dapatkan dari mesin gacha tersimpan di sini. Kumpulkan seluruh 90 kartu dari 9 kategori!
          </p>

          {/* Album Completion Progress Bar */}
          <div className="space-y-1.5 max-w-md pt-1">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold text-text">
              <span>Kelengkapan Album</span>
              <span className="text-arcade-purple dark:text-arcade-yellow">{progressPercent}%</span>
            </div>
            <div className="w-full h-3.5 bg-surface-2 border-2 border-darkline rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-arcade-mint border-r border-darkline rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mascot Pip */}
        <div className="shrink-0 flex items-center justify-center">
          <Pip
            expression={progressPercent > 50 ? "happy" : "excited"}
            speechText={
              progressPercent === 0
                ? "Albummu masih kosong nih. Yuk putar mesin gacha dulu!"
                : `Keren! Kamu udah buka ${collectedCount} kartu misi!`
            }
            size="md"
          />
        </div>
      </section>

      {/* Filter Section */}
      <section aria-label="Filter Kapsulpedia" className="bg-surface border-2 border-darkline shadow-retro-sm rounded-xl p-4 sm:p-5 space-y-4">
        {/* Category Filters */}
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
            Kategori Aktivitas
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg border-2 border-darkline text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-arcade-yellow text-darkline shadow-retro-sm"
                  : "bg-surface text-text hover:bg-surface-2"
              }`}
            >
              Semua ({totalCount})
            </button>
            {CATEGORIES.map((cat) => {
              const catActivities = allActivities.filter((a) => a.categories[0] === cat.id);
              const catCollected = catActivities.filter((a) => collectedSet.has(a.id)).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-darkline text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-arcade-purple text-white shadow-retro-sm"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {cat.label} ({catCollected}/10)
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter: Status & Rarity */}
        <div className="pt-3 border-t border-darkline/30 flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-text-muted">
              Status:
            </span>
            <div className="flex gap-1.5">
              {[
                { label: "Semua", value: "all" },
                { label: "Terbuka", value: "collected" },
                { label: "Terkunci", value: "locked" },
              ].map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setSelectedStatus(st.value as "all" | "collected" | "locked")}
                  className={`px-2.5 py-1 rounded-md border border-darkline text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedStatus === st.value
                      ? "bg-arcade-mint text-darkline shadow-xs font-black"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-text-muted">
              Rarity:
            </span>
            <div className="flex gap-1.5">
              {[
                { label: "Semua", value: "all" },
                { label: "Common", value: "common" },
                { label: "Rare", value: "rare" },
                { label: "Epic", value: "epic" },
                { label: "Legendary", value: "legendary" },
              ].map((rt) => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => setSelectedRarity(rt.value as Rarity | "all")}
                  className={`px-2.5 py-1 rounded-md border border-darkline text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedRarity === rt.value
                      ? "bg-arcade-blue text-white shadow-xs font-black"
                      : "bg-surface text-text hover:bg-surface-2"
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cards Album Grid */}
      <section aria-label="Daftar Kartu Kapsulpedia">
        {filteredActivities.length === 0 ? (
          <div className="bg-surface border-2 border-darkline rounded-xl p-8 text-center space-y-3">
            <p className="font-display font-bold text-base text-text">
              Tidak ada kartu dengan filter yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedRarity("all");
                setSelectedStatus("all");
              }}
              className="text-xs font-mono font-bold text-arcade-purple dark:text-arcade-yellow underline cursor-pointer"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredActivities.map((activity) => {
              const isCollected = collectedSet.has(activity.id);
              const isCompleted = completedSet.has(activity.id);
              const category =
                CATEGORIES.find((c) => c.id === activity.categories[0]) || CATEGORIES[0];
              const serial = `#${activity.id.replace(/^[a-z]+-/, "")}`;

              if (isCollected) {
                // Discovered Card View
                return (
                  <div
                    key={activity.id}
                    className={`bg-surface border-3 border-darkline shadow-retro rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-retro-lg ${
                      activity.rarity === "legendary"
                        ? "ring-2 ring-arcade-yellow bg-gradient-to-b from-arcade-yellow/10 to-transparent"
                        : activity.rarity === "epic"
                        ? "ring-2 ring-arcade-purple bg-gradient-to-b from-arcade-purple/10 to-transparent"
                        : ""
                    }`}
                  >
                    <div>
                      {/* Top Meta Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-[11px] bg-darkline text-white px-2 py-0.5 rounded-md">
                            {serial}
                          </span>
                          <span
                            className={`font-mono font-black text-[10px] px-2 py-0.5 rounded-md border border-darkline uppercase ${getRarityBadge(
                              activity.rarity
                            )}`}
                          >
                            {activity.rarity}
                          </span>
                        </div>

                        {isCompleted ? (
                          <span className="flex items-center gap-1 font-mono font-extrabold text-[10px] text-arcade-mint bg-arcade-mint/20 border border-arcade-mint px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={12} />
                            <span>Selesai</span>
                          </span>
                        ) : null}
                      </div>

                      {/* Card Title */}
                      <h3 className="font-display font-black text-base sm:text-lg text-text leading-snug mb-1.5">
                        {activity.title}
                      </h3>

                      <p className="text-text-muted text-xs line-clamp-2 leading-relaxed mb-4">
                        {activity.description}
                      </p>
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="pt-3 border-t border-darkline/40 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{activity.duration_min} menit</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-arcade-mint">+{activity.xp} XP</span>
                          <span className="text-arcade-yellow text-darkline dark:text-arcade-yellow">
                            +{activity.coins} Koin
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setInspectedActivity(activity);
                          setIsModalOpen(true);
                        }}
                        className="w-full h-9 rounded-lg bg-surface border-2 border-darkline text-text hover:bg-surface-2 font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Eye size={14} />
                        <span>Buka Detail Misi</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // Locked Silhouette View
              return (
                <div
                  key={activity.id}
                  className="bg-surface-2/60 border-2 border-dashed border-darkline/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between opacity-80"
                >
                  <div>
                    {/* Locked Meta Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] bg-darkline/40 text-white/80 px-2 py-0.5 rounded-md">
                          {serial}
                        </span>
                        <span className="font-mono font-bold text-[10px] bg-slate-300 dark:bg-slate-700 text-text-muted px-2 py-0.5 rounded-md uppercase">
                          {activity.rarity}
                        </span>
                      </div>
                      <Lock size={14} className="text-text-muted" />
                    </div>

                    {/* Mystery Card Silhouette Content */}
                    <div className="py-4 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-darkline/20 border border-darkline/40 mx-auto flex items-center justify-center text-text-muted font-display font-black text-xl">
                        ?
                      </div>
                      <h3 className="font-display font-black text-sm text-text-muted">
                        Kapsul Belum Terbuka
                      </h3>
                      <p className="text-[11px] font-mono text-text-muted">
                        Kategori: {category.label}
                      </p>
                    </div>
                  </div>

                  {/* Locked Hint Footer */}
                  <div className="pt-3 border-t border-darkline/20 text-center">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-arcade-purple dark:text-arcade-yellow hover:underline"
                    >
                      <Disc size={12} />
                      <span>Putar di Mesin Gacha</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Card Inspector Modal */}
      <CardInspectModal
        activity={inspectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInspectedActivity(null);
        }}
        onShare={handleShare}
      />

      {/* Simple Toast */}
      {toastMessage ? (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-darkline text-white font-mono font-bold text-xs px-4 py-2 rounded-xl shadow-retro-sm animate-in fade-in">
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}
