"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Activity, Rarity, CompletedMissionEntry } from "@/types/activity";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const ALL_BADGES: Badge[] = [
  {
    id: "first_capsule",
    name: "Kapsul Pertama",
    description: "Memutar mesin gacha dan membuka kapsul untuk pertama kalinya.",
    icon: "Package",
  },
  {
    id: "first_mission",
    name: "Misi Tuntas",
    description: "Menyelesaikan dan mengklaim hadiah misi pertamamu.",
    icon: "CheckCircle",
  },
  {
    id: "streak_3",
    name: "Mulai Kebiasaan",
    description: "Menjaga streak aktivitas selama 3 hari beruntun.",
    icon: "Flame",
  },
  {
    id: "streak_7",
    name: "Pejuang Tangguh",
    description: "Menjaga streak aktivitas selama 7 hari berturut-turut.",
    icon: "Zap",
  },
  {
    id: "mystery_lover",
    name: "Si Penasaran",
    description: "Menggunakan Koin Acak Total sebanyak 10 kali.",
    icon: "Shuffle",
  },
  {
    id: "legendary_hunter",
    name: "Hoki Emas",
    description: "Mendapatkan kapsul berkategori Legendary!",
    icon: "Crown",
  },
  {
    id: "all_categories",
    name: "Eksplorer Sejati",
    description: "Mendapatkan kapsul dari seluruh 9 kategori aktivitas.",
    icon: "Compass",
  },
  {
    id: "tech_geek",
    name: "Kolektor Tech",
    description: "Mengoleksi minimal 5 aktivitas Tech & Ngoprek.",
    icon: "Cpu",
  },
  {
    id: "collector_master",
    name: "Master Kapsulpedia",
    description: "Mengoleksi minimal 25 kartu misi di album Kapsulpedia.",
    icon: "BookOpen",
  },
  {
    id: "arcade_master",
    name: "Jagoan Dingdong",
    description: "Memainkan seluruh game di Mini Arcade.",
    icon: "Gamepad2",
  },
];

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function calculateLevel(xp: number): LevelInfo {
  // Level threshold curve: Lvl 1: 0-100, Lvl 2: 100-250, Lvl 3: 250-450, etc.
  let lvl = 1;
  let requiredForCurrent = 0;
  let step = 100;

  while (xp >= requiredForCurrent + step) {
    requiredForCurrent += step;
    lvl += 1;
    step += 50; // each level requires +50 more XP
  }

  const currentLevelXp = xp - requiredForCurrent;
  const nextLevelXp = step;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / nextLevelXp) * 100));

  return {
    level: lvl,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
  };
}

interface GameState {
  playerName: string;
  xp: number;
  coins: number;
  streak: {
    count: number;
    lastActiveDate: string | null;
  };
  completedMissions: CompletedMissionEntry[];
  collectedMissions: string[];
  savedMissions: string[];
  unlockedBadges: string[];
  dailySpinClaimedDate: string | null;
  soundMuted: boolean;
  stats: {
    totalSpins: number;
    mysterySpins: number;
    rarityCounts: Record<Rarity, number>;
    categorySpins: Record<string, number>;
  };
  arcadeHighScores: {
    reactionTap: number;
    memoryMatch: number;
    mathSprint: number;
  };
  // Pending notifications / toasts
  newBadgeUnlocked: Badge | null;
  leveledUpEvent: number | null;

