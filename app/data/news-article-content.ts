import "server-only";
import { isTrustedExternalNewsUrl } from "./google-news";
import { contentPolicyForUrl } from "./sources";

export type ArticleContent = {
  paragraphs: string[];
  byline: string;
  mode: "excerpt" | "full";
};

const translationEndpoint =
  "https://translate.googleapis.com/translate_a/single";

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    );
}

function textFromHtml(value: string): string {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdObjects(html: string): Record<string, unknown>[] {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const objects: Record<string, unknown>[] = [];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(decodeEntities(block[1])) as unknown;
      const candidates = Array.isArray(parsed)
        ? parsed
        : typeof parsed === "object" && parsed && "@graph" in parsed
          ? (parsed as { "@graph": unknown[] })["@graph"]
          : [parsed];

      candidates.forEach((candidate) => {
        if (candidate && typeof candidate === "object") {
          objects.push(candidate as Record<string, unknown>);
        }
      });
    } catch {
      // Publishers occasionally emit malformed JSON-LD; HTML paragraphs remain
      // available as the fallback below.
    }
  }

  return objects;
}

function bylineFromJsonLd(objects: Record<string, unknown>[]): string {
  for (const object of objects) {
    const author = object.author;
    const authors = Array.isArray(author) ? author : author ? [author] : [];
    const names = authors
      .map((item) =>
        typeof item === "string"
          ? item
          : item && typeof item === "object" && "name" in item
            ? String((item as { name: unknown }).name)
            : "",
      )
      .filter(Boolean);
    if (names.length) {
      return names.join("、");
    }
  }
  return "";
}

function paragraphsFromHtml(html: string): {
  paragraphs: string[];
  byline: string;
} {
  const objects = jsonLdObjects(html);
  const articleBody = objects
    .map((object) =>
      typeof object.articleBody === "string" ? object.articleBody : "",
    )
    .find(Boolean);

  const rawParagraphs = articleBody
    ? articleBody.split(/\n{2,}|(?<=[.!?。！？])\s+(?=[A-Z\u3400-\u9fff])/u)
    : [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map(
        (match) => match[1],
      );

  const seen = new Set<string>();
  const paragraphs = rawParagraphs
    .map(textFromHtml)
    .filter((paragraph) => {
      if (
        paragraph.length < 45 ||
        paragraph.length > 4000 ||
        /^(sign up|subscribe|advertisement|read more|copyright|all rights reserved)/i.test(
          paragraph,
        ) ||
        seen.has(paragraph)
      ) {
        return false;
      }
      seen.add(paragraph);
      return true;
    });

  return { paragraphs, byline: bylineFromJsonLd(objects) };
}

function limitExcerpt(paragraphs: string[]): string[] {
  const selected: string[] = [];
  let characters = 0;

  for (const paragraph of paragraphs) {
    if (selected.length >= 4 || characters >= 1200) {
      break;
    }
    const remaining = 1200 - characters;
    selected.push(
      paragraph.length > remaining
        ? `${paragraph.slice(0, Math.max(0, remaining - 1)).trim()}…`
        : paragraph,
    );
    characters += selected.at(-1)?.length ?? 0;
  }

  return selected;
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

  try {
    const url = new URL(translationEndpoint);
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", "zh-CN");
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", value);
    const response = await fetch(url, {
      headers: { "User-Agent": "WorldPulse/1.0 article translator" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    return response.ok
      ? translatedText(await response.json()) || value
      : value;
  } catch {
    return value;
  }
}

async function translateParagraphs(paragraphs: string[]) {
  const result = new Array<string>(paragraphs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < paragraphs.length) {
      const index = nextIndex;
      nextIndex += 1;
      result[index] = await translateToChinese(paragraphs[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(4, paragraphs.length) }, () => worker()),
  );
  return result;
}

export async function fetchArticleContent(
  originalUrl: string,
): Promise<ArticleContent> {
  const mode = contentPolicyForUrl(originalUrl);
  if (!isTrustedExternalNewsUrl(originalUrl)) {
    return { paragraphs: [], byline: "", mode };
  }

  try {
    const response = await fetch(originalUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 WorldPulse article reader",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      return { paragraphs: [], byline: "", mode };
    }

    const extracted = paragraphsFromHtml(await response.text());
    const allowedParagraphs =
      mode === "full"
        ? extracted.paragraphs.slice(0, 80)
        : limitExcerpt(extracted.paragraphs);

    return {
      paragraphs: await translateParagraphs(allowedParagraphs),
      byline: extracted.byline,
      mode,
    };
  } catch {
    return { paragraphs: [], byline: "", mode };
  }
}
