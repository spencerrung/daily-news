import Anthropic from "@anthropic-ai/sdk";
import { TAG_RULES, KNOWN_TAGS } from "@/config/tags";
import type { NewsItem } from "./types";

function applyKeywordRules(item: NewsItem): string[] {
  const lower = item.title.toLowerCase();
  const matched: string[] = [];

  for (const [tag, keywords] of Object.entries(TAG_RULES)) {
    if (tag === "Other") continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(tag);
    }
  }
  return matched;
}

async function batchLLMCategorize(
  items: NewsItem[]
): Promise<Map<string, string[]>> {
  const result = new Map<string, string[]>();
  if (items.length === 0) return result;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return result;

  const client = new Anthropic({ apiKey });
  const CHUNK_SIZE = 50;
  const tagList = KNOWN_TAGS.filter((t) => t !== "Other").join(", ");

  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    const titlesText = chunk
      .map((item, idx) => `${idx + 1}. ${item.title}`)
      .join("\n");

    const prompt = `Assign tags from [${tagList}] to each news headline.
Respond ONLY with valid JSON array: [{"index":1,"tags":["AI/ML"]}, ...]
Use "Other" if no tags fit. Multiple tags are allowed.

Headlines:
${titlesText}`;

    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) continue;

      const parsed: { index: number; tags: string[] }[] = JSON.parse(
        jsonMatch[0]
      );
      for (const entry of parsed) {
        const item = chunk[entry.index - 1];
        if (item) {
          const validTags = entry.tags.filter((t) =>
            KNOWN_TAGS.includes(t as (typeof KNOWN_TAGS)[number])
          );
          result.set(item.id, validTags);
        }
      }
    } catch {
      // LLM failure — items remain uncategorized
    }
  }

  return result;
}

export async function categorizeAll(items: NewsItem[]): Promise<NewsItem[]> {
  // Phase 1: keyword rules
  const withRules = items.map((item) => {
    const tags = applyKeywordRules(item);
    return tags.length > 0
      ? { ...item, tags, categorizedBy: "rules" as const }
      : item;
  });

  // Phase 2: LLM fallback for uncategorized
  const uncategorized = withRules.filter((item) => item.tags.length === 0);
  const llmTags = await batchLLMCategorize(uncategorized);

  return withRules.map((item) => {
    if (item.tags.length > 0) return item;
    const tags = llmTags.get(item.id);
    if (tags && tags.length > 0) {
      return { ...item, tags, categorizedBy: "llm" as const };
    }
    return { ...item, tags: ["Other"], categorizedBy: "none" as const };
  });
}
