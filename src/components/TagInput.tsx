import React, { useState } from "react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, values, onChange, placeholder }) => {
  const [input, setInput] = useState("");

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
        <button type="button" className="secondary" onClick={() => {
          addTag(input);
          setInput("");
        }}>
          Добавить
        </button>
      </div>
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
