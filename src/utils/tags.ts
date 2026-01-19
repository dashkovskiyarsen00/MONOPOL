import type { MatchRecord } from "../types";

export const getPopularTags = (matches: MatchRecord[], limit = 8): string[] => {
  const counter = new Map<string, number>();
  matches.forEach((match) => {
    match.tags.forEach((tag) => {
      const normalized = tag.trim();
      if (!normalized) return;
      counter.set(normalized, (counter.get(normalized) ?? 0) + 1);
    });
  });
  return Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
};
