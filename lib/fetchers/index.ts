import type { AnySourceConfig, NewsItem } from "@/lib/types";
import { fetchHackerNews } from "./hackernews";
import { fetchReddit } from "./reddit";
import { fetchRSS } from "./rss";

export async function fetchSource(
  config: AnySourceConfig
): Promise<{ items: NewsItem[]; error?: string }> {
  try {
    switch (config.type) {
      case "hackernews":
        return { items: await fetchHackerNews(config) };
      case "reddit":
        return { items: await fetchReddit(config) };
      case "rss":
        return { items: await fetchRSS(config) };
    }
  } catch (e) {
    return { items: [], error: String(e) };
  }
}
