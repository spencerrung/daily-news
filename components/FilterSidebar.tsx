"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
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
  const [sourceSearch, setSourceSearch] = useState("");
  const hasFilters = selectedTags.size > 0 || selectedSources.size > 0;

  const visibleSources = sourceSearch.trim()
    ? allSourceNames.filter((n) => n.toLowerCase().includes(sourceSearch.toLowerCase()))
    : allSourceNames;

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Sources
          </h3>
          {selectedSources.size > 0 && (
            <span className="text-xs text-blue-500 dark:text-blue-400">
              {selectedSources.size} selected
            </span>
          )}
        </div>

        {/* Source search — only shown when there are enough sources to warrant it */}
        {allSourceNames.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter sources…"
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className="w-full pl-6 pr-6 py-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {sourceSearch && (
              <button
                onClick={() => setSourceSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable list */}
        <ul className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          {visibleSources.map((name) => (
            <li key={name}>
              <label className="flex items-center gap-2 cursor-pointer group py-0.5">
                <input
                  type="checkbox"
                  checked={selectedSources.has(name)}
                  onChange={() => onSourceToggle(name)}
                  className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 accent-blue-500 shrink-0"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
                  {name}
                </span>
              </label>
            </li>
          ))}
          {visibleSources.length === 0 && (
            <li className="text-xs text-zinc-400 dark:text-zinc-600 py-1">No sources match.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}
