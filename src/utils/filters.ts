import type { MatchFilters, MatchRecord } from "../types";

export const applyFilters = (matches: MatchRecord[], filters: MatchFilters) => {
  let result = [...matches];
  if (filters.period !== "all") {
    const now = new Date();
    let fromDate: Date | null = null;
    if (filters.period === "7d") {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filters.period === "30d") {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (filters.period === "custom" && filters.from && filters.to) {
      fromDate = new Date(filters.from);
      const toDate = new Date(filters.to);
      result = result.filter((match) => {
        const played = new Date(match.playedAt);
        return played >= fromDate! && played <= toDate;
      });
      return result;
    }
    if (fromDate) {
      result = result.filter((match) => new Date(match.playedAt) >= fromDate!);
    }
  }
  if (filters.hero && filters.hero !== "all") {
    result = result.filter((match) => match.myHero === filters.hero);
  }
  if (filters.result && filters.result !== "all") {
    result = result.filter((match) => match.result === filters.result);
  }
  if (filters.mode && filters.mode !== "all") {
    result = result.filter((match) => match.mode === filters.mode);
  }
  if (filters.role && filters.role !== "all") {
    result = result.filter((match) => match.myRole === filters.role);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter((match) => {
      return (
        match.myHero.toLowerCase().includes(term) ||
        match.notes?.toLowerCase().includes(term) ||
        match.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        match.allies.some((hero) => hero.toLowerCase().includes(term)) ||
        match.enemies.some((hero) => hero.toLowerCase().includes(term))
      );
    });
  }
  return result;
};
