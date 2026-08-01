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
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|div|li|blockquote|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

const paragraphNoise =
  /^(sign up|subscribe|advertisement|read more|copyright|all rights reserved|related (?:stories|articles)|recommended|follow us|share this|newsletter|cookie|accept all)/i;

function sentenceParts(value: string): string[] {
  return (
    value.match(/[^。！？.!?]+[。！？.!?]+[”’」』】)]*|[^。！？.!?]+$/gu) ??
    [value]
  )
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Some publishers expose articleBody as one very long string. Keep publisher
 * paragraphs when present, otherwise group complete sentences into readable
 * paragraphs instead of rendering a wall of text.
 */
function readableParagraphs(value: string): string[] {
  const blocks = value
    .split(/\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.flatMap((block) => {
    if (block.length <= 620) {
      return [block];
    }

    const result: string[] = [];
    let paragraph = "";
    for (const sentence of sentenceParts(block)) {
      if (paragraph && paragraph.length + sentence.length > 520) {
        result.push(paragraph);
        paragraph = "";
      }
      paragraph += sentence;
    }
    if (paragraph) {
      result.push(paragraph);
    }
    return result;
  });
}

function paragraphTags(value: string): string[] {
  return [...value.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].flatMap(
    (match) => readableParagraphs(textFromHtml(match[1])),
  );
}

function semanticRegions(html: string): string[] {
  const regions: string[] = [];
  const elementPattern = /<(article|main)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(elementPattern)) {
    regions.push(match[2]);
  }

  // Common article-body wrappers on publishers that do not use <article>.
  const bodyPattern =
    /<(?:div|section)\b[^>]*(?:itemprop=["']articleBody["']|class=["'][^"']*(?:article-body|article-content|story-body|post-content|entry-content)[^"']*["'])[^>]*>([\s\S]*?)<\/(?:div|section)>/gi;
  for (const match of html.matchAll(bodyPattern)) {
    regions.push(match[1]);
  }
  return regions;
}

function cleanParagraphs(rawParagraphs: string[]): string[] {
  const seen = new Set<string>();
  return rawParagraphs
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => {
      if (
        paragraph.length < 35 ||
        paragraph.length > 1200 ||
        paragraphNoise.test(paragraph) ||
        seen.has(paragraph)
      ) {
        return false;
      }
      seen.add(paragraph);
      return true;
    });
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

  const jsonLdParagraphs = articleBody
    ? cleanParagraphs(readableParagraphs(textFromHtml(articleBody)))
    : [];
  const regionCandidates = semanticRegions(html)
    .map((region) => cleanParagraphs(paragraphTags(region)))
    .filter((paragraphs) => paragraphs.length > 0)
    .sort(
      (left, right) =>
        right.reduce((sum, paragraph) => sum + paragraph.length, 0) -
        left.reduce((sum, paragraph) => sum + paragraph.length, 0),
    );
  const semanticParagraphs = regionCandidates[0] ?? [];
  const fallbackParagraphs = cleanParagraphs(paragraphTags(html));
  const paragraphs =
    jsonLdParagraphs.length >= 2
      ? jsonLdParagraphs
      : semanticParagraphs.length >= 2
        ? semanticParagraphs
        : fallbackParagraphs;

  return { paragraphs, byline: bylineFromJsonLd(objects) };
}

function limitExcerpt(paragraphs: string[]): string[] {
  const selected: string[] = [];
  let characters = 0;

  for (const paragraph of paragraphs) {
    if (selected.length >= 7 || characters >= 2600) {
      break;
    }
    const remaining = 2600 - characters;
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
      cache: "no-store",
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
      cache: "no-store",
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
