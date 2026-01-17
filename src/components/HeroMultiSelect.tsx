import React, { useMemo, useState } from "react";
import { findHero } from "../data/heroes";

interface HeroMultiSelectProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  limit: number;
}

const HeroMultiSelect: React.FC<HeroMultiSelectProps> = ({ label, values, onChange, limit }) => {
  const [query, setQuery] = useState("");
  const options = useMemo(() => findHero(query), [query]);

  const addHero = (hero: string) => {
    const trimmed = hero.trim();
    if (!trimmed || values.includes(trimmed) || values.length >= limit) return;
    onChange([...values, trimmed]);
  };

  const removeHero = (hero: string) => {
    onChange(values.filter((value) => value !== hero));
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="hero-multi">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Начните вводить героя"
          list={`hero-options-${label}`}
        />
        <datalist id={`hero-options-${label}`}>
          {options.map((hero) => (
            <option value={hero.name} key={hero.id} />
          ))}
        </datalist>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            addHero(query);
            setQuery("");
          }}
          disabled={values.length >= limit}
        >
          Добавить
        </button>
        <span className="helper">{values.length}/{limit}</span>
      </div>
      <div className="pill-list">
        {values.map((hero) => (
          <button type="button" key={hero} onClick={() => removeHero(hero)}>
            {hero} <span>×</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroMultiSelect;
