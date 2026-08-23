import "server-only";
import { isTrustedExternalNewsUrl } from "./google-news";
import { contentPolicyForUrl, urlMatchesSource } from "./sources";

export type ArticleContent = {
  paragraphs: string[];
  originalParagraphs: string[];
  byline: string;
  mode: "excerpt" | "full" | "complete";
  matched: boolean;
};

type ArticleExpectation = {
  source: string;
  originalTitle?: string;
};

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

function headlineFromJsonLd(objects: Record<string, unknown>[]): string {
  for (const object of objects) {
    if (typeof object.headline === "string" && object.headline.trim()) {
      return textFromHtml(object.headline);
    }
  }
  return "";
}

function metaContent(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keyFirst = html.match(
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
  );
  const contentFirst = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`,
      "i",
    ),
  );
  return textFromHtml(keyFirst?.[1] || contentFirst?.[1] || "");
}

function headlineFromHtml(
  html: string,
  objects: Record<string, unknown>[],
): string {
  return (
    headlineFromJsonLd(objects) ||
    metaContent(html, "og:title") ||
    metaContent(html, "twitter:title") ||
    textFromHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
  );
}

function normalizedTitle(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/\s+[-|–—]\s+[^-|–—]{2,80}$/u, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titlesLikelyMatch(expected: string, actual: string): boolean {
  const left = normalizedTitle(expected);
  const right = normalizedTitle(actual);
  if (!left || !right) {
    return true;
  }
  if (left === right || left.includes(right) || right.includes(left)) {
    return true;
  }

  const leftTokens = new Set(left.split(" ").filter((token) => token.length > 2));
  const rightTokens = new Set(
    right.split(" ").filter((token) => token.length > 2),
  );
  const smaller = Math.min(leftTokens.size, rightTokens.size);
  if (smaller === 0) {
    return false;
  }
  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return overlap / smaller >= 0.5;
}

function paragraphsFromHtml(html: string): {
  paragraphs: string[];
  byline: string;
  headline: string;
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

  return {
    paragraphs,
    byline: bylineFromJsonLd(objects),
    headline: headlineFromHtml(html, objects),
  };
}

function paragraphsFromMarkdown(markdown: string): {
  paragraphs: string[];
  byline: string;
  headline: string;
} {
  const content = markdown.includes("Markdown Content:")
    ? markdown.split("Markdown Content:").slice(1).join("Markdown Content:")
    : markdown;
  const headline =
    markdown.match(/^Title:\s*(.+)$/im)?.[1]?.trim() ||
    content.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    "";
  const byline =
    content.match(/^By\s+([^\n]{2,120})$/im)?.[1]?.trim() || "Reuters";
  const blocks = content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_`~]/g, "")
    .split(/\n\s*\n+/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(
      (block) =>
        !/^(title|url source|published time|markdown content):/i.test(block) &&
        !/^(by reuters|reporting by|our standards:|purchase licensing rights)/i.test(
          block,
        ),
    );

  return {
    paragraphs: cleanParagraphs(blocks),
    byline,
    headline,
  };
}

function buildLongExcerpt(paragraphs: string[]): string[] {
  if (paragraphs.length <= 3) {
    return paragraphs;
  }

  // Scale an excerpt with the available article instead of applying a fixed
  // paragraph or character ceiling. Leave at least one paragraph on the
  // publisher page so an excerpt is not presented as the complete article.
  const excerptLength = Math.min(
    paragraphs.length - 1,
    Math.max(10, Math.ceil(paragraphs.length * 0.65)),
  );
  return paragraphs.slice(0, excerptLength);
}

function translatedText(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return "";
  }
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

async function translateToChinese(value: string): Promise<string> {
  if (!value || /[\u3400-\u9fff]/u.test(value)) {
    return value;
  }

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
          headers: { "User-Agent": "WorldPulse/1.0 article translator" },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
          continue;
        }
        const translated = translatedText(await response.json());
        if (translated) {
          return translated;
        }
      } catch {
        // Try again, then continue to the compatible fallback endpoint.
      }
    }
  }

  return value;
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

async function fetchReaderArticleContent(
  originalUrl: string,
  expected: ArticleExpectation,
  mode: ArticleContent["mode"],
  emptyResult: ArticleContent,
): Promise<ArticleContent> {
  const apiKey = process.env.JINA_API_KEY?.trim();
  if (!apiKey || expected.source !== "Reuters") {
    return emptyResult;
  }

  try {
    const response = await fetch(`https://r.jina.ai/${originalUrl}`, {
      headers: {
        Accept: "text/markdown",
        Authorization: `Bearer ${apiKey}`,
        "X-Return-Format": "markdown",
        "X-Target-Selector": "article",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      return emptyResult;
    }

    const extracted = paragraphsFromMarkdown(await response.text());
    if (
      expected.originalTitle &&
      extracted.headline &&
      !titlesLikelyMatch(expected.originalTitle, extracted.headline)
    ) {
      return emptyResult;
    }
    const allowedParagraphs =
      mode === "full" || mode === "complete"
        ? extracted.paragraphs
        : buildLongExcerpt(extracted.paragraphs);

    return {
      paragraphs: await translateParagraphs(allowedParagraphs),
      originalParagraphs: allowedParagraphs,
      byline: extracted.byline,
      mode,
      matched: allowedParagraphs.length > 0,
    };
  } catch {
    return emptyResult;
  }
}

export async function fetchArticleContent(
  originalUrl: string,
  expected: ArticleExpectation,
): Promise<ArticleContent> {
  const mode = contentPolicyForUrl(originalUrl);
  const emptyResult: ArticleContent = {
    paragraphs: [],
    originalParagraphs: [],
    byline: "",
    mode,
    matched: false,
  };
  if (
    !isTrustedExternalNewsUrl(originalUrl) ||
    !urlMatchesSource(originalUrl, expected.source)
  ) {
    return emptyResult;
  }

  const readerFallback = () =>
    fetchReaderArticleContent(originalUrl, expected, mode, emptyResult);

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
      return readerFallback();
    }
    if (
      !isTrustedExternalNewsUrl(response.url) ||
      !urlMatchesSource(response.url, expected.source)
    ) {
      return readerFallback();
    }

    const extracted = paragraphsFromHtml(await response.text());
    if (
      expected.originalTitle &&
      extracted.headline &&
      !titlesLikelyMatch(expected.originalTitle, extracted.headline)
    ) {
      return readerFallback();
    }
    const allowedParagraphs =
      mode === "full" || mode === "complete"
        ? extracted.paragraphs
        : buildLongExcerpt(extracted.paragraphs);

    const result = {
      paragraphs: await translateParagraphs(allowedParagraphs),
      originalParagraphs: allowedParagraphs,
      byline: extracted.byline,
      mode,
      matched: allowedParagraphs.length > 0,
    };
    return result.matched ? result : readerFallback();
  } catch {
    return readerFallback();
  }
}
