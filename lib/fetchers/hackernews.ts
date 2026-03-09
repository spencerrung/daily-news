import type { HNSourceConfig, NewsItem } from "@/lib/types";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

interface HNItem {
  id: number;
  type: string;
  title?: string;
  url?: string;
  score?: number;
  descendants?: number;
  time?: number;
}

export async function fetchHackerNews(
  config: HNSourceConfig
): Promise<NewsItem[]> {
  const idsRes = await fetch(`${HN_BASE}/${config.endpoint}.json`, {
    next: { revalidate: 900 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!idsRes.ok) throw new Error(`HN IDs fetch failed: ${idsRes.status}`);
  const ids: number[] = await idsRes.json();

  const sliced = ids.slice(0, config.limit);
  const items = await Promise.all(
    sliced.map(async (id) => {
      try {
        const res = await fetch(`${HN_BASE}/item/${id}.json`, {
          next: { revalidate: 900 },
          signal: AbortSignal.timeout(5_000),
        });
        if (!res.ok) return null;
        return res.json() as Promise<HNItem>;
      } catch {
        return null;
      }
    })
  );

  return items
    .filter(
      (item): item is HNItem =>
        item !== null && item.type === "story" && !!item.url && !!item.title
    )
    .map((item) => ({
      id: `hackernews-${item.id}`,
      title: item.title!,
      url: item.url!,
      commentsUrl: `https://news.ycombinator.com/item?id=${item.id}`,
      source: "hackernews",
      sourceName: config.displayName,
      score: item.score,
      commentCount: item.descendants,
      publishedAt: new Date((item.time ?? 0) * 1000).toISOString(),
      tags: [],
      categorizedBy: "none",
    }));
}
