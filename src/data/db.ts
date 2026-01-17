import { openDB } from "idb";
import type { MatchRecord, SettingsState } from "../types";

const DB_NAME = "dota2-match-tracker";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("matches")) {
      const store = db.createObjectStore("matches", { keyPath: "id" });
      store.createIndex("playedAt", "playedAt");
      store.createIndex("myHero", "myHero");
      store.createIndex("result", "result");
      store.createIndex("mode", "mode");
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { keyPath: "key" });
    }
    if (!db.objectStoreNames.contains("drafts")) {
      db.createObjectStore("drafts", { keyPath: "key" });
    }
  },
});

export async function getMatches(): Promise<MatchRecord[]> {
  const db = await dbPromise;
  const matches = await db.getAll("matches");
  return matches.sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

export async function saveMatch(match: MatchRecord): Promise<void> {
  const db = await dbPromise;
  await db.put("matches", match);
}

export async function deleteMatch(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete("matches", id);
}

export async function bulkSaveMatches(matches: MatchRecord[]): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction("matches", "readwrite");
  for (const match of matches) {
    await tx.store.put(match);
  }
  await tx.done;
}

export async function clearMatches(): Promise<void> {
  const db = await dbPromise;
  await db.clear("matches");
}

const SETTINGS_KEY = "settings";
const DRAFT_KEY = "add-match";

export const defaultSettings: SettingsState = {
  timeFormat: "24h",
  autoSaveDraft: true,
};

export async function getSettings(): Promise<SettingsState> {
  const db = await dbPromise;
  const stored = await db.get("settings", SETTINGS_KEY);
  return stored?.value ?? defaultSettings;
}

export async function saveSettings(settings: SettingsState): Promise<void> {
  const db = await dbPromise;
  await db.put("settings", { key: SETTINGS_KEY, value: settings });
}

export async function getDraft(): Promise<MatchRecord | null> {
  const db = await dbPromise;
  const stored = await db.get("drafts", DRAFT_KEY);
  return stored?.value ?? null;
}

export async function saveDraft(draft: MatchRecord | null): Promise<void> {
  const db = await dbPromise;
  if (!draft) {
    await db.delete("drafts", DRAFT_KEY);
    return;
  }
  await db.put("drafts", { key: DRAFT_KEY, value: draft });
}
