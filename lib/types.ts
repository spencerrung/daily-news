export interface NewsItem {
  id: string;
  title: string;
  url: string;
  commentsUrl?: string;
  source: "hackernews" | "reddit" | "rss";
  sourceName: string;
  score?: number;
  commentCount?: number;
  publishedAt: Date;
  tags: string[];
  categorizedBy: "rules" | "llm" | "none";
}

export interface HNSourceConfig {
  id: string;
  type: "hackernews";
  displayName: string;
  enabled: boolean;
  endpoint: "topstories" | "newstories" | "beststories" | "askstories" | "showstories";
  limit: number;
}

export interface RedditSourceConfig {
  id: string;
  type: "reddit";
  displayName: string;
  enabled: boolean;
  subreddit: string;
  sort: "hot" | "new" | "top" | "rising";
  limit: number;
}

export interface RSSSourceConfig {
  id: string;
  type: "rss";
  displayName: string;
  enabled: boolean;
  url: string;
  limit?: number;
}

export type AnySourceConfig = HNSourceConfig | RedditSourceConfig | RSSSourceConfig;

export interface NewsApiResponse {
  items: NewsItem[];
  fetchedAt: string;
  errors: { sourceId: string; message: string }[];
}
