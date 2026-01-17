import type { MatchRecord, MatchResult } from "../types";

export const formatResult = (result: MatchResult) => (result === "Win" ? "Победа" : "Поражение");

export const formatDate = (iso: string, timeFormat: "24h" | "12h") => {
  const date = new Date(iso);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: timeFormat === "12h",
  };
  return new Intl.DateTimeFormat("ru-RU", options).format(date);
};

export const toLocalInputValue = (iso: string) => {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().slice(0, 16);
};

export const fromLocalInputValue = (value: string) => {
  const date = new Date(value);
  return date.toISOString();
};

export const calculateWinrate = (wins: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((wins / total) * 1000) / 10;
};

export const summarizeResult = (matches: MatchRecord[]) => {
  const wins = matches.filter((match) => match.result === "Win").length;
  const losses = matches.length - wins;
  return { wins, losses, winrate: calculateWinrate(wins, matches.length) };
};

export const unique = (values: string[]) => Array.from(new Set(values)).filter(Boolean);
