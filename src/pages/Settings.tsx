import React, { useRef, useState } from "react";
import { useStore } from "../data/store";
import type { MatchRecord, SettingsState } from "../types";

const SCHEMA_VERSION = 1;

interface ExportPayload {
  schemaVersion: number;
  exportedAt: string;
  matches: MatchRecord[];
}

const Settings: React.FC = () => {
  const { matches, settings, updateSettings, importMatches, resetMatches } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importPreview, setImportPreview] = useState<number | null>(null);
  const [pendingImport, setPendingImport] = useState<MatchRecord[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const exportData = () => {
    const payload: ExportPayload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      matches,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dota2-matches-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const validateMatches = (data: unknown): MatchRecord[] => {
    const rawMatches = Array.isArray(data) ? data : (data as ExportPayload)?.matches;
    if (!Array.isArray(rawMatches)) throw new Error("Файл должен содержать массив матчей или объект экспорта.");
    const valid: MatchRecord[] = [];
    rawMatches.forEach((item) => {
      if (
        typeof item.id === "string" &&
        typeof item.createdAt === "string" &&
        typeof item.playedAt === "string" &&
        typeof item.mode === "string" &&
        typeof item.myHero === "string" &&
        typeof item.result === "string" &&
        Array.isArray(item.allies) &&
        Array.isArray(item.enemies) &&
        Array.isArray(item.tags)
      ) {
        valid.push(item as MatchRecord);
      }
    });
    return valid;
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = validateMatches(parsed);
      const existingIds = new Set(matches.map((match) => match.id));
      const deduped = incoming.filter((match) => !existingIds.has(match.id));
      setImportPreview(deduped.length);
      setPendingImport(deduped);
      setImportError(null);
    } catch (error) {
      setImportError((error as Error).message);
      setImportPreview(null);
      setPendingImport(null);
    }
  };

  const updateSetting = (patch: Partial<SettingsState>) => {
    updateSettings({ ...settings, ...patch });
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Settings & Data</h2>
          <p>Экспорт, импорт и управление локальными данными.</p>
        </div>
      </header>

      <div className="grid two">
        <div className="panel">
          <h3>Настройки</h3>
          <div className="field">
            <label>Формат времени</label>
            <select value={settings.timeFormat} onChange={(event) => updateSetting({ timeFormat: event.target.value as SettingsState["timeFormat"] })}>
              <option value="24h">24 часа</option>
              <option value="12h">12 часов</option>
            </select>
          </div>
          <div className="field">
            <label>Автосохранение черновика</label>
            <div className="segmented">
              <button
                type="button"
                className={settings.autoSaveDraft ? "active" : ""}
                onClick={() => updateSetting({ autoSaveDraft: true })}
              >
                Включено
              </button>
              <button
                type="button"
                className={!settings.autoSaveDraft ? "active" : ""}
                onClick={() => updateSetting({ autoSaveDraft: false })}
              >
                Выключено
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Данные</h3>
          <button type="button" className="secondary" onClick={exportData}>
            Export JSON
          </button>
          <div className="field">
            <label>Import JSON</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleImport(file);
              }}
            />
          </div>
          {importPreview !== null && <p className="muted">Будет добавлено матчей: {importPreview}</p>}
          {pendingImport && pendingImport.length > 0 && (
            <button
              type="button"
              className="primary"
              onClick={async () => {
                await importMatches([...matches, ...pendingImport]);
                setPendingImport(null);
                setImportPreview(null);
              }}
            >
              Импортировать {pendingImport.length} матч(ей)
            </button>
          )}
          {importError && <p className="error">Ошибка: {importError}</p>}
          <button type="button" className="danger" onClick={() => setConfirmReset(true)}>
            Reset all data
          </button>
        </div>
      </div>

      {confirmReset && (
        <div className="panel">
          <p>Подтвердите удаление всех матчей. Это действие нельзя отменить.</p>
          <div className="actions">
            <button type="button" className="secondary" onClick={() => setConfirmReset(false)}>
              Отмена
            </button>
            <button
              type="button"
              className="danger"
              onClick={async () => {
                await resetMatches();
                setConfirmReset(false);
              }}
            >
              Удалить все
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings;
