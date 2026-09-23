"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { LiveNewsItem } from "../data/live-news";
import {
  sortNewsItems,
  type NewsSortMode,
} from "../data/news-sort";

export type SearchableNewsItem = LiveNewsItem & {
  storyHref: string;
};

type SourceNewsBrowserProps = {
  news: SearchableNewsItem[];
  sortMode?: NewsSortMode;
};

function formatNewsDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export default function SourceNewsBrowser({
  news,
  sortMode = "importance",
}: SourceNewsBrowserProps) {
  const orderedNews = useMemo(
    () =>
      sortNewsItems(news, sortMode),
    [news, sortMode],
  );

  return (
    <main>
      <section className="page-shell news-stream" aria-label="浏览国际新闻">
        <div className="news-results-heading">
          <div>
            <span>ALL PUBLISHERS</span>
            <h1>最新报道</h1>
          </div>
          <strong>{orderedNews.length} 条</strong>
        </div>

        {orderedNews.length > 0 ? (
          <div className="news-waterfall">
            {orderedNews.map((item, index) => (
              <article className="news-card" key={`${item.source}-${item.url}`}>
                <Link href={item.storyHref} aria-label={`阅读：${item.title}`}>
                  <div className="news-card-meta">
                    <span>{item.sourceName}</span>
                    <time dateTime={item.publishedAt}>
                      {formatNewsDate(item.publishedAt)}
                    </time>
                  </div>
                  <figure className="news-card-image">
                    <Image
                      src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=4`}
                      alt={`${item.title} 新闻图片`}
                      width={800}
                      height={450}
                      sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
                      priority={index < 3}
                      unoptimized
                    />
                  </figure>
                  <h2>{item.title}</h2>
                  {item.summary && <p>{item.summary}</p>}
                  <strong>阅读新闻 →</strong>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty news-search-empty">
            <span aria-hidden="true">00</span>
            <h2>暂无近期报道</h2>
          </div>
        )}
      </section>
    </main>
  );
}
