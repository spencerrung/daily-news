"use client";

import { List, LayoutGrid, Newspaper } from "lucide-react";

export type ViewMode = "compact" | "card" | "magazine";

const VIEWS: { value: ViewMode; icon: React.ReactNode; label: string }[] = [
  { value: "compact",  icon: <List className="w-4 h-4" />,       label: "Compact" },
  { value: "card",     icon: <LayoutGrid className="w-4 h-4" />, label: "Card" },
  { value: "magazine", icon: <Newspaper className="w-4 h-4" />,  label: "Magazine" },
];

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 w-fit">
      {VIEWS.map((v) => (
        <button
          key={v.value}
          onClick={() => onChange(v.value)}
          title={v.label}
          className={`p-1.5 rounded-md transition-colors ${
            value === v.value
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          }`}
        >
          {v.icon}
        </button>
      ))}
    </div>
  );
}
