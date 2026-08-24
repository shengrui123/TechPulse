import "server-only";
import { unstable_cache } from "next/cache";
import { isChineseText } from "./language";
import { trustedSources } from "./sources";
import {
  matchesNewsCategory,
  type NewsCategory,
} from "./news-categories";

export type LiveNewsItem = {
  title: string;
  originalTitle?: string;
  summary: string;
  originalSummary?: string;
  source: string;
  sourceName: string;
  url: string;
  publishedAt: string;
};

export type LiveNewsSource = {
  source: string;
  sourceName: string;
};

const sourceNames: Record<string, string> = {
  Reuters: "路透社",
  "Associated Press": "美联社",
  "Agence France-Presse": "法新社",
  "BBC News": "英国广播公司新闻网",
  "Deutsche Welle": "德国之声",
  "France 24": "法国 24 台",
  "NHK World-Japan": "日本广播协会国际台",
  "CBC News": "加拿大广播公司新闻网",
  "ABC News Australia": "澳大利亚广播公司新闻网",
  "Al Jazeera": "半岛电视台",
  "The Reporter": "报导者",
  "Central News Agency Taiwan": "中央社",
  "The New York Times": "纽约时报",
  "The Washington Post": "华盛顿邮报",
  "The Guardian": "卫报",
  "El País": "西班牙国家报",
  "Le Monde": "世界报",
  "The Hindu": "印度教徒报",
  "Channel NewsAsia": "亚洲新闻台",
  "Initium Media": "端传媒",
  "United Daily News": "联合新闻网",
  Bloomberg: "彭博社",
  "Financial Times": "金融时报",
  "The Wall Street Journal": "华尔街日报",
  "The Economist": "经济学人",
  "Nikkei Asia": "日经亚洲",
  ProPublica: "ProPublica 调查新闻",
};

const newsWindowMs = 24 * 60 * 60 * 1000;
const allSourceNewsWindowMs = newsWindowMs;

function googleNewsFeedUrl(sourceUrl: string): string {
  const domain = new URL(sourceUrl).hostname.replace(/^www\./, "");
  const url = new URL("https://news.google.com/rss/search");
  // Google News fills gaps only when a publisher has not supplied an official
  // RSS endpoint in the source directory.
  url.searchParams.set("q", `site:${domain} when:7d`);
  url.searchParams.set("hl", "en-US");
  url.searchParams.set("gl", "US");
  url.searchParams.set("ceid", "US:en");
  return url.toString();
}

const feeds = trustedSources.map((source) => ({
  source: source.name,
  sourceName: sourceNames[source.name] ?? source.name,
  url: source.rssUrl ?? googleNewsFeedUrl(source.url),
}));

export const liveNewsSourceDirectory: LiveNewsSource[] = feeds.map(
  ({ source, sourceName }) => ({ source, sourceName }),
);

const translationEndpoints = [
  {
    url: "https://clients5.google.com/translate_a/t",
    client: "dict-chrome-ex",
  },
  {
    url: "https://translate.googleapis.com/translate_a/single",
    client: "gtx",
  },
] as const;
const feedConcurrency = 26;
const translationConcurrency = 12;
const translationBatchCharacters = 5000;

function clean(value: string): string {
  let decoded = value.replace(/^<!\[CDATA\[|\]\]>$/g, "");

  // Google News frequently double-encodes publisher suffixes (for example,
  // `&amp;nbsp;`). Decode a few passes so entities exposed by the first pass
  // do not leak into the rendered title or summary.
  for (let pass = 0; pass < 3; pass += 1) {
    const next = decoded
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
        String.fromCharCode(Number.parseInt(code, 16)),
      )
      .replace(/&#(\d+);/g, (_, code: string) =>
        String.fromCharCode(Number(code)),
      );

    if (next === decoded) {
      break;
    }
    decoded = next;
  }

  return decoded
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function field(item: string, name: string): string {
  const match = item.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"),
  );
  return match ? clean(match[1]) : "";
}

