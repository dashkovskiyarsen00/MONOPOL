import React, { useMemo, useState } from "react";
import { HEROES, findHero } from "../data/heroes";

interface HeroSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowEmpty?: boolean;
}

const HeroSelect: React.FC<HeroSelectProps> = ({ label, value, onChange, placeholder, allowEmpty }) => {
  const [query, setQuery] = useState("");

  const options = useMemo(() => findHero(query), [query]);

  return (
    <div className="field">
      <label>{label}</label>
      <div className="hero-select">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder ?? "Поиск героя"}
        />
        <select
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            const hero = HEROES.find((item) => item.name === event.target.value);
            setQuery(hero?.name ?? "");
          }}
        >
          {allowEmpty && <option value="">Не выбрано</option>}
          {options.map((hero) => (
            <option key={hero.id} value={hero.name}>
              {hero.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default HeroSelect;
