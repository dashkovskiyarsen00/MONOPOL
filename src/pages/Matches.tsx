import React, { useMemo, useState } from "react";
import type { MatchRecord, MatchResult, MatchMode, MatchRole } from "../types";
import { useStore } from "../data/store";
import { applyFilters } from "../utils/filters";
import { formatDate, toLocalInputValue, fromLocalInputValue } from "../utils/format";
import MatchCard from "../components/MatchCard";
import Modal from "../components/Modal";
import HeroMultiSelect from "../components/HeroMultiSelect";
import TagInput from "../components/TagInput";

const sortOptions = [
  { value: "date_desc", label: "Дата (сначала новые)" },
  { value: "date_asc", label: "Дата (сначала старые)" },
  { value: "duration_desc", label: "Длительность ↓" },
  { value: "duration_asc", label: "Длительность ↑" },
  { value: "hero", label: "Герой" },
  { value: "result", label: "Результат" },
];

const Matches: React.FC = () => {
  const { matches, settings, deleteMatch, updateMatch } = useStore();
  const [search, setSearch] = useState("");
  const [heroFilter, setHeroFilter] = useState("");
  const [modeFilter, setModeFilter] = useState<MatchMode | "">("");
  const [resultFilter, setResultFilter] = useState<MatchResult | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [selected, setSelected] = useState<MatchRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = useMemo(() => {
    const list = applyFilters(matches, {
      period: dateFrom && dateTo ? "custom" : "all",
      from: dateFrom,
      to: dateTo,
      hero: heroFilter || "all",
      result: resultFilter || "all",
      mode: modeFilter || "all",
      search: search || undefined,
    });
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return a.playedAt.localeCompare(b.playedAt);
        case "duration_desc":
          return (b.durationMin ?? 0) - (a.durationMin ?? 0);
        case "duration_asc":
          return (a.durationMin ?? 0) - (b.durationMin ?? 0);
        case "hero":
          return a.myHero.localeCompare(b.myHero);
        case "result":
          return a.result.localeCompare(b.result);
        default:
          return b.playedAt.localeCompare(a.playedAt);
      }
    });
    return sorted;
  }, [matches, heroFilter, modeFilter, resultFilter, search, dateFrom, dateTo, sortBy]);

  const updateSelected = (update: Partial<MatchRecord>) => {
    if (!selected) return;
    setSelected({ ...selected, ...update });
  };

  const saveSelected = async () => {
    if (!selected) return;
    if (!selected.myHero || !selected.result) return;
    await updateMatch(selected);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteMatch(selected.id);
    setConfirmDelete(false);
    setSelected(null);
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Matches</h2>
          <p>История матчей, быстрый поиск и управление.</p>
        </div>
      </header>

      <div className="panel filters">
        <input
          type="text"
          placeholder="Поиск по герою, тэгам или заметкам"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <input
          type="text"
          placeholder="Фильтр по герою"
          value={heroFilter}
          onChange={(event) => setHeroFilter(event.target.value)}
        />
        <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value as MatchMode | "")}>
          <option value="">Все режимы</option>
          <option value="Ranked">Ranked</option>
          <option value="Unranked">Unranked</option>
          <option value="Turbo">Turbo</option>
          <option value="Custom">Custom</option>
        </select>
        <select value={resultFilter} onChange={(event) => setResultFilter(event.target.value as MatchResult | "")}>
          <option value="">Все результаты</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
        </select>
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="state">Матчи не найдены.</div>
      ) : (
        <div className="match-list">
          {filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              timeFormat={settings.timeFormat}
              onOpen={() => setSelected(match)}
            />
          ))}
        </div>
      )}

      {selected && (
        <Modal
          title={`Матч: ${selected.myHero}`}
          onClose={() => setSelected(null)}
          actions={
            <>
              <button type="button" className="danger" onClick={() => setConfirmDelete(true)}>
                Удалить
              </button>
              <button type="button" className="primary" onClick={saveSelected}>
                Сохранить изменения
              </button>
            </>
          }
        >
          <div className="modal-grid">
            <div>
              <label>Дата/время</label>
              <input
                type="datetime-local"
                value={toLocalInputValue(selected.playedAt)}
                onChange={(event) => updateSelected({ playedAt: fromLocalInputValue(event.target.value) })}
              />
            </div>
            <div>
              <label>Герой</label>
              <input
                type="text"
                value={selected.myHero}
                onChange={(event) => updateSelected({ myHero: event.target.value })}
              />
            </div>
            <div>
              <label>Режим</label>
              <select
                value={selected.mode}
                onChange={(event) => updateSelected({ mode: event.target.value as MatchMode })}
              >
                <option value="Ranked">Ranked</option>
                <option value="Unranked">Unranked</option>
                <option value="Turbo">Turbo</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label>Результат</label>
              <select
                value={selected.result}
                onChange={(event) => updateSelected({ result: event.target.value as MatchResult })}
              >
                <option value="Win">Win</option>
                <option value="Loss">Loss</option>
              </select>
            </div>
            <div>
              <label>Длительность (мин)</label>
              <input
                type="number"
                value={selected.durationMin ?? ""}
                onChange={(event) =>
                  updateSelected({ durationMin: event.target.value ? Number(event.target.value) : undefined })
                }
              />
            </div>
            <div>
              <label>Роль</label>
              <select
                value={selected.myRole ?? ""}
                onChange={(event) =>
                  updateSelected({ myRole: event.target.value ? (event.target.value as MatchRole) : undefined })
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

          <HeroMultiSelect
            label="Союзники"
            values={selected.allies}
            onChange={(values) => updateSelected({ allies: values })}
            limit={4}
          />
          <HeroMultiSelect
            label="Противники"
            values={selected.enemies}
            onChange={(values) => updateSelected({ enemies: values })}
            limit={5}
          />
          <TagInput
            label="Тэги"
            values={selected.tags}
            onChange={(values) => updateSelected({ tags: values })}
          />
          <div className="field">
            <label>Заметки</label>
            <textarea
              rows={4}
              value={selected.notes ?? ""}
              onChange={(event) => updateSelected({ notes: event.target.value })}
            />
          </div>
          <p className="muted">Создано: {formatDate(selected.createdAt, settings.timeFormat)}</p>
        </Modal>
      )}

      {confirmDelete && selected && (
        <Modal
          title="Удалить матч?"
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <button type="button" className="secondary" onClick={() => setConfirmDelete(false)}>
                Отмена
              </button>
              <button type="button" className="danger" onClick={handleDelete}>
                Удалить
              </button>
            </>
          }
        >
          <p>
            Вы уверены, что хотите удалить матч {selected.myHero} от {formatDate(selected.playedAt, settings.timeFormat)}?
          </p>
        </Modal>
      )}
    </section>
  );
};

export default Matches;
