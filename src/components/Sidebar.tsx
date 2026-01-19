import React from "react";

export type PageKey = "dashboard" | "add" | "matches" | "analytics" | "counters" | "settings";

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ current, onNavigate }) => {
  const links: { key: PageKey; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "add", label: "Add Match" },
    { key: "matches", label: "Matches" },
    { key: "analytics", label: "Analytics" },
    { key: "counters", label: "Counters / Контрпики" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">D2</span>
        <div>
          <h1>Match Tracker</h1>
          <p>Dota 2 Personal</p>
        </div>
      </div>
      <nav>
        {links.map((link) => (
          <button
            key={link.key}
            type="button"
            className={current === link.key ? "active" : ""}
            onClick={() => onNavigate(link.key)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Local-first · Offline</p>
      </div>
    </aside>
  );
};

export default Sidebar;
