import { ArrowUp, MessageSquare, Clock } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import TagChip from "./TagChip";
import SourceBadge from "./SourceBadge";

interface NewsCardProps {
  item: NewsItem;
  onTagClick?: (tag: string) => void;
}

export default function NewsCard({ item, onTagClick }: NewsCardProps) {
  return (
    <article className="relative flex flex-col gap-2 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
      {/* Full-card link — sits behind all content */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-xl"
        aria-label={item.title}
      />

      {/* All content is pointer-events-none so clicks fall through to the link above */}
      <div className="pointer-events-none flex flex-col gap-2">
        {/* Badges row — re-enable pointer events on tags so they're clickable */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceBadge source={item.source} sourceName={item.sourceName} />
          {item.tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
              className="pointer-events-auto relative"
            />
          ))}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {item.title}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
          {item.score !== undefined && (
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {item.score.toLocaleString()}
            </span>
          )}
          {item.commentCount !== undefined && item.commentsUrl && (
            <a
              href={item.commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative flex items-center gap-1 -m-2 p-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              {item.commentCount.toLocaleString()}
            </a>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {timeAgo(new Date(item.publishedAt))}
          </span>
        </div>
      </div>
    </article>
  );
}
