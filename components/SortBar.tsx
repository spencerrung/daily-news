"use client";

import type { SortMode } from "@/hooks/useNewsFilters";

const MODES: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "hot",    label: "Hot" },
  { value: "popular", label: "Popular" },
];

interface SortBarProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

export default function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 w-fit">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            value === mode.value
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
