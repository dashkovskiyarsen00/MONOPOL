import { v4 as uuid } from "uuid";
import type { MatchRecord } from "../types";

export const createMatchDraftFromMatch = (match: MatchRecord): MatchRecord => {
  return {
    ...match,
    id: uuid(),
    createdAt: new Date().toISOString(),
    playedAt: new Date().toISOString(),
    durationMin: undefined,
    notes: "",
  };
};
