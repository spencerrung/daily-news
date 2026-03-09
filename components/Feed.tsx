import type { NewsItem } from "@/lib/types";
import NewsCard from "./NewsCard";
import type { ViewMode } from "./ViewToggle";

interface FeedProps {
  items: NewsItem[];
  onTagClick: (tag: string) => void;
  view: ViewMode;
}

export default function Feed({ items, onTagClick, view }: FeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400 dark:text-zinc-600">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm">No stories match your filters.</p>
      </div>
    );
  }

  const gridClass =
    view === "compact"  ? "flex flex-col gap-1" :
    view === "magazine" ? "flex flex-col gap-2" :
    "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <NewsCard key={item.id} item={item} onTagClick={onTagClick} view={view} />
      ))}
    </div>
  );
}
