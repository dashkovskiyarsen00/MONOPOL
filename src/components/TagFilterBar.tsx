import React from "react";

interface TagFilterBarProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  label?: string;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({ tags, selected, onToggle, label }) => {
  if (tags.length === 0) {
    return <p className="muted">Нет популярных тэгов для фильтра.</p>;
  }

  return (
    <div className="tag-filter">
      {label && <span className="tag-filter-label">{label}</span>}
      <div className="pill-list">
        {tags.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={isActive ? "active" : ""}
              onClick={() => onToggle(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilterBar;
