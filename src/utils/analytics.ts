import type { MatchRecord } from "../types";
import { calculateWinrate } from "./format";

export const aggregateByHero = (matches: MatchRecord[], field: "myHero" | "enemies" | "allies") => {
  const stats = new Map<string, { hero: string; games: number; wins: number; losses: number }>();
  matches.forEach((match) => {
    const heroes = field === "myHero" ? [match.myHero] : match[field];
    heroes.forEach((hero) => {
      if (!hero) return;
      const entry = stats.get(hero) ?? { hero, games: 0, wins: 0, losses: 0 };
      entry.games += 1;
      if (match.result === "Win") entry.wins += 1;
      else entry.losses += 1;
      stats.set(hero, entry);
    });
  });
  return Array.from(stats.values()).map((entry) => ({
    ...entry,
    winrate: calculateWinrate(entry.wins, entry.games),
  }));
};

export const buildSynergyMatrix = (matches: MatchRecord[], myHero: string) => {
  const filtered = matches.filter((match) => match.myHero === myHero);
  const allies = aggregateByHero(filtered, "allies");
  const enemies = aggregateByHero(filtered, "enemies");
  return { allies, enemies };
};

export const buildTrend = (matches: MatchRecord[], bucket: "week" | "month") => {
  const grouped = new Map<string, { label: string; wins: number; total: number }>();
  matches.forEach((match) => {
    const date = new Date(match.playedAt);
    let label = "";
    if (bucket === "week") {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      label = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    } else {
      label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }
    const entry = grouped.get(label) ?? { label, wins: 0, total: 0 };
    entry.total += 1;
    if (match.result === "Win") entry.wins += 1;
    grouped.set(label, entry);
  });
  return Array.from(grouped.values())
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((entry) => ({
      label: entry.label,
      winrate: calculateWinrate(entry.wins, entry.total),
    }));
};
