import type { MatchMode, MatchRecord, MatchResult } from "../types";
import { applyFilters } from "./filters";
import { calculateWinrate } from "./format";

export interface CounterFilters {
  period: "all" | "7d" | "30d" | "90d" | "custom";
  from?: string;
  to?: string;
  mode?: MatchMode | "all";
}

export interface EnemyStat {
  hero: string;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  avgDuration?: number;
  recentResults: MatchResult[];
}

export interface HeadToHeadSummary {
  hero: string;
  enemy: string;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  avgDuration?: number;
  recentResults: MatchResult[];
  recentNotes: string[];
  matches: MatchRecord[];
}

export interface RiskSummary {
  score: number;
  level: "low" | "medium" | "high";
  winrate: number;
  totalGames: number;
  threats: Array<{ hero: string; winrate: number; games: number }>;
}

const getRecentResults = (matches: MatchRecord[], limit = 5) => {
  return matches
    .sort((a, b) => b.playedAt.localeCompare(a.playedAt))
    .slice(0, limit)
    .map((match) => match.result);
};

const filterForHero = (matches: MatchRecord[], myHero: string, filters: CounterFilters) => {
  return applyFilters(matches, {
    period: filters.period,
    from: filters.from,
    to: filters.to,
    mode: filters.mode ?? "all",
    hero: myHero,
    result: "all",
    role: "all",
  });
};

export const getEnemyStatsForMyHero = (matches: MatchRecord[], myHero: string, filters: CounterFilters): EnemyStat[] => {
  if (!myHero) return [];
  const filtered = filterForHero(matches, myHero, filters).sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  const stats = new Map<string, { hero: string; games: number; wins: number; losses: number; durationSum: number; durationCount: number; recentResults: MatchResult[] }>();

  filtered.forEach((match) => {
    match.enemies.forEach((enemy) => {
      if (!enemy) return;
      const entry = stats.get(enemy) ?? {
        hero: enemy,
        games: 0,
        wins: 0,
        losses: 0,
        durationSum: 0,
        durationCount: 0,
        recentResults: [],
      };
      entry.games += 1;
      if (match.result === "Win") entry.wins += 1;
      else entry.losses += 1;
      if (typeof match.durationMin === "number") {
        entry.durationSum += match.durationMin;
        entry.durationCount += 1;
      }
      if (entry.recentResults.length < 5) {
        entry.recentResults.push(match.result);
      }
      stats.set(enemy, entry);
    });
  });

  return Array.from(stats.values()).map((entry) => ({
    hero: entry.hero,
    games: entry.games,
    wins: entry.wins,
    losses: entry.losses,
    winrate: calculateWinrate(entry.wins, entry.games),
    avgDuration: entry.durationCount > 0 ? Math.round(entry.durationSum / entry.durationCount) : undefined,
    recentResults: entry.recentResults,
  }));
};

export const getHeadToHead = (
  matches: MatchRecord[],
  myHero: string,
  enemyHero: string,
  filters: CounterFilters,
): HeadToHeadSummary | null => {
  if (!myHero || !enemyHero) return null;
  const filtered = filterForHero(matches, myHero, filters).filter((match) => match.enemies.includes(enemyHero));
  if (filtered.length === 0) return null;
  const wins = filtered.filter((match) => match.result === "Win").length;
  const durationMatches = filtered.filter((match) => typeof match.durationMin === "number");
  const avgDuration =
    durationMatches.length > 0
      ? Math.round(
          durationMatches.reduce((sum, match) => sum + (match.durationMin ?? 0), 0) / durationMatches.length,
        )
      : undefined;
  const recentMatches = [...filtered].sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  return {
    hero: myHero,
    enemy: enemyHero,
    games: filtered.length,
    wins,
    losses: filtered.length - wins,
    winrate: calculateWinrate(wins, filtered.length),
    avgDuration,
    recentResults: getRecentResults(recentMatches, 5),
    recentNotes: recentMatches
      .filter((match) => match.notes)
      .slice(0, 3)
      .map((match) => match.notes as string),
    matches: recentMatches,
  };
};

export const computeRiskScore = (
  matches: MatchRecord[],
  myHero: string,
  enemies: string[],
  filters: CounterFilters,
  minGames = 1,
): RiskSummary => {
  const summaries = enemies
    .filter(Boolean)
    .map((enemy) => getHeadToHead(matches, myHero, enemy, filters))
    .filter((entry): entry is HeadToHeadSummary => Boolean(entry));

  const weighted = summaries
    .filter((entry) => entry.games >= minGames)
    .map((entry) => {
      const weight = Math.min(entry.games, 10);
      return {
        hero: entry.enemy,
        winrate: entry.winrate,
        games: entry.games,
        weight,
        risk: (100 - entry.winrate) * weight,
        winContribution: entry.winrate * weight,
      };
    });

  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  const riskScore = totalWeight === 0 ? 0 : Math.round(weighted.reduce((sum, entry) => sum + entry.risk, 0) / totalWeight);
  const winrate = totalWeight === 0 ? 0 : Math.round(weighted.reduce((sum, entry) => sum + entry.winContribution, 0) / totalWeight);

  const level: RiskSummary["level"] = riskScore >= 60 ? "high" : riskScore >= 45 ? "medium" : "low";

  return {
    score: riskScore,
    level,
    winrate,
    totalGames: summaries.reduce((sum, entry) => sum + entry.games, 0),
    threats: weighted
      .sort((a, b) => a.winrate - b.winrate || b.games - a.games)
      .slice(0, 3)
      .map((entry) => ({ hero: entry.hero, winrate: entry.winrate, games: entry.games })),
  };
};
