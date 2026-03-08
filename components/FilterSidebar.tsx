"use client";

import { X } from "lucide-react";
import { KNOWN_TAGS } from "@/config/tags";
import TagChip from "./TagChip";

interface FilterSidebarProps {
  allSourceNames: string[];
  selectedTags: Set<string>;
  selectedSources: Set<string>;
  onTagToggle: (tag: string) => void;
  onSourceToggle: (source: string) => void;
  onClear: () => void;
  itemCount: number;
  totalCount: number;
}

export default function FilterSidebar({
  allSourceNames,
  selectedTags,
  selectedSources,
  onTagToggle,
  onSourceToggle,
  onClear,
  itemCount,
  totalCount,
}: FilterSidebarProps) {
  const hasFilters = selectedTags.size > 0 || selectedSources.size > 0;

  return (
    <aside className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {itemCount} of {totalCount} stories
      </p>

      {/* Tags */}
      <div>
        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          Topics
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {KNOWN_TAGS.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              selected={selectedTags.has(tag)}
              onClick={() => onTagToggle(tag)}
            />
          ))}
        </div>
      </div>

      {/* Sources */}
      <div>
        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          Sources
        </h3>
        <ul className="flex flex-col gap-1.5">
          {allSourceNames.map((name) => (
            <li key={name}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSources.has(name)}
                  onChange={() => onSourceToggle(name)}
                  className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 accent-blue-500"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  {name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
