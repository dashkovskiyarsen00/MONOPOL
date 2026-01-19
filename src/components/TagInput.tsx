import React, { useMemo, useState } from "react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ label, values, onChange, placeholder, suggestions }) => {
  const [input, setInput] = useState("");

  const availableSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return suggestions.filter((tag) => !values.includes(tag));
  }, [suggestions, values]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((value) => value !== tag));
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="tag-input">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag(input);
              setInput("");
            }
          }}
        />
        <button
          type="button"
          className="secondary"
          onClick={() => {
            addTag(input);
            setInput("");
          }}
        >
          Добавить
        </button>
      </div>
      {availableSuggestions.length > 0 && (
        <div className="tag-suggestions">
          <span>Популярные:</span>
          <div className="pill-list">
            {availableSuggestions.map((tag) => (
              <button type="button" key={tag} onClick={() => addTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="tag-list">
        {values.map((tag) => (
          <button type="button" key={tag} onClick={() => removeTag(tag)}>
            {tag}
            <span>×</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