function isActualNewsArticle(item: LiveNewsItem): boolean {
  if (item.source !== "Reuters") {
    return true;
  }

  try {
    const url = new URL(item.url);
    const hostname = url.hostname.replace(/^www\./, "");
    return (
      hostname === "reuters.com" &&
      /-[0-9]{4}-[0-9]{2}-[0-9]{2}\/?$/u.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function parseFeed(
  xml: string,
  source: string,
  sourceName: string,
): LiveNewsItem[] {
  const feedPublishedAt =
    field(xml, "lastBuildDate") ||
    field(xml, "pubDate") ||
    field(xml, "updated");
  const items =
    xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ??
    xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi) ??
    [];

  return items
    .map((item) => {
      const atomLink = item.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
      const publishedAt =
        field(item, "pubDate") ||
        field(item, "published") ||
        field(item, "updated") ||
        field(item, "dc:date") ||
        feedPublishedAt;
      const summary =
        field(item, "content:encoded") ||
        field(item, "content") ||
        field(item, "description") ||
        field(item, "summary") ||
        field(item, "media:description");

      const title = field(item, "title");

      return {
        title,
        originalTitle: title,
        // Keep all useful text exposed by the RSS item. A generous ceiling
        // protects the story URL from publisher feeds that embed entire pages.
        summary: summary.length > 4000 ? `${summary.slice(0, 3999)}…` : summary,
        originalSummary:
          summary.length > 4000 ? `${summary.slice(0, 3999)}…` : summary,
        source,
        sourceName,
        url: atomLink?.[1] || field(item, "link") || field(item, "guid"),
        publishedAt,
      };
    })
    .filter(
      (item: LiveNewsItem) =>
        item.title &&
        item.url.startsWith("http") &&
        item.publishedAt &&
        isActualNewsArticle(item),
    );
}

function translatedText(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return "";
  }

  // The lightweight clients5 endpoint returns [["译文", "source-lang"]],
  // while the legacy endpoint returns an array of translation segments.
  if (typeof data[0][0] === "string") {
    return data[0][0].trim();
  }

  return data[0]
    .map((segment: unknown) =>
      Array.isArray(segment) && typeof segment[0] === "string"
        ? segment[0]
        : "",
    )
    .join("")
    .trim();
}

async function requestTranslation(value: string): Promise<string> {
  for (const endpoint of translationEndpoints) {
    const url = new URL(endpoint.url);
    url.searchParams.set("client", endpoint.client);
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", "zh-CN");
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", value);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "WorldPulse/1.0 news translator" },
          next: { revalidate: 86400 },
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          continue;
        }

        const result = translatedText(await response.json());
        if (result) {
          return result;
        }
      } catch {
        // Try the endpoint again, then continue to the compatible fallback.
      }
    }
  }

  return "";
}

type TranslationTarget = {
  itemIndex: number;
  field: "title" | "summary";
  value: string;
};

function translationBatches(items: LiveNewsItem[]): TranslationTarget[][] {
  const batches: TranslationTarget[][] = [];
  let batch: TranslationTarget[] = [];
  let characters = 0;

  items.forEach((item, itemIndex) => {
    (["title", "summary"] as const).forEach((field) => {
      const value = item[field];
      if (!value || isChineseText(value)) {
        return;
      }

      if (
        batch.length > 0 &&
        characters + value.length > translationBatchCharacters
      ) {
        batches.push(batch);
        batch = [];
        characters = 0;
      }

      batch.push({ itemIndex, field, value });
      characters += value.length;
    });
  });

  if (batch.length > 0) {
    batches.push(batch);
  }

  return batches;
}

async function translateBatch(
  batch: TranslationTarget[],
): Promise<string[]> {
  const payload = batch
    .map((target, index) => `[[[WP${index}]]]\n${target.value}`)
    .join("\n");
  const result = await requestTranslation(payload);
  if (!result) {
    return translateTargetsIndividually(batch);
  }

  const matches = [
    ...result.matchAll(/\[\[\[\s*WP\s*(\d+)\s*\]\]\]/gi),
  ];

  if (matches.length === batch.length) {
    const values = matches.map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = matches[index + 1]?.index ?? result.length;
      return result.slice(start, end).trim();
    });

    const missed = batch
      .map((target, index) => ({ target, index }))
      .filter(({ target, index }) =>
        !isChineseText(target.value) && !isChineseText(values[index]),
      );

    if (missed.length > 0) {
      const replacements = await translateTargetsIndividually(
        missed.map(({ target }) => target),
      );
      missed.forEach(({ index }, replacementIndex) => {
        values[index] = replacements[replacementIndex];
      });
    }

    return values;
  }

  return translateTargetsIndividually(batch);
}

async function translateTargetsIndividually(
  targets: TranslationTarget[],
): Promise<string[]> {
  const results = targets.map((target) => target.value);
  let nextTarget = 0;

  async function worker() {
    while (nextTarget < targets.length) {
      const index = nextTarget;
      nextTarget += 1;
      const translated = await requestTranslation(targets[index].value);
      if (translated) {
        results[index] = translated;
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(translationConcurrency, targets.length) },
      () => worker(),
    ),
  );

  return results;
}

