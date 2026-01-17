import React, { useMemo, useState } from "react";
import type { MatchFilters } from "../types";
import { useStore } from "../data/store";
import { applyFilters } from "../utils/filters";
import { calculateWinrate, formatDate } from "../utils/format";
import { aggregateByHero } from "../utils/analytics";
import MatchCard from "../components/MatchCard";
import type { PageKey } from "../components/Sidebar";

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { matches, settings, loading } = useStore();
  const [filters, setFilters] = useState<MatchFilters>({
    period: "all",
    result: "all",
    mode: "all",
    hero: "all",
  });

  const filtered = useMemo(() => applyFilters(matches, filters), [matches, filters]);

  const summary = useMemo(() => {
    const wins = filtered.filter((match) => match.result === "Win").length;
    return {
      total: filtered.length,
      wins,
      losses: filtered.length - wins,
      winrate: calculateWinrate(wins, filtered.length),
    };
  }, [filtered]);

  const heroStats = useMemo(() => aggregateByHero(filtered, "myHero"), [filtered]);
  const enemyStats = useMemo(() => aggregateByHero(filtered, "enemies"), [filtered]);

  const topHeroes = [...heroStats].sort((a, b) => b.winrate - a.winrate).slice(0, 5);
  const toughEnemies = [...enemyStats]
    .filter((entry) => entry.games >= 2)
    .sort((a, b) => a.winrate - b.winrate)
    .slice(0, 5);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Краткая сводка по матчам и последняя активность.</p>
        </div>
        <button className="primary" type="button" onClick={() => onNavigate("add")}>Добавить матч</button>
      </header>

      <div className="filters">
        <select
          value={filters.period}
          onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value as MatchFilters["period"] }))}
        >
          <option value="all">Весь период</option>
          <option value="7d">7 дней</option>
          <option value="30d">30 дней</option>
        </select>
        <select
          value={filters.result}
          onChange={(event) => setFilters((prev) => ({ ...prev, result: event.target.value as MatchFilters["result"] }))}
        >
          <option value="all">Все результаты</option>
          <option value="Win">Победы</option>
          <option value="Loss">Поражения</option>
        </select>
        <select
          value={filters.mode}
          onChange={(event) => setFilters((prev) => ({ ...prev, mode: event.target.value as MatchFilters["mode"] }))}
        >
          <option value="all">Все режимы</option>
          <option value="Ranked">Ranked</option>
          <option value="Unranked">Unranked</option>
          <option value="Turbo">Turbo</option>
          <option value="Custom">Custom</option>
        </select>
        <input
          type="text"
          placeholder="Герой"
          value={filters.hero === "all" ? "" : (filters.hero ?? "")}
          onChange={(event) => setFilters((prev) => ({ ...prev, hero: event.target.value || "all" }))}
        />
      </div>

      {loading ? (
        <div className="state">Загрузка статистики...</div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="summary-card">
              <h3>{summary.total}</h3>
              <p>Всего матчей</p>
            </div>
            <div className="summary-card win">
              <h3>{summary.wins}</h3>
              <p>Победы</p>
            </div>
            <div className="summary-card loss">
              <h3>{summary.losses}</h3>
              <p>Поражения</p>
            </div>
            <div className="summary-card">
              <h3>{summary.winrate}%</h3>
              <p>Winrate</p>
            </div>
          </div>

          <div className="grid two">
            <div className="panel">
              <h3>Топ-5 героев по винрейту</h3>
              {topHeroes.length === 0 ? (
                <p className="muted">Недостаточно данных.</p>
              ) : (
                <ul className="stat-list">
                  {topHeroes.map((hero) => (
                    <li key={hero.hero}>
                      <span>{hero.hero}</span>
                      <span>{hero.winrate}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="panel">
              <h3>Сложные враги</h3>
              {toughEnemies.length === 0 ? (
                <p className="muted">Недостаточно данных.</p>
              ) : (
                <ul className="stat-list">
                  {toughEnemies.map((hero) => (
                    <li key={hero.hero}>
                      <span>{hero.hero}</span>
                      <span>{hero.winrate}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="panel">
            <h3>Последние матчи</h3>
            {filtered.length === 0 ? (
              <p className="muted">Матчи не найдены.</p>
            ) : (
              <div className="match-list">
                {filtered.slice(0, 10).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    timeFormat={settings.timeFormat}
                    onOpen={() => onNavigate("matches")}
                  />
                ))}
              </div>
            )}
            {filtered.length > 0 && (
              <p className="muted">Последнее обновление: {formatDate(filtered[0].createdAt, settings.timeFormat)}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
