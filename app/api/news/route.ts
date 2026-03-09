import { NextResponse } from "next/server";
import SOURCES from "@/config/sources";
import { fetchSource } from "@/lib/fetchers";
import { categorizeAll } from "@/lib/categorizer";
import { deduplicateByUrl } from "@/lib/utils";
import type { NewsApiResponse } from "@/lib/types";

export const revalidate = 900;

export async function GET() {
  const results = await Promise.all(
    SOURCES.filter((s) => s.enabled).map((s) => fetchSource(s))
  );

  const allItems = results.flatMap((r) => r.items);
  const errors = results
    .map((r, i) => ({
      sourceId: SOURCES.filter((s) => s.enabled)[i]?.id ?? "unknown",
      message: r.error ?? "",
    }))
    .filter((e) => e.message);

  const deduped = deduplicateByUrl(allItems);
  const categorized = await categorizeAll(deduped);

  categorized.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const response: NewsApiResponse = {
    items: categorized,
    fetchedAt: new Date().toISOString(),
    errors,
  };

  return NextResponse.json(response);
}
