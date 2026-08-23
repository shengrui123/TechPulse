import "server-only";
import type { LiveNewsItem } from "./live-news";
import { isSupportedNewsUrl } from "./google-news";

export type NewsStory = Pick<
  LiveNewsItem,
  | "title"
  | "originalTitle"
  | "summary"
  | "source"
  | "sourceName"
  | "url"
  | "publishedAt"
>;

function cleanStoryText(value: string): string {
  let decoded = value;

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

  return decoded.replace(/\s+/g, " ").trim();
}

export function encodeNewsStory(item: LiveNewsItem): string {
  const story: NewsStory = {
    title: item.title,
    originalTitle: item.originalTitle,
    summary: item.summary,
    source: item.source,
    sourceName: item.sourceName,
    url: item.url,
    publishedAt: item.publishedAt,
  };

  return Buffer.from(JSON.stringify(story), "utf8").toString("base64url");
}

export function decodeNewsStory(value: string): NewsStory | null {
  try {
    const story = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<NewsStory>;

    if (
      typeof story.title !== "string" ||
      !story.title ||
      story.title.length > 500 ||
      typeof story.summary !== "string" ||
      story.summary.length > 1000 ||
      (story.originalTitle !== undefined &&
        (typeof story.originalTitle !== "string" ||
          story.originalTitle.length > 500)) ||
      typeof story.source !== "string" ||
      story.source.length > 100 ||
      typeof story.sourceName !== "string" ||
      story.sourceName.length > 100 ||
      typeof story.url !== "string" ||
      !isSupportedNewsUrl(story.url) ||
      typeof story.publishedAt !== "string" ||
      !Number.isFinite(new Date(story.publishedAt).getTime())
    ) {
      return null;
    }

    return {
      ...(story as NewsStory),
      title: cleanStoryText(story.title),
      originalTitle: story.originalTitle
        ? cleanStoryText(story.originalTitle)
        : undefined,
      summary: cleanStoryText(story.summary),
    };
  } catch {
    return null;
  }
}
