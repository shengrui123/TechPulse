import "server-only";

export type LiveNewsItem = {
  title: string;
  summary: string;
  source: string;
  sourceName: string;
  url: string;
  publishedAt: string;
};

const feeds = [
  {
    source: "BBC News",
    sourceName: "英國廣播公司新聞網",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
  {
    source: "The Guardian",
    sourceName: "衛報",
    url: "https://www.theguardian.com/world/rss",
  },
  {
    source: "The New York Times",
    sourceName: "紐約時報",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  },
  {
    source: "Financial Times",
    sourceName: "金融時報",
    url: "https://www.ft.com/world?format=rss",
  },
] as const;

const translationEndpoint =
  "https://translate.googleapis.com/translate_a/single";
const translationConcurrency = 8;

function clean(value: string): string {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
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

function parseFeed(
  xml: string,
  source: string,
  sourceName: string,
): LiveNewsItem[] {
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
        field(item, "dc:date");
      const summary =
        field(item, "description") ||
        field(item, "summary") ||
        field(item, "media:description");

      return {
        title: field(item, "title"),
        summary: summary.length > 360 ? `${summary.slice(0, 357)}…` : summary,
        source,
        sourceName,
        url: atomLink?.[1] || field(item, "link") || field(item, "guid"),
        publishedAt,
      };
    })
    .filter(
      (item: LiveNewsItem) =>
        item.title && item.url.startsWith("http") && item.publishedAt,
    );
}

function translatedText(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return "";
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

async function translateToChinese(value: string): Promise<string> {
  if (!value || /[\u3400-\u9fff]/u.test(value)) {
    return value;
  }

  const url = new URL(translationEndpoint);
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", "zh-CN");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", value);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "WorldPulse/1.0 news translator" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return value;
    }

    return translatedText(await response.json()) || value;
  } catch {
    return value;
  }
}

async function translateNewsItem(
  item: LiveNewsItem,
): Promise<LiveNewsItem> {
  const [title, summary] = await Promise.all([
    translateToChinese(item.title),
    translateToChinese(item.summary),
  ]);

  return { ...item, title, summary };
}

async function translateNewsItems(
  items: LiveNewsItem[],
): Promise<LiveNewsItem[]> {
  const translated = new Array<LiveNewsItem>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      translated[index] = await translateNewsItem(items[index]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(translationConcurrency, items.length) },
      () => worker(),
    ),
  );

  return translated;
}

export async function getLatestInternationalNews() {
  const responses = await Promise.allSettled(
    feeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: { "User-Agent": "WorldPulse/1.0 news reader" },
        next: { revalidate: 900 },
      });

      if (!response.ok) {
        throw new Error(`${feed.source} returned ${response.status}`);
      }

      return parseFeed(await response.text(), feed.source, feed.sourceName);
    }),
  );

  const unique = new Map<string, LiveNewsItem>();

  responses.forEach((response) => {
    if (response.status !== "fulfilled") {
      return;
    }

    response.value.forEach((item) => {
      const key = item.title.toLocaleLowerCase();
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
