import React, { useMemo, useState } from "react";
import type { MatchFilters, MatchMode, MatchRole } from "../types";
import { useStore } from "../data/store";
import { applyFilters } from "../utils/filters";
import { aggregateByHero, buildSynergyMatrix, buildTrend } from "../utils/analytics";
import { calculateWinrate } from "../utils/format";

const Analytics: React.FC = () => {
  const { matches } = useStore();
  const [filters, setFilters] = useState<MatchFilters>({
    period: "all",
    result: "all",
    mode: "all",
    role: "all",
  });
  const [heroFocus, setHeroFocus] = useState("");
  const [trendBucket, setTrendBucket] = useState<"week" | "month">("week");

  const filtered = useMemo(() => applyFilters(matches, filters), [matches, filters]);

  const winrateByHero = useMemo(() => aggregateByHero(filtered, "myHero"), [filtered]);
  const opponents = useMemo(() => aggregateByHero(filtered, "enemies"), [filtered]);
  const allies = useMemo(() => aggregateByHero(filtered, "allies"), [filtered]);

  const synergy = useMemo(() => {
    if (!heroFocus) return null;
    return buildSynergyMatrix(filtered, heroFocus);
  }, [filtered, heroFocus]);

  const trend = useMemo(() => buildTrend(filtered, trendBucket), [filtered, trendBucket]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Analytics</h2>
          <p>Детальная аналитика по героям, союзникам и трендам.</p>
        </div>
      </header>

      <div className="panel filters">
        <select
          value={filters.period}
          onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value as MatchFilters["period"] }))}
        >
          <option value="all">Весь период</option>
          <option value="7d">7 дней</option>
          <option value="30d">30 дней</option>
        </select>
        <select
          value={filters.mode}
          onChange={(event) => setFilters((prev) => ({ ...prev, mode: event.target.value as MatchMode | "all" }))}
        >
          <option value="all">Все режимы</option>
          <option value="Ranked">Ranked</option>
          <option value="Unranked">Unranked</option>
          <option value="Turbo">Turbo</option>
          <option value="Custom">Custom</option>
        </select>
        <select
          value={filters.role}
          onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value as MatchRole | "all" }))}
        >
          <option value="all">Все роли</option>
          <option value="Carry">Carry</option>
          <option value="Mid">Mid</option>
          <option value="Offlane">Offlane</option>
          <option value="Support">Support</option>
          <option value="Hard Support">Hard Support</option>
        </select>
        <select value={trendBucket} onChange={(event) => setTrendBucket(event.target.value as "week" | "month")}>
          <option value="week">По неделям</option>
          <option value="month">По месяцам</option>
        </select>
      </div>

      <div className="grid two">
        <div className="panel">
          <h3>Winrate по моим героям</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Герой</th>
                <th>Матчи</th>
                <th>Победы</th>
                <th>Поражения</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {winrateByHero
                .sort((a, b) => b.winrate - a.winrate)
                .map((hero) => (
                  <tr key={hero.hero}>
                    <td>{hero.hero}</td>
                    <td>{hero.games}</td>
                    <td>{hero.wins}</td>
                    <td>{hero.losses}</td>
                    <td>{hero.winrate}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3>Difficult Opponents</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Враг</th>
                <th>Матчи</th>
                <th>Winrate</th>
              </tr>
            </thead>
            <tbody>
              {opponents
                .filter((entry) => entry.games >= 2)
                .sort((a, b) => a.winrate - b.winrate)
                .slice(0, 8)
                .map((hero) => (
                  <tr key={hero.hero}>
                    <td>{hero.hero}</td>
                    <td>{hero.games}</td>
                    <td>{hero.winrate}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <h3>Best Allies</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Союзник</th>
                <th>Матчи</th>
                <th>Winrate</th>
              </tr>
            </thead>
            <tbody>
              {allies
                .filter((entry) => entry.games >= 2)
                .sort((a, b) => b.winrate - a.winrate)
                .slice(0, 8)
                .map((hero) => (
                  <tr key={hero.hero}>
                    <td>{hero.hero}</td>
                    <td>{hero.games}</td>
                    <td>{hero.winrate}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3>Synergy / Counter Matrix</h3>
          <input
            type="text"
            placeholder="Введите моего героя"
            value={heroFocus}
            onChange={(event) => setHeroFocus(event.target.value)}
          />
          {!heroFocus ? (
            <p className="muted">Введите героя, чтобы увидеть синергию.</p>
          ) : synergy ? (
            <div className="matrix">
              <div>
                <h4>Лучшие союзники</h4>
                <ul>
                  {synergy.allies
                    .filter((entry) => entry.games >= 1)
                    .sort((a, b) => b.winrate - a.winrate)
                    .slice(0, 5)
                    .map((entry) => (
                      <li key={entry.hero}>
                        <span>{entry.hero}</span>
                        <span>{entry.winrate}%</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h4>Сложные контрпики</h4>
                <ul>
                  {synergy.enemies
                    .filter((entry) => entry.games >= 1)
                    .sort((a, b) => a.winrate - b.winrate)
                    .slice(0, 5)
                    .map((entry) => (
                      <li key={entry.hero}>
                        <span>{entry.hero}</span>
                        <span>{entry.winrate}%</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="muted">Нет данных для выбранного героя.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Тренд винрейта</h3>
          <p className="muted">Winrate по {trendBucket === "week" ? "неделям" : "месяцам"}</p>
        </div>
        {trend.length === 0 ? (
          <p className="muted">Недостаточно данных для тренда.</p>
        ) : (
          <div className="trend-chart">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#E1643E"
                strokeWidth="3"
                points={trend
                  .map((point, index) => {
                    const x = (index / (trend.length - 1)) * 580 + 10;
                    const y = 180 - (point.winrate / 100) * 160;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              {trend.map((point, index) => {
                const x = (index / (trend.length - 1)) * 580 + 10;
                const y = 180 - (point.winrate / 100) * 160;
                return <circle key={point.label} cx={x} cy={y} r={4} fill="#F5B36A" />;
              })}
            </svg>
            <div className="trend-labels">
              {trend.map((point) => (
                <div key={point.label}>
                  <span>{point.label}</span>
                  <strong>{point.winrate}%</strong>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="muted">
          Общий винрейт: {calculateWinrate(
            filtered.filter((match) => match.result === "Win").length,
            filtered.length,
          )}%
        </p>
      </div>
    </section>
  );
};

export default Analytics;
