import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { MatchRecord, SettingsState } from "../types";
import {
  bulkSaveMatches,
  clearMatches,
  defaultSettings,
  getMatches,
  getSettings,
  saveMatch,
  saveSettings,
  deleteMatch as removeMatch,
} from "./db";

interface State {
  matches: MatchRecord[];
  settings: SettingsState;
  loading: boolean;
  error?: string;
}

type Action =
  | { type: "LOAD"; matches: MatchRecord[]; settings: SettingsState }
  | { type: "ADD"; match: MatchRecord }
  | { type: "UPDATE"; match: MatchRecord }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "SETTINGS"; settings: SettingsState }
  | { type: "ERROR"; error: string };

const initialState: State = {
  matches: [],
  settings: defaultSettings,
  loading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return { ...state, matches: action.matches, settings: action.settings, loading: false };
    case "ADD":
      return { ...state, matches: [action.match, ...state.matches] };
    case "UPDATE":
      return {
        ...state,
        matches: state.matches.map((match) => (match.id === action.match.id ? action.match : match)),
      };
    case "REMOVE":
      return { ...state, matches: state.matches.filter((match) => match.id !== action.id) };
    case "CLEAR":
      return { ...state, matches: [] };
    case "SETTINGS":
      return { ...state, settings: action.settings };
    case "ERROR":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

interface StoreContextValue extends State {
  addMatch: (match: MatchRecord) => Promise<void>;
  updateMatch: (match: MatchRecord) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  importMatches: (matches: MatchRecord[]) => Promise<void>;
  resetMatches: () => Promise<void>;
  updateSettings: (settings: SettingsState) => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const [matches, settings] = await Promise.all([getMatches(), getSettings()]);
        dispatch({ type: "LOAD", matches, settings });
      } catch (error) {
        dispatch({ type: "ERROR", error: (error as Error).message });
      }
    };
    load();
  }, []);

  const addMatch = async (match: MatchRecord) => {
    await saveMatch(match);
    dispatch({ type: "ADD", match });
  };

  const updateMatch = async (match: MatchRecord) => {
    await saveMatch(match);
    dispatch({ type: "UPDATE", match });
  };

  const deleteMatch = async (id: string) => {
    await removeMatch(id);
    dispatch({ type: "REMOVE", id });
  };

  const importMatches = async (matches: MatchRecord[]) => {
    await bulkSaveMatches(matches);
    dispatch({ type: "LOAD", matches: await getMatches(), settings: state.settings });
  };

  const resetMatches = async () => {
    await clearMatches();
    dispatch({ type: "CLEAR" });
  };

  const updateSettings = async (settings: SettingsState) => {
    await saveSettings(settings);
    dispatch({ type: "SETTINGS", settings });
  };

  const value = useMemo(
    () => ({
      ...state,
      addMatch,
      updateMatch,
      deleteMatch,
      importMatches,
      resetMatches,
      updateSettings,
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
