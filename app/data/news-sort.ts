import type { LiveNewsItem } from "./live-news";

export type NewsSortMode = "time" | "importance";

export function newsSortMode(value: string | undefined): NewsSortMode {
  return value === "time" ? "time" : "importance";
}

const criticalSignals =
  /突发|紧急|战争|袭击|冲突|制裁|政变|地震|海啸|洪水|野火|死亡|危机|breaking|urgent|war|attack|conflict|sanction|coup|earthquake|flood|wildfire|crisis/i;
const publicImpactSignals =
  /总统|总理|政府|议会|选举|法院|央行|利率|通胀|关税|贸易|能源|人工智能|芯片|气候|疫情|president|prime minister|government|election|court|central bank|interest rate|inflation|tariff|trade|energy|artificial intelligence|chip|climate|pandemic/i;
const internationalSignals =
  /国际|全球|联合国|北约|欧盟|外交|跨国|international|global|united nations|nato|european union|diploma/i;

const highAuthoritySources = new Set([
  "Reuters",
  "Associated Press",
  "Agence France-Presse",
  "BBC News",
  "Central News Agency Taiwan",
]);

export function newsImportanceScore(item: LiveNewsItem): number {
  const text = `${item.originalTitle ?? item.title} ${item.originalSummary ?? item.summary}`;
  let score = 0;
  if (criticalSignals.test(text)) score += 8;
  if (publicImpactSignals.test(text)) score += 5;
  if (internationalSignals.test(text)) score += 3;
  if (highAuthoritySources.has(item.source)) score += 2;
  if ((item.originalSummary ?? item.summary).length >= 180) score += 1;
  return score;
}

export function sortNewsItems<T extends LiveNewsItem>(
  news: T[],
  mode: NewsSortMode,
): T[] {
  return [...news].sort((left, right) => {
    if (mode === "importance") {
      const scoreDifference =
        newsImportanceScore(right) - newsImportanceScore(left);
      if (scoreDifference !== 0) return scoreDifference;
    }
    return (
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime()
    );
  });
}
