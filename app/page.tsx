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

  // Log individual source failures server-side only
  results.forEach((r, i) => {
    if (r.error) {
      console.error(`[daily-news] source "${enabledSources[i].id}" failed: ${r.error}`);
    }
  });

  const deduped = deduplicateByUrl(results.flatMap((r) => r.items));
  const categorized = await categorizeAll(deduped);

  categorized.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  // Only surface a critical error if every source failed
  const totalFailed = results.filter((r) => r.error).length;
  const criticalFailure = totalFailed === enabledSources.length;

  return (
    <NewsApp
      items={categorized}
      fetchedAt={new Date().toISOString()}
      criticalFailure={criticalFailure}
    />
  );
}