async function translateNewsItems(items: LiveNewsItem[]) {
  const translated = items.map((item) => ({ ...item }));
  const batches = translationBatches(items);
  let nextBatch = 0;

  async function worker() {
    while (nextBatch < batches.length) {
      const index = nextBatch;
      nextBatch += 1;
      const batch = batches[index];
      const values = await translateBatch(batch);

      batch.forEach((target, valueIndex) => {
        translated[target.itemIndex][target.field] =
          values[valueIndex] || target.value;
      });
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(translationConcurrency, batches.length) },
      () => worker(),
    ),
  );

  return translated;
}

async function fetchFeed(
  feed: (typeof feeds)[number],
): Promise<LiveNewsItem[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(feed.url, {
        headers: { "User-Agent": "WorldPulse/1.0 news reader" },
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`${feed.source} returned ${response.status}`);
      }

      return parseFeed(await response.text(), feed.source, feed.sourceName);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function fetchAllFeeds() {
  const responses = new Array<PromiseSettledResult<LiveNewsItem[]>>(
    feeds.length,
  );
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < feeds.length) {
      const index = nextIndex;
      nextIndex += 1;

      try {
        responses[index] = {
          status: "fulfilled",
          value: await fetchFeed(feeds[index]),
        };
      } catch (reason) {
        responses[index] = { status: "rejected", reason };
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(feedConcurrency, feeds.length) },
      () => worker(),
    ),
  );

  return responses;
}

export async function getLatestInternationalNews(limit?: number) {
  const responses = await fetchAllFeeds();

  const unique = new Map<string, LiveNewsItem>();
  const now = Date.now();
  const cutoff = now - newsWindowMs;

  responses.forEach((response) => {
    if (response.status !== "fulfilled") {
      return;
    }

    response.value.forEach((item) => {
      const publishedAt = new Date(item.publishedAt).getTime();
      if (
        !Number.isFinite(publishedAt) ||
        publishedAt < cutoff ||
        publishedAt > now
      ) {
        return;
      }

      const key = item.url.toLocaleLowerCase();
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });
  });

  const sorted = [...unique.values()].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime(),
  );

  const selected =
    typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  return translateNewsItems(selected);
}

async function buildAllSourceNews(): Promise<LiveNewsItem[]> {
  const responses = await fetchAllFeeds();
  const now = Date.now();
  const cutoff = now - allSourceNewsWindowMs;
  const unique = new Map<string, LiveNewsItem>();

  responses.forEach((response) => {
    if (response.status !== "fulfilled") {
      return;
    }

    response.value
      .filter((item) => {
        const publishedAt = new Date(item.publishedAt).getTime();
        return (
          Number.isFinite(publishedAt) &&
          publishedAt >= cutoff &&
          publishedAt <= now
        );
      })
      .sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() -
          new Date(left.publishedAt).getTime(),
      )
      .forEach((item) => {
        const key = item.url.toLocaleLowerCase();
        if (!unique.has(key)) {
          unique.set(key, item);
        }
      });
  });

  const sorted = [...unique.values()].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime(),
  );

  return translateNewsItems(sorted);
}

export const getAllSourceNews = unstable_cache(
  buildAllSourceNews,
  ["worldpulse-all-source-news-24h-v9"],
  { revalidate: 1800, tags: ["all-source-news"] },
);

async function buildSourceEdition(): Promise<LiveNewsItem[]> {
  const responses = await fetchAllFeeds();
  const now = Date.now();
  const cutoff = now - newsWindowMs;
  const onePerSource: LiveNewsItem[] = [];

  responses.forEach((response) => {
    if (response.status !== "fulfilled") {
      return;
    }

    const latest = response.value
      .filter((item) => {
        const publishedAt = new Date(item.publishedAt).getTime();
        return (
          Number.isFinite(publishedAt) &&
          publishedAt >= cutoff &&
          publishedAt <= now
        );
      })
      .sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() -
          new Date(left.publishedAt).getTime(),
      )[0];

    if (latest) {
      onePerSource.push(latest);
    }
  });

  return translateNewsItems(onePerSource);
}

export const getSourceEdition = unstable_cache(
  buildSourceEdition,
  ["worldpulse-source-edition-24h-v9"],
  { revalidate: 900, tags: ["source-edition"] },
);

export async function getNewsByCategory(category: NewsCategory) {
  const news = await getLatestInternationalNews();
  return news.filter((item) =>
    matchesNewsCategory(category, item.title, item.summary),
  );
}

export function formatNewsDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}
