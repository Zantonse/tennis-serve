"use client";

import { TAG_MAP } from "@/lib/tags";

interface TagSelectorProps {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  variant: "strength" | "weakness";
}

export default function TagSelector({
  tags,
  selected,
  onChange,
  variant,
}: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap" as const,
        gap: "8px",
      }}
    >
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        const displayLabel = TAG_MAP[tag]?.label ?? tag.charAt(0).toUpperCase() + tag.slice(1);

        let chipStyle: React.CSSProperties;
        if (isSelected) {
          if (variant === "strength") {
            chipStyle = {
              backgroundColor: "#166534",
              color: "#4ade80",
              border: "1.5px solid #16a34a",
            };
          } else {
            chipStyle = {
              backgroundColor: "#7f1d1d",
              color: "#f87171",
              border: "1.5px solid #dc2626",
            };
          }
        } else {
          chipStyle = {
            backgroundColor: "#f5f5f4",
            color: "#78716c",
            border: "1.5px solid #d6d3d1",
          };
        }

        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            style={{
              minHeight: "44px",
              padding: "0 14px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              lineHeight: 1,
              ...chipStyle,
            }}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
}
