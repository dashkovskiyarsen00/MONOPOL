import React from "react";
import type { MatchRecord } from "../types";
import { formatDate } from "../utils/format";

interface MatchCardProps {
  match: MatchRecord;
  timeFormat: "24h" | "12h";
  onOpen: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, timeFormat, onOpen }) => {
  return (
    <button type="button" className={`match-card ${match.result.toLowerCase()}`} onClick={onOpen}>
      <div className="match-header">
        <div>
          <p className="match-date">{formatDate(match.playedAt, timeFormat)}</p>
          <h4>{match.myHero}</h4>
        </div>
        <span className={`badge ${match.result.toLowerCase()}`}>{match.result}</span>
      </div>
      <div className="match-meta">
        <span>{match.mode}</span>
        {match.durationMin && <span>{match.durationMin} мин</span>}
        {match.myRole && <span>{match.myRole}</span>}
      </div>
      <div className="match-opponents">
        {match.enemies.slice(0, 3).map((hero) => (
          <span key={hero}>{hero}</span>
        ))}
        {match.enemies.length > 3 && <span>+{match.enemies.length - 3}</span>}
      </div>
      {match.notes && <p className="match-notes">{match.notes.slice(0, 120)}</p>}
    </button>
  );
};

export default MatchCard;