  // Actions
  setPlayerName: (name: string) => void;
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  completeMission: (activity: Activity, isMysteryBonus?: boolean) => {
    xpGained: number;
    coinsGained: number;
    leveledUp: boolean;
  };
  recordCollectedMission: (activity: Activity) => { isNew: boolean };
  toggleSaveMission: (activityId: string) => boolean;
  claimDailySpin: () => boolean;
  canClaimDailySpin: () => boolean;
  recordSpin: (isMystery: boolean, category: string, rarity: Rarity) => void;
  unlockBadge: (badgeId: string) => void;
  clearNewBadge: () => void;
  clearLevelUpEvent: () => void;
  setSoundMuted: (muted: boolean) => void;
  updateArcadeScore: (game: "reactionTap" | "memoryMatch" | "mathSprint", score: number) => boolean;
  checkAndUpdateStreak: () => void;
  resetAllData: () => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: "",
      xp: 0,
      coins: 20, // Free starting coins for spins
      streak: {
        count: 0,
        lastActiveDate: null,
      },
      completedMissions: [],
      collectedMissions: [],
      savedMissions: [],
      unlockedBadges: [],
      dailySpinClaimedDate: null,
      soundMuted: true,
      stats: {
        totalSpins: 0,
        mysterySpins: 0,
        rarityCounts: {
          common: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
        },
        categorySpins: {},
      },
      arcadeHighScores: {
        reactionTap: 0,
        memoryMatch: 0,
        mathSprint: 0,
      },
      newBadgeUnlocked: null,
      leveledUpEvent: null,

      addXp: (amount: number) => {
        const oldXp = get().xp;
        const newXp = oldXp + amount;
        const oldLevel = calculateLevel(oldXp).level;
        const newLevel = calculateLevel(newXp).level;
        const leveledUp = newLevel > oldLevel;

        set({
          xp: newXp,
          leveledUpEvent: leveledUp ? newLevel : null,
        });

        if (leveledUp) {
          get().addCoins(newLevel * 5); // Level up bonus coins
        }

        return { leveledUp, newLevel };
      },

      addCoins: (amount: number) => {
        set((state) => ({ coins: state.coins + amount }));
      },

      spendCoins: (amount: number) => {
        if (get().coins < amount) return false;
        set((state) => ({ coins: state.coins - amount }));
        return true;
      },

      completeMission: (activity: Activity, isMysteryBonus = false) => {
        const state = get();
        // Calculate XP and Coin reward based on rarity
        let baseXp = 10;
        let baseCoins = 5;

        switch (activity.rarity) {
          case "rare":
            baseXp = 25;
            baseCoins = 10;
            break;
          case "epic":
            baseXp = 50;
            baseCoins = 20;
            break;
          case "legendary":
            baseXp = 100;
            baseCoins = 40;
            break;
          default:
            baseXp = 10;
            baseCoins = 5;
            break;
        }

        // Mystery coin gives +20% XP bonus
        const finalXp = isMysteryBonus ? Math.round(baseXp * 1.2) : baseXp;
        const finalCoins = baseCoins;

        const newEntry: CompletedMissionEntry = {
          id: activity.id,
          title: activity.title,
          rarity: activity.rarity,
          completedAt: new Date().toISOString(),
          xpEarned: finalXp,
          coinsEarned: finalCoins,
        };

        const { leveledUp } = get().addXp(finalXp);
        get().addCoins(finalCoins);
        get().checkAndUpdateStreak();

        set((s) => ({
          completedMissions: [newEntry, ...s.completedMissions],
        }));

        // Check badges
        get().unlockBadge("first_mission");

        const updatedCount = get().completedMissions.length;
        if (updatedCount >= 5) {
          get().unlockBadge("all_rounder");
        }

        return {
          xpGained: finalXp,
          coinsGained: finalCoins,
          leveledUp,
        };
      },

      recordCollectedMission: (activity: Activity) => {
        const collected = get().collectedMissions || [];
        const isNew = !collected.includes(activity.id);

        if (isNew) {
          const updated = [...collected, activity.id];
          set({ collectedMissions: updated });

          // Unlock badges based on collection
          get().unlockBadge("first_capsule");
          if (activity.rarity === "legendary") {
            get().unlockBadge("legendary_hunter");
          }
          if (updated.length >= 25) {
            get().unlockBadge("collector_master");
          }

          // Check if collected 5 tech missions
          const techCount = updated.filter((id) => id.startsWith("tech-")).length;
          if (techCount >= 5) {
            get().unlockBadge("tech_geek");
          }

          // Check if all 9 categories have at least 1 collected mission
          const categoriesDiscovered = new Set(
            updated.map((id) => id.split("-")[0])
          );
          if (categoriesDiscovered.size >= 9) {
            get().unlockBadge("all_categories");
          }

          // Discovery bonus coins
          get().addCoins(5);
        }

        return { isNew };
      },

