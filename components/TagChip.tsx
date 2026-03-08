const TAG_COLORS: Record<string, string> = {
  "AI/ML": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Web Dev": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Security: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  DevOps: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Science: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Business: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Open Source": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Other: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

interface TagChipProps {
  tag: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export default function TagChip({ tag, onClick, selected, className }: TagChipProps) {
  const colors = TAG_COLORS[tag] ?? TAG_COLORS.Other;
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-opacity";
  const interactive = onClick ? "cursor-pointer hover:opacity-80" : "";
  const ring = selected ? "ring-2 ring-offset-1 ring-current" : "";

  return (
    <span
      className={`${base} ${colors} ${interactive} ${ring} ${className ?? ""}`}
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
