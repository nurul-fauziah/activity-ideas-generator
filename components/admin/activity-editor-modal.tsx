"use client";

import React, { useState, useEffect } from "react";
import { Activity, CategoryId, Rarity, SocialMode, PlaceMode, DeviceMode } from "@/types/activity";
import { CATEGORIES } from "@/data/categories";
import { MissionCard } from "@/components/gacha/mission-card";
import {
  X,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Edit3,
  Award,
  Coins,
  Clock,
  Wifi,
  Users,
  MapPin,
  Smartphone,
  Check,
} from "lucide-react";

interface ActivityEditorModalProps {
  isOpen: boolean;
  activityToEdit: Activity | null;
  existingIds: string[];
  onSave: (activity: Activity) => void;
  onClose: () => void;
}

export function ActivityEditorModal({
  isOpen,
  activityToEdit,
  existingIds,
  onSave,
  onClose,
}: ActivityEditorModalProps) {
  const isEditing = Boolean(activityToEdit);

  // Form State
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(["senang-senang"]);
  const [rarity, setRarity] = useState<Rarity>("common");
  const [xp, setXp] = useState<number>(25);
  const [coins, setCoins] = useState<number>(10);
  const [durationMin, setDurationMin] = useState<number>(15);
  const [social, setSocial] = useState<SocialMode>("solo");
  const [place, setPlace] = useState<PlaceMode>("indoor");
  const [device, setDevice] = useState<DeviceMode>("none");
  const [needsInternet, setNeedsInternet] = useState<boolean>(false);
  const [steps, setSteps] = useState<string[]>([""]);
  const [freeNotes, setFreeNotes] = useState<string>("Bebas biaya tanpa alat khusus");

  // View mode: 'form' or 'preview'
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Pre-fill form when modal opens
  useEffect(() => {
    if (activityToEdit) {
      setId(activityToEdit.id);
      setTitle(activityToEdit.title);
      setDescription(activityToEdit.description);
      setSelectedCategories(activityToEdit.categories || ["senang-senang"]);
      setRarity(activityToEdit.rarity || "common");
      setXp(activityToEdit.xp || 25);
      setCoins(activityToEdit.coins || 10);
      setDurationMin(activityToEdit.duration_min || 15);
      setSocial(activityToEdit.social || "solo");
      setPlace(activityToEdit.place || "indoor");
      setDevice(activityToEdit.device || "none");
      setNeedsInternet(Boolean(activityToEdit.needs_internet));
      setSteps(activityToEdit.steps && activityToEdit.steps.length > 0 ? activityToEdit.steps : [""]);
      setFreeNotes(activityToEdit.free_check?.notes || "Bebas biaya tanpa alat khusus");
    } else {
      // Auto-generate fresh ID
      const prefix = "misi";
      const randomNum = Math.floor(100 + Math.random() * 900);
      setId(`${prefix}-${randomNum}`);
      setTitle("");
      setDescription("");
      setSelectedCategories(["senang-senang"]);
      setRarity("common");
      setXp(25);
      setCoins(10);
      setDurationMin(15);
      setSocial("solo");
      setPlace("indoor");
      setDevice("none");
      setNeedsInternet(false);
      setSteps([""]);
      setFreeNotes("Bebas biaya tanpa alat khusus");
    }
    setActiveTab("form");
    setValidationError(null);
  }, [activityToEdit, isOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto set XP & Coins by rarity if user changes rarity
  const handleRarityChange = (newRarity: Rarity) => {
    setRarity(newRarity);
    if (!isEditing) {
      switch (newRarity) {
        case "legendary":
          setXp(100);
          setCoins(50);
          break;
        case "epic":
          setXp(50);
          setCoins(20);
          break;
        case "rare":
          setXp(35);
          setCoins(15);
          break;
        default:
          setXp(25);
          setCoins(10);
          break;
      }
    }
  };

  const handleToggleCategory = (catId: CategoryId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length === 1) {
      setSteps([""]);
      return;
    }
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const currentActivityPreview: Activity = {
    id: id.trim() || "preview-id",
    title: title.trim() || "Judul Aktivitas Misi",
    description: description.trim() || "Deskripsi aktivitas akan muncul di sini.",
    categories: selectedCategories,
    rarity,
    xp: Number(xp) || 25,
    coins: Number(coins) || 10,
    duration_min: Number(durationMin) || 15,
    social,
    place,
    device,
    needs_internet: needsInternet,
    steps: steps.filter((s) => s.trim().length > 0),
    free_check: {
      verified: true,
      notes: freeNotes.trim() || "100% Free",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanId = id.trim();
    if (!cleanId) {
      setValidationError("ID Misi wajib diisi (contoh: senang-005)");
      return;
    }

    if (!isEditing && existingIds.includes(cleanId)) {
      setValidationError(`ID '${cleanId}' sudah digunakan oleh misi lain. Gunakan ID unik.`);
      return;
    }

    if (!title.trim()) {
      setValidationError("Judul misi tidak boleh kosong.");
      return;
    }

    if (!description.trim()) {
      setValidationError("Deskripsi misi tidak boleh kosong.");
      return;
    }

    if (selectedCategories.length === 0) {
      setValidationError("Pilih minimal 1 kategori.");
      return;
    }

    const cleanSteps = steps.map((s) => s.trim()).filter((s) => s.length > 0);
    if (cleanSteps.length === 0) {
      setValidationError("Masukkan minimal 1 langkah petunjuk misi.");
      return;
    }

    const newActivity: Activity = {
      id: cleanId,
      title: title.trim(),
      description: description.trim(),
      categories: selectedCategories,
      rarity,
      xp: Number(xp) || 25,
      coins: Number(coins) || 10,
      duration_min: Number(durationMin) || 15,
      social,
      place,
      device,
      needs_internet: needsInternet,
      steps: cleanSteps,
      free_check: {
        verified: true,
        notes: freeNotes.trim() || "Bebas biaya tanpa alat khusus",
      },
    };

    onSave(newActivity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-surface border-2 border-darkline rounded-xl shadow-[8px_8px_0_var(--arcade-dark)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="border-b-2 border-darkline bg-surface-2 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-black text-lg text-text">
              {isEditing ? `Edit Misi: ${activityToEdit?.id}` : "Tambah Misi Baru"}
            </h2>
            <div className="flex rounded-md border border-darkline/40 p-0.5 bg-surface text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "form"
                    ? "bg-arcade-yellow text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Formulir</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "preview"
                    ? "bg-arcade-yellow text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {validationError && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold font-mono">
              ⚠️ {validationError}
            </div>
          )}

          {activeTab === "preview" ? (
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="max-w-md w-full">
                <MissionCard
                  activity={currentActivityPreview}
                  isSaved={false}
                  onReroll={() => {}}
                  onToggleSave={() => {}}
                  onShare={() => {}}
                  onClaimReward={() => {}}
                />
              </div>
              <p className="text-xs text-text-muted mt-4 text-center font-mono">
                Ini adalah tampilan kartu saat pemain membongkar kapsul gacha.
              </p>
            </div>
          ) : (
            <form id="activity-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: ID, Title, Rarity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ID */}
                <div>
                  <label className="block text-xs font-bold font-mono text-text mb-1">
                    ID Misi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    disabled={isEditing}
                    placeholder="contoh: senang-012"
                    className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow disabled:opacity-60"
                  />
                  <span className="text-[10px] text-text-muted mt-0.5 block">
                    Gunakan huruf kecil & strip (-).
                  </span>
                </div>

                {/* Rarity */}
                <div>
                  <label className="block text-xs font-bold font-mono text-text mb-1">
                    Tingkat Rarity <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rarity}
                    onChange={(e) => handleRarityChange(e.target.value as Rarity)}
                    className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow cursor-pointer"
                  >
                    <option value="common">Common (Standar)</option>
                    <option value="rare">Rare (Langka)</option>
                    <option value="epic">Epic (Sangat Langka)</option>
                    <option value="legendary">Legendary (Istimewa)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold font-mono text-text mb-1">
                    Estimasi Durasi (Menit) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold font-mono text-text mb-1">
                  Judul Misi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tantangan foto 5 benda berwarna merah di sekitarmu"
                  className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold font-mono text-text mb-1">
                  Deskripsi / Pengantar <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kenapa aktivitas ini seru dan apa yang bisa didapatkan..."
                  className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-arcade-yellow resize-none"
                />
              </div>

              {/* Categories Multi-Select */}
              <div>
                <label className="block text-xs font-bold font-mono text-text mb-1.5">
                  Kategori Misi (Bisa lebih dari satu) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleToggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-arcade-yellow text-white border-darkline shadow-[2px_2px_0_var(--arcade-dark)]"
                            : "bg-surface-2 text-text border-darkline/20 hover:border-darkline/60"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rewards: XP & Coins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-lg border border-darkline/25 bg-surface-2/40">
                <div>
                  <label className="block text-xs font-bold font-mono text-text mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-arcade-yellow" />
                    <span>Hadiah XP</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border-2 border-darkline bg-bg text-text text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono text-text mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-arcade-yellow" />
                    <span>Hadiah Koin</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={coins}
                    onChange={(e) => setCoins(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-md border-2 border-darkline bg-bg text-text text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                  />
                </div>
              </div>

              {/* Format & Attributes: Social, Place, Device, Internet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg border border-darkline/25 bg-surface-2/40">
                {/* Social */}
                <div>
                  <label className="block text-[11px] font-bold font-mono text-text-muted mb-1">
                    Mode Sosial
                  </label>
                  <select
                    value={social}
                    onChange={(e) => setSocial(e.target.value as SocialMode)}
                    className="w-full px-2 py-1.5 rounded border-2 border-darkline bg-bg text-text text-xs font-bold"
                  >
                    <option value="solo">Solo (Sendiri)</option>
                    <option value="bareng">Bareng Teman</option>
                    <option value="group">Group / Ramean</option>
                  </select>
                </div>

                {/* Place */}
                <div>
                  <label className="block text-[11px] font-bold font-mono text-text-muted mb-1">
                    Lokasi
                  </label>
                  <select
                    value={place}
                    onChange={(e) => setPlace(e.target.value as PlaceMode)}
                    className="w-full px-2 py-1.5 rounded border-2 border-darkline bg-bg text-text text-xs font-bold"
                  >
                    <option value="indoor">Indoor (Dalam Ruang)</option>
                    <option value="outdoor">Outdoor (Luar Ruang)</option>
                  </select>
                </div>

                {/* Device */}
                <div>
                  <label className="block text-[11px] font-bold font-mono text-text-muted mb-1">
                    Gawai / Alat
                  </label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value as DeviceMode)}
                    className="w-full px-2 py-1.5 rounded border-2 border-darkline bg-bg text-text text-xs font-bold"
                  >
                    <option value="none">Tanpa Alat</option>
                    <option value="phone">HP / Ponsel</option>
                    <option value="laptop">Laptop / PC</option>
                  </select>
                </div>

                {/* Needs Internet */}
                <div className="flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-1">
                    <input
                      type="checkbox"
                      checked={needsInternet}
                      onChange={(e) => setNeedsInternet(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-darkline text-arcade-yellow focus:ring-arcade-yellow cursor-pointer"
                    />
                    <span className="text-xs font-bold text-text">Perlu Internet</span>
                  </label>
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold font-mono text-text">
                    Langkah-Langkah Petunjuk <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-[11px] font-bold text-arcade-yellow hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Langkah</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-text-muted w-6 text-center shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleStepChange(idx, e.target.value)}
                        placeholder={`Langkah ke-${idx + 1}...`}
                        className="flex-1 px-3 py-1.5 rounded-md border-2 border-darkline bg-bg text-text text-xs focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        disabled={steps.length === 1 && idx === 0}
                        className="text-text-muted hover:text-red-500 p-1.5 rounded hover:bg-surface-2 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Verification Notes */}
              <div>
                <label className="block text-xs font-bold font-mono text-text mb-1">
                  Catatan Komitmen 100% Bebas Biaya (Free Check)
                </label>
                <input
                  type="text"
                  value={freeNotes}
                  onChange={(e) => setFreeNotes(e.target.value)}
                  placeholder="Contoh: Bisa menggunakan akun gratis YouTube atau kertas memo"
                  className="w-full px-3 py-2 rounded-md border-2 border-darkline bg-bg text-text text-xs focus:outline-none focus:ring-2 focus:ring-arcade-yellow"
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t-2 border-darkline bg-surface-2 px-5 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border-2 border-darkline bg-surface hover:bg-surface-2 text-xs font-bold text-text shadow-[2px_2px_0_var(--arcade-dark)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="activity-form"
            className="px-5 py-2 rounded-md border-2 border-darkline bg-arcade-yellow text-white text-xs font-black shadow-[2px_2px_0_var(--arcade-dark)] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isEditing ? "Simpan Perubahan Misi" : "Tambahkan ke Daftar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
