"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { LiveNewsItem } from "../data/live-news";
import type { NewsSortMode } from "../data/news-sort";
import LoadMoreTrigger from "./LoadMoreTrigger";

type Item = LiveNewsItem & { storyHref: string };
export default function InfiniteNews({ category, sortMode, initialCount, initialUrls, total }: { category?: string; sortMode: NewsSortMode; initialCount: number; initialUrls: string[]; total: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(initialCount < total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const offset = useRef(initialCount);
  const pending = useRef(false);
  const seen = useRef(new Set(initialUrls));
  async function load() {
    if (pending.current || !hasMore) return;
    pending.current = true;
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ offset: String(offset.current), sort: sortMode });
      if (category) params.set("category", category);
      const response = await fetch(`/api/news-batch?${params}`);
      if (!response.ok) throw new Error("Unable to load news");
      const batch: { items: Item[]; nextOffset: number; hasMore: boolean } = await response.json();
      const fresh = batch.items.filter((item) => { if (seen.current.has(item.url)) return false; seen.current.add(item.url); return true; });
      offset.current = batch.nextOffset;
      setItems((current) => [...current, ...fresh]);
      setHasMore(batch.hasMore);
    } catch { setError(true); } finally { pending.current = false; setLoading(false); }
  }
  return <>
    {items.map((item) => <article className="news-card" key={item.url}>
      <Link prefetch={false} href={item.storyHref} aria-label={`阅读：${item.title}`}>
        <div className="news-card-meta"><span>{item.sourceName}</span><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai" }).format(new Date(item.publishedAt))}</time></div>
        <figure className="news-card-image"><Image src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=4`} alt={`${item.title} 新闻图片`} width={800} height={450} sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw" unoptimized /></figure>
        <h2>{item.title}</h2>{item.summary && <p>{item.summary}</p>}<strong>阅读新闻 →</strong>
      </Link>
    </article>)}
    {hasMore && <LoadMoreTrigger onLoad={load} loading={loading} error={error} />}
  </>;
}
