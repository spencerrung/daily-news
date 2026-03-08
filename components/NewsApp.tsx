"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { useNewsFilters } from "@/hooks/useNewsFilters";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import Feed from "./Feed";

interface NewsAppProps {
  items: NewsItem[];
  fetchedAt: string;
  errors: { sourceId: string; message: string }[];
}

export default function NewsApp({ items, fetchedAt, errors }: NewsAppProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    selectedTags,
    selectedSources,
    searchQuery,
    setSearchQuery,
    filteredItems,
    allSourceNames,
    toggleTag,
    toggleSource,
    clearFilters,
    sortMode,
    setSortMode,
  } = useNewsFilters(items);

  const hasFilters = selectedTags.size > 0 || selectedSources.size > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-sm cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:h-14 sm:py-0 sm:gap-3 h-[5.5rem]">
          <h1
            className="text-base font-semibold text-zinc-900 dark:text-zinc-100 shrink-0 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={(e) => { e.stopPropagation(); router.refresh(); }}
          >
            Daily News
          </h1>
          <div
            className="flex items-center gap-2 sm:flex-1 sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors shrink-0 ${
                hasFilters
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasFilters && (
                <span className="text-xs font-medium">
                  {selectedTags.size + selectedSources.size}
                </span>
              )}
            </button>
          </div>
          <span className="hidden lg:block text-xs text-zinc-400 dark:text-zinc-600 shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
            Updated {new Date(fetchedAt).toLocaleTimeString()}
          </span>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-6">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — slides in from left on mobile, static on desktop */}
        <aside
          className={`
            fixed left-0 bottom-0 z-30 lg:z-auto
            top-[5.5rem] sm:top-14
            lg:sticky lg:top-20 lg:bottom-auto
            w-72 lg:w-56 xl:w-64 shrink-0
            bg-zinc-50 dark:bg-zinc-950 lg:bg-transparent lg:dark:bg-transparent
            overflow-y-auto lg:overflow-visible
            p-5 lg:p-0
            shadow-xl lg:shadow-none
            transition-transform duration-200 lg:transition-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="flex items-center justify-between mb-5 lg:hidden">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Filters
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <FilterSidebar
            allSourceNames={allSourceNames}
            selectedTags={selectedTags}
            selectedSources={selectedSources}
            onTagToggle={toggleTag}
            onSourceToggle={toggleSource}
            onClear={clearFilters}
            itemCount={filteredItems.length}
            totalCount={items.length}
          />
        </aside>

        {/* Main feed */}
        <main className="flex-1 min-w-0">
          {errors.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Some sources failed to load:
              </p>
              <ul className="text-xs text-red-600 dark:text-red-500 space-y-0.5">
                {errors.map((e) => (
                  <li key={e.sourceId}>
                    {e.sourceId}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <SortBar value={sortMode} onChange={setSortMode} />
            <span className="text-xs text-zinc-400 dark:text-zinc-600">
              {filteredItems.length} stories
            </span>
          </div>
          <Feed items={filteredItems} onTagClick={toggleTag} />
        </main>
      </div>
    </div>
  );
}
