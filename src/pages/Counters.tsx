import React, { useMemo, useState } from "react";
import type { MatchMode, MatchRecord } from "../types";
import { useStore } from "../data/store";
import HeroSelect from "../components/HeroSelect";
import HeroMultiSelect from "../components/HeroMultiSelect";
import MatchDetailsModal from "../components/MatchDetailsModal";
import { formatDate } from "../utils/format";
import {
  computeRiskScore,
  getEnemyStatsForMyHero,
  getHeadToHead,
  type CounterFilters,
} from "../utils/counters";
const Counters: React.FC = () => {
  const { matches, settings, updateMatch } = useStore();
  const [filters, setFilters] = useState<CounterFilters>({
    period: "all",
    mode: "all",
  });
  const [myHero, setMyHero] = useState("");
  const [minGames, setMinGames] = useState(3);
  const [enemyFocus, setEnemyFocus] = useState("");
  const [riskHero, setRiskHero] = useState("");
  const [riskEnemies, setRiskEnemies] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);

  const enemyStats = useMemo(
    () => getEnemyStatsForMyHero(matches, myHero, filters),
    [matches, myHero, filters],
  );

  const worstEnemies = useMemo(() => {
    return enemyStats
      .filter((entry) => entry.games >= minGames)
      .sort((a, b) => a.winrate - b.winrate || b.games - a.games);
  }, [enemyStats, minGames]);

  const bestEnemies = useMemo(() => {
    return enemyStats
      .filter((entry) => entry.games >= minGames)
      .sort((a, b) => b.winrate - a.winrate || b.games - a.games);
  }, [enemyStats, minGames]);

  const headToHead = useMemo(
    () => getHeadToHead(matches, myHero, enemyFocus, filters),
    [matches, myHero, enemyFocus, filters],
  );

  const riskSummary = useMemo(
    () => computeRiskScore(matches, riskHero, riskEnemies, filters, minGames),
    [matches, riskHero, riskEnemies, filters, minGames],
  );

  const renderResults = (results: MatchRecord["result"][]) => (
    <div className="result-chips">
      {results.map((result, index) => (
        <span key={`${result}-${index}`} className={`chip ${result.toLowerCase()}`}>
          {result === "Win" ? "W" : "L"}
        </span>
      ))}
    </div>
  );

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Counters / Контрпики</h2>
          <p>Аналитика контрпиков на основе вашей базы матчей.</p>
        </div>
      </header>

      <div className="panel filters">
        <HeroSelect label="Мой герой" value={myHero} onChange={setMyHero} allowEmpty />
        <div className="field">
          <label>Период</label>
          <select
            value={filters.period}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, period: event.target.value as CounterFilters["period"] }))
            }
          >
            <option value="all">Весь период</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="90d">90 дней</option>
            <option value="custom">Интервал</option>
          </select>
        </div>
        {filters.period === "custom" && (
          <>
            <div className="field">
              <label>С</label>
              <input
                type="date"
                value={filters.from ?? ""}
                onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
              />
            </div>
            <div className="field">
              <label>По</label>
              <input
                type="date"
                value={filters.to ?? ""}
                onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
              />
            </div>
          </>
        )}
        <div className="field">
          <label>Режим</label>
          <select
            value={filters.mode ?? "all"}
            onChange={(event) => setFilters((prev) => ({ ...prev, mode: event.target.value as MatchMode | "all" }))}
          >
            <option value="all">Все режимы</option>
            <option value="Ranked">Ranked</option>
            <option value="Unranked">Unranked</option>
            <option value="Turbo">Turbo</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="field">
          <label>Min games</label>
          <input
            type="number"
            min={1}
            value={minGames}
            onChange={(event) => setMinGames(Math.max(1, Number(event.target.value)))}
          />
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <h3>Худшие противники</h3>
          {!myHero ? (
            <p className="muted">Выберите героя, чтобы увидеть контрпики.</p>
          ) : worstEnemies.length === 0 ? (
            <p className="muted">Нужно минимум {minGames} матч(ей) против каждого героя.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enemy Hero</th>
                  <th>Games vs</th>
                  <th>W/L</th>
                  <th>Winrate</th>
                  <th>Avg duration</th>
                  <th>Последние</th>
                </tr>
              </thead>
              <tbody>
                {worstEnemies.map((enemy) => (
                  <tr key={enemy.hero}>
                    <td>{enemy.hero}</td>
                    <td>{enemy.games}</td>
                    <td>
                      {enemy.wins}/{enemy.losses}
                    </td>
                    <td className="text-loss">{enemy.winrate}%</td>
                    <td>{enemy.avgDuration ? `${enemy.avgDuration} мин` : "-"}</td>
                    <td>{renderResults(enemy.recentResults)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="panel">
          <h3>Лучшие противники</h3>
          {!myHero ? (
            <p className="muted">Выберите героя, чтобы увидеть легкие матчи.</p>
          ) : bestEnemies.length === 0 ? (
            <p className="muted">Нужно минимум {minGames} матч(ей) против каждого героя.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enemy Hero</th>
                  <th>Games vs</th>
                  <th>W/L</th>
                  <th>Winrate</th>
                  <th>Avg duration</th>
                  <th>Последние</th>
                </tr>
              </thead>
              <tbody>
                {bestEnemies.map((enemy) => (
                  <tr key={enemy.hero}>
                    <td>{enemy.hero}</td>
                    <td>{enemy.games}</td>
                    <td>
                      {enemy.wins}/{enemy.losses}
                    </td>
                    <td className="text-win">{enemy.winrate}%</td>
                    <td>{enemy.avgDuration ? `${enemy.avgDuration} мин` : "-"}</td>
                    <td>{renderResults(enemy.recentResults)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Counter Matrix</h3>
        <div className="grid two">
          <HeroSelect label="Мой герой A" value={myHero} onChange={setMyHero} allowEmpty />
          <HeroSelect label="Вражеский герой B" value={enemyFocus} onChange={setEnemyFocus} allowEmpty />
        </div>
        {!myHero || !enemyFocus ? (
          <p className="muted">Выберите героев, чтобы увидеть head-to-head.</p>
        ) : headToHead ? (
          <div className="counter-summary">
            <div className="summary-grid">
              <div className="summary-card">
                <h3>{headToHead.games}</h3>
                <p>Матчей</p>
              </div>
              <div className="summary-card win">
                <h3>{headToHead.wins}</h3>
                <p>Победы</p>
              </div>
              <div className="summary-card loss">
                <h3>{headToHead.losses}</h3>
                <p>Поражения</p>
              </div>
              <div className="summary-card">
                <h3>{headToHead.winrate}%</h3>
                <p>Winrate</p>
              </div>
            </div>
            <div className="counter-meta">
              <div>
                <p className="muted">Средняя длительность</p>
                <strong>{headToHead.avgDuration ? `${headToHead.avgDuration} мин` : "-"}</strong>
              </div>
              <div>
                <p className="muted">Последние результаты</p>
                {renderResults(headToHead.recentResults)}
              </div>
              <div>
                <p className="muted">Заметки</p>
                {headToHead.recentNotes.length > 0 ? (
                  <ul className="note-list">
                    {headToHead.recentNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Нет заметок.</p>
                )}
              </div>
            </div>
            <div className="match-list compact">
              {headToHead.matches.slice(0, 8).map((match) => (
                <button
                  type="button"
                  key={match.id}
                  className={`match-card ${match.result.toLowerCase()}`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="match-header">
                    <div>
                      <p className="match-date">{formatDate(match.playedAt, settings.timeFormat)}</p>
                      <h4>{match.myHero}</h4>
                    </div>
                    <span className={`badge ${match.result.toLowerCase()}`}>{match.result}</span>
                  </div>
                  <div className="match-meta">
                    <span>{match.mode}</span>
                    {match.durationMin && <span>{match.durationMin} мин</span>}
                  </div>
                  {match.notes && <p className="match-notes">{match.notes.slice(0, 80)}</p>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="muted">Матчи между выбранными героями не найдены.</p>
        )}
      </div>

      <div className="panel">
        <h3>Рекомендация перед игрой</h3>
        <div className="grid two">
          <HeroSelect label="Мой герой" value={riskHero} onChange={setRiskHero} allowEmpty />
          <HeroMultiSelect label="Враги" values={riskEnemies} onChange={setRiskEnemies} limit={5} />
        </div>
        {!riskHero || riskEnemies.length === 0 ? (
          <p className="muted">Выберите героя и 1–5 врагов, чтобы получить рекомендацию.</p>
        ) : (
          <div className="risk-block">
            <div className={`risk-score ${riskSummary.level}`}>
              <h4>Risk score</h4>
              <strong>{riskSummary.level.toUpperCase()}</strong>
              <span>{riskSummary.score}</span>
            </div>
            <div>
              <p>
                Исторически у тебя {riskSummary.winrate}% против этого набора ({riskSummary.totalGames} матч(ей)).
              </p>
              {riskSummary.threats.length > 0 ? (
                <div>
                  <p className="muted">Самые опасные враги:</p>
                  <ul className="stat-list">
                    {riskSummary.threats.map((threat) => (
                      <li key={threat.hero}>
                        <span>{threat.hero}</span>
                        <span>
                          {threat.winrate}% ({threat.games})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="muted">Недостаточно данных по выбранным врагам.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          timeFormat={settings.timeFormat}
          onClose={() => setSelectedMatch(null)}
          onSave={updateMatch}
        />
      )}
    </section>
  );
};

export default Counters;
