"use client";

import { useState, useMemo, useCallback } from "react";
import type { NewsItem } from "@/lib/types";

export type SortMode = "newest" | "hot" | "popular";

function hotScore(item: NewsItem): number {
  const score = item.score ?? 1;
  const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / 36e5;
  return score / Math.pow(ageHours + 2, 1.5);
}

function applySort(items: NewsItem[], mode: SortMode): NewsItem[] {
  const copy = [...items];
  switch (mode) {
    case "newest":
      return copy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    case "hot":
      return copy.sort((a, b) => hotScore(b) - hotScore(a));
    case "popular":
      return copy.sort((a, b) => {
        const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }
}

export function useNewsFilters(items: NewsItem[]) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const allSourceNames = useMemo(
    () => [...new Set(items.map((i) => i.sourceName))].sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (selectedTags.size > 0 && !item.tags.some((t) => selectedTags.has(t))) return false;
      if (selectedSources.size > 0 && !selectedSources.has(item.sourceName)) return false;
      if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    return applySort(filtered, sortMode);
  }, [items, selectedTags, selectedSources, searchQuery, sortMode]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }, []);

  const toggleSource = useCallback((source: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source); else next.add(source);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags(new Set());
    setSelectedSources(new Set());
    setSearchQuery("");
  }, []);

  return {
    selectedTags,
    selectedSources,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
    filteredItems,
    allSourceNames,
    toggleTag,
    toggleSource,
    clearFilters,
  };
}
