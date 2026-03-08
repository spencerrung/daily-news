import SOURCES from "@/config/sources";
import { fetchSource } from "@/lib/fetchers";
import { categorizeAll } from "@/lib/categorizer";
import { deduplicateByUrl } from "@/lib/utils";
import NewsApp from "@/components/NewsApp";

export const revalidate = 900;

export default async function Home() {
  const results = await Promise.all(
    SOURCES.filter((s) => s.enabled).map((s) => fetchSource(s))
  );

  const enabledSources = SOURCES.filter((s) => s.enabled);
  const errors = results
    .map((r, i) => ({ sourceId: enabledSources[i].id, message: r.error ?? "" }))
    .filter((e) => e.message);

  const deduped = deduplicateByUrl(results.flatMap((r) => r.items));
  const categorized = await categorizeAll(deduped);

  categorized.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const items = categorized.map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt),
  }));

  return (
    <NewsApp
      items={items}
      fetchedAt={new Date().toISOString()}
      errors={errors}
    />
  );
}
