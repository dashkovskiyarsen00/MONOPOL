import React, { useEffect, useMemo, useState } from "react";
import type { MatchMode, MatchRecord, MatchResult, MatchRole, SettingsState } from "../types";
import { formatDate, fromLocalInputValue, toLocalInputValue } from "../utils/format";
import HeroMultiSelect from "./HeroMultiSelect";
import TagInput from "./TagInput";
import Modal from "./Modal";
import HeroBadge from "./HeroBadge";

interface MatchDetailsModalProps {
  match: MatchRecord;
  timeFormat: SettingsState["timeFormat"];
  onClose: () => void;
  onSave?: (match: MatchRecord) => Promise<void> | void;
  onDelete?: (match: MatchRecord) => void;
  onDuplicate?: (match: MatchRecord) => void;
  tagSuggestions?: string[];
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  timeFormat,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
  tagSuggestions,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MatchRecord>(match);

  useEffect(() => {
    setDraft(match);
    setIsEditing(false);
  }, [match]);

  const canSave = useMemo(() => Boolean(draft.myHero && draft.result), [draft]);

  const updateDraft = (update: Partial<MatchRecord>) => {
    setDraft((prev) => ({ ...prev, ...update }));
  };

  const save = async () => {
    if (!onSave || !canSave) return;
    await onSave(draft);
    setIsEditing(false);
  };

  const actionButtons = isEditing ? (
    <>
      <button type="button" className="secondary" onClick={() => setIsEditing(false)}>
        Отмена
      </button>
      <button type="button" className="primary" onClick={save} disabled={!canSave}>
        Сохранить
      </button>
    </>
  ) : (
    <>
      {onDuplicate && (
        <button type="button" className="secondary" onClick={() => onDuplicate(match)}>
          Duplicate match
        </button>
      )}
      {onSave && (
        <button type="button" className="primary" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      {onDelete && (
        <button type="button" className="danger" onClick={() => onDelete(match)}>
          Удалить
        </button>
      )}
    </>
  );

  return (
    <Modal title={`Матч: ${match.myHero || "Без героя"}`} onClose={onClose} actions={actionButtons}>
      {!isEditing ? (
        <div className="match-details">
          <div className="detail-grid">
            <div>
              <p className="muted">Дата</p>
              <strong>{formatDate(match.playedAt, timeFormat)}</strong>
            </div>
            <div>
              <p className="muted">Результат</p>
              <strong className={match.result === "Win" ? "text-win" : "text-loss"}>{match.result}</strong>
            </div>
            <div>
              <p className="muted">Режим</p>
              <strong>{match.mode}</strong>
            </div>
            <div>
              <p className="muted">Роль</p>
              <strong>{match.myRole ?? "Не указано"}</strong>
            </div>
            <div>
              <p className="muted">Длительность</p>
              <strong>{match.durationMin ? `${match.durationMin} мин` : "-"}</strong>
            </div>
            <div>
              <p className="muted">Лейн против</p>
              <strong>{match.laneOpp ?? "-"}</strong>
            </div>
            <div>
              <p className="muted">MMR / ранг</p>
              <strong>{match.mmr ?? "-"}</strong>
            </div>
          </div>

          <div className="draft-block">
            <div>
              <h4>Draft: союзники</h4>
              {match.allies.length === 0 ? (
                <p className="muted">Нет данных по союзникам.</p>
              ) : (
                <div className="hero-pill-grid">
                  {match.allies.map((hero) => (
                    <div key={hero} className="hero-pill">
                      <HeroBadge hero={hero} />
                      <span>{hero}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4>Draft: противники</h4>
              {match.enemies.length === 0 ? (
                <p className="muted">Нет данных по противникам.</p>
              ) : (
                <div className="hero-pill-grid">
                  {match.enemies.map((hero) => (
                    <div key={hero} className="hero-pill danger">
                      <HeroBadge hero={hero} />
                      <span>{hero}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h4>Тэги</h4>
            {match.tags.length === 0 ? (
              <p className="muted">Тэги не указаны.</p>
            ) : (
              <div className="pill-list">
                {match.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>Заметки</h4>
            {match.notes ? <p>{match.notes}</p> : <p className="muted">Заметки отсутствуют.</p>}
          </div>
        </div>
      ) : (
        <div className="modal-form">
          <div className="modal-grid">
            <div>
              <label>Дата/время</label>
              <input
                type="datetime-local"
                value={toLocalInputValue(draft.playedAt)}
                onChange={(event) => updateDraft({ playedAt: fromLocalInputValue(event.target.value) })}
              />
            </div>
            <div>
              <label>Герой</label>
              <input type="text" value={draft.myHero} onChange={(event) => updateDraft({ myHero: event.target.value })} />
            </div>
            <div>
              <label>Режим</label>
              <select value={draft.mode} onChange={(event) => updateDraft({ mode: event.target.value as MatchMode })}>
                <option value="Ranked">Ranked</option>
                <option value="Unranked">Unranked</option>
                <option value="Turbo">Turbo</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label>Результат</label>
              <select
                value={draft.result}
                onChange={(event) => updateDraft({ result: event.target.value as MatchResult })}
              >
                <option value="Win">Win</option>
                <option value="Loss">Loss</option>
              </select>
            </div>
            <div>
              <label>Длительность (мин)</label>
              <input
                type="number"
                value={draft.durationMin ?? ""}
                onChange={(event) =>
                  updateDraft({ durationMin: event.target.value ? Number(event.target.value) : undefined })
                }
              />
            </div>
            <div>
              <label>Роль</label>
              <select
                value={draft.myRole ?? ""}
                onChange={(event) =>
                  updateDraft({ myRole: event.target.value ? (event.target.value as MatchRole) : undefined })
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
            <div>
              <label>MMR / ранг</label>
              <input type="text" value={draft.mmr ?? ""} onChange={(event) => updateDraft({ mmr: event.target.value })} />
            </div>
            <div>
              <label>Лейнинг против</label>
              <input
                type="text"
                value={draft.laneOpp ?? ""}
                onChange={(event) => updateDraft({ laneOpp: event.target.value })}
              />
            </div>
          </div>

          <HeroMultiSelect
            label="Союзники"
            values={draft.allies}
            onChange={(values) => updateDraft({ allies: values })}
            limit={4}
          />
          <HeroMultiSelect
            label="Противники"
            values={draft.enemies}
            onChange={(values) => updateDraft({ enemies: values })}
            limit={5}
          />
          <TagInput
            label="Тэги"
            values={draft.tags}
            onChange={(values) => updateDraft({ tags: values })}
            suggestions={tagSuggestions}
          />
          <div className="field">
            <label>Заметки</label>
            <textarea rows={4} value={draft.notes ?? ""} onChange={(event) => updateDraft({ notes: event.target.value })} />
          </div>
          <p className="muted">Создано: {formatDate(match.createdAt, timeFormat)}</p>
        </div>
      )}
    </Modal>
  );
};

export default MatchDetailsModal;