      toggleSaveMission: (activityId: string) => {
        const saved = get().savedMissions;
        const exists = saved.includes(activityId);
        if (exists) {
          set({ savedMissions: saved.filter((id) => id !== activityId) });
          return false;
        } else {
          set({ savedMissions: [activityId, ...saved] });
          return true;
        }
      },

      canClaimDailySpin: () => {
        const claimed = get().dailySpinClaimedDate;
        const today = getTodayString();
        return claimed !== today;
      },

      claimDailySpin: () => {
        if (!get().canClaimDailySpin()) return false;
        set({ dailySpinClaimedDate: getTodayString() });
        return true;
      },

      recordSpin: (isMystery: boolean, category: string, rarity: Rarity) => {
        const stats = { ...get().stats };
        stats.totalSpins += 1;
        if (isMystery) stats.mysterySpins += 1;
        stats.rarityCounts[rarity] = (stats.rarityCounts[rarity] || 0) + 1;
        stats.categorySpins[category] = (stats.categorySpins[category] || 0) + 1;

        set({ stats });

        // Trigger badges
        get().unlockBadge("first_capsule");
        if (rarity === "legendary") {
          get().unlockBadge("legendary_hunter");
        }
        if (stats.mysterySpins >= 10) {
          get().unlockBadge("mystery_lover");
        }
      },

      unlockBadge: (badgeId: string) => {
        const unlocked = get().unlockedBadges;
        if (unlocked.includes(badgeId)) return;

        const badge = ALL_BADGES.find((b) => b.id === badgeId);
        if (badge) {
          set({
            unlockedBadges: [...unlocked, badgeId],
            newBadgeUnlocked: badge,
          });
          get().addCoins(15); // Badge reward coins!
        }
      },

      setPlayerName: (name: string) => set({ playerName: name.trim().slice(0, 20) }),

      clearNewBadge: () => set({ newBadgeUnlocked: null }),
      clearLevelUpEvent: () => set({ leveledUpEvent: null }),

      setSoundMuted: (muted: boolean) => set({ soundMuted: muted }),

      updateArcadeScore: (game, score) => {
        const current = get().arcadeHighScores[game];
        if (score > current) {
          set((s) => ({
            arcadeHighScores: {
              ...s.arcadeHighScores,
              [game]: score,
            },
          }));
          get().addXp(20);
          get().addCoins(10);
          return true;
        }
        return false;
      },

      checkAndUpdateStreak: () => {
        const today = getTodayString();
        const streak = get().streak;

        if (streak.lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let newCount = 1;
        if (streak.lastActiveDate === yesterday) {
          newCount = streak.count + 1;
        }

        set({
          streak: {
            count: newCount,
            lastActiveDate: today,
          },
        });

        if (newCount >= 3) get().unlockBadge("streak_3");
        if (newCount >= 7) get().unlockBadge("streak_7");
      },

      resetAllData: () => {
        set({
          playerName: "",
          xp: 0,
          coins: 20,
          streak: { count: 0, lastActiveDate: null },
          completedMissions: [],
          collectedMissions: [],
          savedMissions: [],
          unlockedBadges: [],
          dailySpinClaimedDate: null,
          stats: {
            totalSpins: 0,
            mysterySpins: 0,
            rarityCounts: { common: 0, rare: 0, epic: 0, legendary: 0 },
            categorySpins: {},
          },
          arcadeHighScores: { reactionTap: 0, memoryMatch: 0, mathSprint: 0 },
          newBadgeUnlocked: null,
          leveledUpEvent: null,
        });
      },
    }),
    {
      name: "ngapain_yuk_arcade_save",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
