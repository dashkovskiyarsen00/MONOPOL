import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { MatchRecord, MatchResult, MatchRole, MatchMode } from "../types";
import { useStore } from "../data/store";
import { fromLocalInputValue, toLocalInputValue } from "../utils/format";
import { getDraft, saveDraft } from "../data/db";
import HeroSelect from "../components/HeroSelect";
import HeroMultiSelect from "../components/HeroMultiSelect";
import TagInput from "../components/TagInput";
import type { PageKey } from "../components/Sidebar";

interface AddMatchProps {
  onNavigate: (page: PageKey) => void;
}

const emptyMatch = (): MatchRecord => ({
  id: uuid(),
  createdAt: new Date().toISOString(),
  playedAt: new Date().toISOString(),
  mode: "Ranked",
  myHero: "",
  result: "Win",
  allies: [],
  enemies: [],
  tags: [],
});

const AddMatch: React.FC<AddMatchProps> = ({ onNavigate }) => {
  const { addMatch, settings } = useStore();
  const [match, setMatch] = useState<MatchRecord>(emptyMatch());
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      if (!settings.autoSaveDraft) return;
      const draft = await getDraft();
      if (draft) setMatch(draft);
    };
    loadDraft();
  }, [settings.autoSaveDraft]);

  useEffect(() => {
    if (!settings.autoSaveDraft) return;
    saveDraft(match).catch(() => undefined);
  }, [match, settings.autoSaveDraft]);

  const validate = () => {
    const nextErrors: string[] = [];
    if (!match.myHero) nextErrors.push("Выберите вашего героя.");
    if (!match.result) nextErrors.push("Укажите результат.");
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const save = async (resetAfter: boolean) => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...match, createdAt: new Date().toISOString() };
    await addMatch(payload);
    if (settings.autoSaveDraft) {
      await saveDraft(null);
    }
    if (resetAfter) {
      setMatch(emptyMatch());
    } else {
      onNavigate("matches");
    }
    setSaving(false);
  };

  const canSave = useMemo(() => match.myHero && match.result, [match.myHero, match.result]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Add Match</h2>
          <p>Заполните детали матча вручную.</p>
        </div>
      </header>

      <div className="panel form">
        {errors.length > 0 && (
          <div className="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid two">
          <div className="field">
            <label>Дата/время</label>
            <input
              type="datetime-local"
              value={toLocalInputValue(match.playedAt)}
              onChange={(event) => setMatch((prev) => ({ ...prev, playedAt: fromLocalInputValue(event.target.value) }))}
            />
          </div>
          <div className="field">
            <label>Режим</label>
            <select
              value={match.mode}
              onChange={(event) => setMatch((prev) => ({ ...prev, mode: event.target.value as MatchMode }))}
            >
              <option value="Ranked">Ranked</option>
              <option value="Unranked">Unranked</option>
              <option value="Turbo">Turbo</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="grid two">
          <HeroSelect
            label="Мой герой"
            value={match.myHero}
            onChange={(value) => setMatch((prev) => ({ ...prev, myHero: value }))}
            allowEmpty
          />
          <div className="field">
            <label>Моя роль</label>
            <select
              value={match.myRole ?? ""}
              onChange={(event) =>
                setMatch((prev) => ({
                  ...prev,
                  myRole: event.target.value ? (event.target.value as MatchRole) : undefined,
                }))
              }
            >
              <option value="">Не указано</option>
              <option value="Carry">Carry</option>
              <option value="Mid">Mid</option>
              <option value="Offlane">Offlane</option>
              <option value="Support">Support</option>
              <option value="Hard Support">Hard Support</option>
            </select>
          </div>
        </div>

        <div className="grid two">
          <div className="field">
            <label>Результат</label>
            <div className="segmented">
              {["Win", "Loss"].map((result) => (
                <button
                  key={result}
                  type="button"
                  className={match.result === result ? "active" : ""}
                  onClick={() => setMatch((prev) => ({ ...prev, result: result as MatchResult }))}
                >
                  {result}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Длительность (минуты)</label>
            <input
              type="number"
              min={0}
              value={match.durationMin ?? ""}
              onChange={(event) =>
                setMatch((prev) => ({
                  ...prev,
                  durationMin: event.target.value ? Number(event.target.value) : undefined,
                }))
              }
            />
          </div>
        </div>

        <div className="grid two">
          <div className="field">
            <label>MMR / ранг</label>
            <input
              type="text"
              value={match.mmr ?? ""}
              onChange={(event) => setMatch((prev) => ({ ...prev, mmr: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Лейнинг против</label>
            <input
              type="text"
              value={match.laneOpp ?? ""}
              onChange={(event) => setMatch((prev) => ({ ...prev, laneOpp: event.target.value }))}
              placeholder="Герой на линии"
            />
          </div>
        </div>

        <HeroMultiSelect
          label="Союзники"
          values={match.allies}
          onChange={(values) => setMatch((prev) => ({ ...prev, allies: values }))}
          limit={4}
        />

        <HeroMultiSelect
          label="Противники"
          values={match.enemies}
          onChange={(values) => setMatch((prev) => ({ ...prev, enemies: values }))}
          limit={5}
        />

        <TagInput
          label="Тэги"
          values={match.tags}
          onChange={(values) => setMatch((prev) => ({ ...prev, tags: values }))}
          placeholder="tilt, throw, good draft"
        />

        <div className="field">
          <label>Заметки</label>
          <textarea
            rows={4}
            value={match.notes ?? ""}
            onChange={(event) => setMatch((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </div>

        <div className="actions">
          <button type="button" className="primary" disabled={!canSave || saving} onClick={() => save(false)}>
            Save
          </button>
          <button type="button" className="secondary" disabled={!canSave || saving} onClick={() => save(true)}>
            Save & Add Another
          </button>
          <button type="button" className="ghost" onClick={() => onNavigate("dashboard")}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddMatch;
