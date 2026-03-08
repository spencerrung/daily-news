const SOURCE_COLORS: Record<string, string> = {
  hackernews: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  reddit: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  rss: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

interface SourceBadgeProps {
  source: "hackernews" | "reddit" | "rss";
  sourceName: string;
}

export default function SourceBadge({ source, sourceName }: SourceBadgeProps) {
  const colors = SOURCE_COLORS[source] ?? SOURCE_COLORS.rss;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors}`}
    >
      {sourceName}
    </span>
  );
}
