import { NextRequest, NextResponse } from "next/server";
import { getAllSourceNews, getNewsByCategory } from "../../data/live-news";
import { isNewsCategory } from "../../data/news-categories";
import { encodeNewsStory } from "../../data/news-story";
import { newsSortMode, sortNewsItems } from "../../data/news-sort";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || "";
  if (category && !isNewsCategory(category)) return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  const offset = Math.max(0, Math.min(10000, Number.parseInt(request.nextUrl.searchParams.get("offset") || "0", 10) || 0));
  const news = category && isNewsCategory(category) ? await getNewsByCategory(category) : await getAllSourceNews();
  const ordered = sortNewsItems(news, newsSortMode(request.nextUrl.searchParams.get("sort") || undefined));
  const items = ordered.slice(offset, offset + 24).map((item) => ({ ...item, storyHref: `/news/story?story=${encodeNewsStory(item)}` }));
  return NextResponse.json({ items, nextOffset: offset + items.length, hasMore: offset + items.length < ordered.length });
}
