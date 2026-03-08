import type { NewsApiResponse } from "@/lib/types";
import NewsApp from "@/components/NewsApp";

export const revalidate = 900;

async function getNews(): Promise<NewsApiResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/news`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);
  return res.json();
}

export default async function Home() {
  let data: NewsApiResponse;

  try {
    data = await getNews();
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Failed to load news. {String(err)}
          </p>
        </div>
      </div>
    );
  }

  // Dates come through JSON as strings — convert back
  const items = data.items.map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt),
  }));

  return (
    <NewsApp items={items} fetchedAt={data.fetchedAt} errors={data.errors} />
  );
}
