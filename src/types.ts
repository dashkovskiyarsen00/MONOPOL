export type MatchMode = "Ranked" | "Unranked" | "Turbo" | "Custom";
export type MatchResult = "Win" | "Loss";
export type MatchRole = "Carry" | "Mid" | "Offlane" | "Support" | "Hard Support";

export interface MatchRecord {
  id: string;
  createdAt: string;
  playedAt: string;
  mode: MatchMode;
  myHero: string;
  myRole?: MatchRole;
  result: MatchResult;
  durationMin?: number;
  mmr?: number | string;
  allies: string[];
  enemies: string[];
  laneOpp?: string;
  notes?: string;
  tags: string[];
  patch?: string;
}

export interface SettingsState {
  timeFormat: "24h" | "12h";
  autoSaveDraft: boolean;
}

export interface MatchFilters {
  period: "all" | "7d" | "30d" | "90d" | "custom";
  from?: string;
  to?: string;
  hero?: string;
  result?: MatchResult | "all";
  mode?: MatchMode | "all";
  role?: MatchRole | "all";
  search?: string;
  tags?: string[];
}
