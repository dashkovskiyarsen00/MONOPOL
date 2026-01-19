import React from "react";

interface HeroBadgeProps {
  hero: string;
}

const HeroBadge: React.FC<HeroBadgeProps> = ({ hero }) => {
  const initials = hero
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="hero-badge" title={hero}>
      {initials || "?"}
    </span>
  );
};

export default HeroBadge;
