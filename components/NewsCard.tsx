import { ArrowUp, MessageSquare, Clock } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import TagChip from "./TagChip";
import SourceBadge from "./SourceBadge";
import type { ViewMode } from "./ViewToggle";

const TAG_ACCENT: Record<string, string> = {
  "AI/ML":       "bg-purple-500",
  "Web Dev":     "bg-blue-500",
  Security:      "bg-red-500",
  DevOps:        "bg-orange-500",
  Science:       "bg-green-500",
  Business:      "bg-yellow-500",
  "Open Source": "bg-teal-500",
  Other:         "bg-zinc-400",
};

interface NewsCardProps {
  item: NewsItem;
  onTagClick?: (tag: string) => void;
  view?: ViewMode;
}

export default function NewsCard({ item, onTagClick, view = "card" }: NewsCardProps) {
  const accent = TAG_ACCENT[item.tags[0]] ?? TAG_ACCENT.Other;
  const domain = (() => { try { return new URL(item.url).hostname; } catch { return null; } })();

  if (view === "compact") {
    return (
      <article className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer group">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-lg" aria-label={item.title} />
        <div className="pointer-events-none flex items-center gap-3 min-w-0 w-full">
          <SourceBadge source={item.source} sourceName={item.sourceName} />
          <p className="flex-1 text-sm text-zinc-800 dark:text-zinc-200 truncate">{item.title}</p>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0" suppressHydrationWarning>{timeAgo(new Date(item.publishedAt))}</span>
          {item.commentsUrl && item.commentCount !== undefined && (
            <a
              href={item.commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 shrink-0 -m-2 p-2"
            >
              <MessageSquare className="w-3 h-3" />
              {item.commentCount.toLocaleString()}
            </a>
          )}
        </div>
      </article>
    );
  }

  if (view === "magazine") {
    return (
      <article className="relative flex gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-xl" aria-label={item.title} />

        {/* Color accent bar */}
        <div className={`shrink-0 w-1 rounded-full ${accent}`} />

        <div className="pointer-events-none flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {domain && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                alt=""
                className="w-4 h-4 rounded-sm"
              />
            )}
            <SourceBadge source={item.source} sourceName={item.sourceName} />
            {item.tags.map((tag) => (
              <TagChip key={tag} tag={tag} onClick={onTagClick ? () => onTagClick(tag) : undefined} className="pointer-events-auto relative" />
            ))}
          </div>

          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-3">
            {item.title}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
            {item.score !== undefined && (
              <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" />{item.score.toLocaleString()}</span>
            )}
            {item.commentCount !== undefined && item.commentsUrl && (
              <a href={item.commentsUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative flex items-center gap-1 -m-2 p-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                <MessageSquare className="w-3 h-3" />{item.commentCount.toLocaleString()}
              </a>
            )}
            <span className="flex items-center gap-1 ml-auto" suppressHydrationWarning><Clock className="w-3 h-3" />{timeAgo(new Date(item.publishedAt))}</span>
          </div>
        </div>
      </article>
    );
  }

  // card (default)
  return (
    <article className="relative flex flex-col gap-2 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 rounded-xl" aria-label={item.title} />
      <div className="pointer-events-none flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceBadge source={item.source} sourceName={item.sourceName} />
          {item.tags.map((tag) => (
            <TagChip key={tag} tag={tag} onClick={onTagClick ? () => onTagClick(tag) : undefined} className="pointer-events-auto relative" />
          ))}
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">{item.title}</p>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
          {item.score !== undefined && (
            <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" />{item.score.toLocaleString()}</span>
          )}
          {item.commentCount !== undefined && item.commentsUrl && (
            <a href={item.commentsUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative flex items-center gap-1 -m-2 p-2 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <MessageSquare className="w-3 h-3" />{item.commentCount.toLocaleString()}
            </a>
          )}
          <span className="flex items-center gap-1 ml-auto" suppressHydrationWarning><Clock className="w-3 h-3" />{timeAgo(new Date(item.publishedAt))}</span>
        </div>
      </div>
    </article>
  );
}
