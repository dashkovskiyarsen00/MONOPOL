import type { MatchRecord } from "../types";
import { calculateWinrate } from "./format";

export interface SessionSummary {
  id: string;
  matches: MatchRecord[];
  start: string;
  end: string;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  topHero: string | null;
}

export const groupIntoSessions = (matches: MatchRecord[], maxGapMinutes = 90): SessionSummary[] => {
  if (matches.length === 0) return [];
  const sorted = [...matches].sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  const sessions: SessionSummary[] = [];
  let current: MatchRecord[] = [];
  let lastTime = new Date(sorted[0].playedAt).getTime();

  const finalize = (sessionMatches: MatchRecord[]) => {
    if (sessionMatches.length === 0) return;
    const wins = sessionMatches.filter((match) => match.result === "Win").length;
    const games = sessionMatches.length;
    const heroCount = new Map<string, number>();
    sessionMatches.forEach((match) => {
      heroCount.set(match.myHero, (heroCount.get(match.myHero) ?? 0) + 1);
    });
    const topHero = Array.from(heroCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const start = sessionMatches[sessionMatches.length - 1].playedAt;
    const end = sessionMatches[0].playedAt;
    sessions.push({
      id: `${start}-${end}`,
      matches: sessionMatches,
      start,
      end,
      games,
      wins,
      losses: games - wins,
      winrate: calculateWinrate(wins, games),
      topHero,
    });
  };

  sorted.forEach((match) => {
    const matchTime = new Date(match.playedAt).getTime();
    const gapMinutes = Math.abs(lastTime - matchTime) / (1000 * 60);
    if (current.length === 0 || gapMinutes <= maxGapMinutes) {
      current.push(match);
    } else {
      finalize(current);
      current = [match];
    }
    lastTime = matchTime;
  });

  finalize(current);
  return sessions;
};
