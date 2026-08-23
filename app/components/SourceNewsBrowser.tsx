"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { LiveNewsItem, LiveNewsSource } from "../data/live-news";

export type SearchableNewsItem = LiveNewsItem & {
  storyHref: string;
};

type SourceNewsBrowserProps = {
  news: SearchableNewsItem[];
  sources: LiveNewsSource[];
  heading?: string;
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

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
  sources,
  heading = "全部新闻",
}: SourceNewsBrowserProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  const orderedNews = useMemo(
    () =>
      [...news].sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() -
          new Date(left.publishedAt).getTime(),
      ),
    [news],
  );

  const orderedSources = useMemo(
    () =>
      [...sources].sort((left, right) =>
        left.sourceName.localeCompare(right.sourceName, "zh-CN"),
      ),
    [sources],
  );

  const matchedSources = useMemo(
    () =>
      normalizedQuery
        ? orderedSources.filter(
            ({ source, sourceName }) =>
              normalize(source).includes(normalizedQuery) ||
              normalize(sourceName).includes(normalizedQuery),
          )
        : orderedSources,
    [normalizedQuery, orderedSources],
  );

  const filteredNews = useMemo(() => {
    if (!normalizedQuery) {
      return orderedNews;
    }
    const matches = new Set(matchedSources.map(({ source }) => source));
    return orderedNews.filter((item) => matches.has(item.source));
  }, [matchedSources, normalizedQuery, orderedNews]);

  const selectedSource =
    matchedSources.length === 1 ? matchedSources[0] : undefined;
  const activeSourceCount = new Set(
    filteredNews.map((item) => item.source),
  ).size;

  return (
    <main>
      <header className="page-shell news-hero source-news-hero">
        <p className="eyebrow">SEARCH THE GLOBAL EDITION</p>
        <div>
          <h1>{heading}</h1>
          <p>
            汇总“信源标准”收录媒体的近期报道。输入中文或英文媒体名称，即可查看该来源当前的全部新闻。
          </p>
        </div>
        <div className="news-hero-meta">
          <span>
            {filteredNews.length} 条 · {activeSourceCount}/{matchedSources.length} 家已更新
          </span>
        </div>
      </header>

      <section
        className="page-shell source-search"
        id="source-search"
        aria-labelledby="source-search-title"
      >
        <div className="source-search-copy">
          <p className="eyebrow">SEARCH BY PUBLISHER</p>
          <h2 id="source-search-title">按媒体查看报道</h2>
          <p>支持中英文媒体名称，结果会随输入即时更新。</p>
        </div>

        <div className="source-search-controls">
          <label htmlFor="source-query">搜索媒体来源</label>
          <div className="source-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="source-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例如：路透社、BBC News"
              autoComplete="off"
              list="news-sources"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                清除
              </button>
            )}
          </div>
          <datalist id="news-sources">
            {orderedSources.map(({ source, sourceName }) => (
              <option value={sourceName} label={source} key={source} />
            ))}
          </datalist>

          <div className="source-filter-list" aria-label="信源标准收录的全部媒体">
            <button
              type="button"
              className={!query ? "is-active" : ""}
              aria-pressed={!query}
              onClick={() => setQuery("")}
            >
              全部媒体
            </button>
            {orderedSources.map(({ source, sourceName }) => {
              const isActive =
                normalize(query) === normalize(source) ||
                normalize(query) === normalize(sourceName);
              return (
                <button
                  type="button"
                  className={isActive ? "is-active" : ""}
                  aria-pressed={isActive}
                  onClick={() => setQuery(sourceName)}
                  key={source}
                >
                  {sourceName}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-shell news-stream" aria-label="搜索与浏览国际新闻">
        <div className="news-results-heading" aria-live="polite">
          <div>
            <span>
              {selectedSource
                ? selectedSource.source
                : query
                  ? `匹配“${query}”`
                  : "ALL PUBLISHERS"}
            </span>
            <h2>
              {selectedSource
                ? `${selectedSource.sourceName} 的全部报道`
                : "最新报道"}
            </h2>
          </div>
          <strong>{filteredNews.length} 条</strong>
        </div>

        {filteredNews.length > 0 ? (
          <div className="news-waterfall">
            {filteredNews.map((item, index) => (
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
                      src={`/api/news-image?url=${encodeURIComponent(item.url)}&v=2`}
                      alt={`${item.title} 新闻图片`}
                      width={800}
                      height={450}
                      sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
                      priority={index < 3}
                      unoptimized
                    />
                  </figure>
                  <span className="news-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
            <h2>没有找到这家媒体的近期报道</h2>
            <p>请尝试完整媒体名称，或从上方来源中直接选择。</p>
            <button type="button" onClick={() => setQuery("")}>
              查看全部新闻
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
