export type CategoryId =
  | "senang-senang"
  | "self-improvement"
  | "tech"
  | "psikologi"
  | "matematika"
  | "game"
  | "kreatif"
  | "fisik"
  | "sosial";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export type SocialMode = "solo" | "group" | "bareng";
export type PlaceMode = "indoor" | "outdoor";
export type DeviceMode = "none" | "phone" | "laptop" | "tanpa-alat" | "hp";
export type DifficultyLevel = "easy" | "medium";

export interface FreeCheck {
  verified: boolean;
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  categories: CategoryId[];
  rarity: Rarity;
  xp: number;
  coins: number;
  duration_min: number;
  social: SocialMode;
  place: PlaceMode;
  device: DeviceMode;
  needs_internet: boolean;
  difficulty?: DifficultyLevel;
  steps: string[];
  free_check: FreeCheck;
}

export interface OptionalFilters {
  duration: "all" | "5" | "15" | "30" | "60+";
  social: "all" | "solo" | "group";
  place: "all" | PlaceMode;
  device: "all" | "none" | "phone" | "laptop";
}

export interface SavedActivityEntry {
  activity: Activity;
  savedAt: string;
}

export interface CompletedMissionEntry {
  id: string;
  title: string;
  rarity: Rarity;
  completedAt: string;
  xpEarned: number;
  coinsEarned: number;
}
