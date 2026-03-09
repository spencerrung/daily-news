import type { RedditSourceConfig, NewsItem } from "@/lib/types";

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    permalink: string;
    is_self: boolean;
    score: number;
    num_comments: number;
    created_utc: number;
  };
}

interface RedditResponse {
  data: { children: RedditPost[] };
}

// In-memory token cache (valid for 1 hour per Reddit's spec)
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAppOnlyToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required. Create a Reddit app at https://www.reddit.com/prefs/apps"
    );
  }

  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "daily-news-aggregator/1.0",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Reddit token fetch failed: ${res.status}`);

  const json = await res.json();
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000, // 60s buffer
  };

  return tokenCache.token;
}

export async function fetchReddit(
  config: RedditSourceConfig
): Promise<NewsItem[]> {
  const token = await getAppOnlyToken();

  const url = `https://oauth.reddit.com/r/${config.subreddit}/${config.sort}.json?limit=${config.limit}&raw_json=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "daily-news-aggregator/1.0",
    },
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`Reddit fetch failed: ${res.status}`);

  const json: RedditResponse = await res.json();

  return json.data.children
    .filter((post) => !post.data.is_self)
    .map((post) => ({
      id: `reddit-${post.data.id}`,
      title: post.data.title,
      url: post.data.url,
      commentsUrl: `https://reddit.com${post.data.permalink}`,
      source: "reddit" as const,
      sourceName: config.displayName,
      score: post.data.score,
      commentCount: post.data.num_comments,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      tags: [],
      categorizedBy: "none" as const,
    }));
}
