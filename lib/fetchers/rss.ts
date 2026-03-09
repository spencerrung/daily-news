import Parser from "rss-parser";
import type { RSSSourceConfig, NewsItem } from "@/lib/types";

const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "daily-news-aggregator/1.0" },
});

export async function fetchRSS(config: RSSSourceConfig): Promise<NewsItem[]> {
  const feed = await parser.parseURL(config.url);
  const items = config.limit ? feed.items.slice(0, config.limit) : feed.items;

  return items
    .filter((item) => item.link && item.title)
    .map((item, idx) => ({
      id: `rss-${config.id}-${item.guid ?? item.link ?? idx}`,
      title: item.title!,
      url: item.link!,
      source: "rss" as const,
      sourceName: config.displayName,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      tags: [],
      categorizedBy: "none" as const,
    }));
}
