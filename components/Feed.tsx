import type { NewsItem } from "@/lib/types";
import NewsCard from "./NewsCard";

interface FeedProps {
  items: NewsItem[];
  onTagClick: (tag: string) => void;
}

export default function Feed({ items, onTagClick }: FeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400 dark:text-zinc-600">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm">No stories match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} onTagClick={onTagClick} />
      ))}
    </div>
  );
}
