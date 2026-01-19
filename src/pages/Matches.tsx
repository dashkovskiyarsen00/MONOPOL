import React, { useMemo, useState } from "react";
import type { MatchRecord, MatchResult, MatchMode } from "../types";
import { useStore } from "../data/store";
import { applyFilters } from "../utils/filters";
import { formatDate } from "../utils/format";
import MatchCard from "../components/MatchCard";
import MatchDetailsModal from "../components/MatchDetailsModal";
import TagFilterBar from "../components/TagFilterBar";
import { getPopularTags } from "../utils/tags";
import { createMatchDraftFromMatch } from "../utils/matches";
import { saveDraft } from "../data/db";
import Modal from "../components/Modal";
import type { PageKey } from "../components/Sidebar";

const sortOptions = [
  { value: "date_desc", label: "Дата (сначала новые)" },
  { value: "date_asc", label: "Дата (сначала старые)" },
  { value: "duration_desc", label: "Длительность ↓" },
  { value: "duration_asc", label: "Длительность ↑" },
  { value: "hero", label: "Герой" },
  { value: "result", label: "Результат" },
];

interface MatchesProps {
  onNavigate: (page: PageKey) => void;
}

const Matches: React.FC<MatchesProps> = ({ onNavigate }) => {
  const { matches, settings, deleteMatch, updateMatch } = useStore();
  const [search, setSearch] = useState("");
  const [heroFilter, setHeroFilter] = useState("");
  const [modeFilter, setModeFilter] = useState<MatchMode | "">("");
  const [resultFilter, setResultFilter] = useState<MatchResult | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<MatchRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const popularTags = useMemo(() => getPopularTags(matches, 10), [matches]);

  const filtered = useMemo(() => {
    const list = applyFilters(matches, {
      period: dateFrom && dateTo ? "custom" : "all",
      from: dateFrom,
      to: dateTo,
      hero: heroFilter || "all",
      result: resultFilter || "all",
      mode: modeFilter || "all",
      search: search || undefined,
      tags: tagFilters,
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
  }, [matches, heroFilter, modeFilter, resultFilter, search, dateFrom, dateTo, sortBy, tagFilters]);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteMatch(selected.id);
    setConfirmDelete(false);
    setSelected(null);
  };

  const handleDuplicate = async (match: MatchRecord) => {
    const draft = createMatchDraftFromMatch(match);
    await saveDraft(draft);
    onNavigate("add");
  };

  const toggleTag = (tag: string) => {
    setTagFilters((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
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
      <div className="panel">
        <h3>Быстрый фильтр по тэгам</h3>
        <TagFilterBar
          tags={popularTags}
          selected={tagFilters}
          onToggle={toggleTag}
          label="Популярные"
        />
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
        <MatchDetailsModal
          match={selected}
          timeFormat={settings.timeFormat}
          onClose={() => setSelected(null)}
          onSave={updateMatch}
          onDelete={(match) => {
            setSelected(match);
            setConfirmDelete(true);
          }}
          onDuplicate={handleDuplicate}
          tagSuggestions={popularTags}
        />
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
