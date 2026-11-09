"use client";

import NewsImage from "./NewsImage";
import MasonryGrid from "./MasonryGrid";
import LoadMoreTrigger from "./LoadMoreTrigger";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { LiveNewsItem, LiveNewsSource } from "../data/live-news";
import {
  sortNewsItems,
  type NewsSortMode,
} from "../data/news-sort";

export type SearchableNewsItem = LiveNewsItem & {
  storyHref: string;
};

type SourceNewsBrowserProps = {
  news: SearchableNewsItem[];
  sources: LiveNewsSource[];
  sortMode?: NewsSortMode;
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
  sortMode = "importance",
}: SourceNewsBrowserProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [searchOpen, setSearchOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  useEffect(() => {
    function syncSearch() {
      const isOpen = window.location.hash === "#source-search";
      setSearchOpen(isOpen);
      if (!isOpen) setQuery("");
    }

    function openSearch() {
      setSearchOpen(true);
    }

    syncSearch();
    window.addEventListener("hashchange", syncSearch);
    window.addEventListener("popstate", syncSearch);
    window.addEventListener("worldpulse-search-open", openSearch);
    return () => {
      window.removeEventListener("hashchange", syncSearch);
      window.removeEventListener("popstate", syncSearch);
      window.removeEventListener("worldpulse-search-open", openSearch);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("source-search")?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchOpen]);

  const orderedNews = useMemo(
    () =>
      sortNewsItems(news, sortMode),
    [news, sortMode],
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
    if (!normalizedQuery) return orderedNews;
    const matches = new Set(matchedSources.map(({ source }) => source));
    return orderedNews.filter((item) => matches.has(item.source));
  }, [matchedSources, normalizedQuery, orderedNews]);

  const selectedSource =
    matchedSources.length === 1 ? matchedSources[0] : undefined;
  const closeHref = sortMode === "time" ? "/news?sort=time" : "/news";

  return (
    <main>
      <section
        className={`page-shell source-search ${searchOpen ? "is-open" : ""}`}
        id="source-search"
        aria-label="搜索媒体来源"
      >
        <div className="source-search-copy">
          <p className="eyebrow">SEARCH BY PUBLISHER</p>
          <h2>按媒体查看报道</h2>
          <p>输入中文或英文媒体名称，筛选该来源的近期报道。</p>
          <Link className="source-search-close" href={closeHref} onClick={() => { setQuery(""); setSearchOpen(false); }}>关闭搜索</Link>
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
            {query && <button type="button" onClick={() => setQuery("")}>清除</button>}
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
      <section className="page-shell news-stream" aria-label="浏览国际新闻">
        <div className="news-results-heading" aria-live="polite">
          <div>
            <span>{selectedSource ? selectedSource.source : query ? `匹配“${query}”` : "ALL PUBLISHERS"}</span>
            <h1>{selectedSource ? `${selectedSource.sourceName} 的全部报道` : "最新报道"}</h1>
          </div>
          <strong>{filteredNews.length} 条{selectedSource?.source === "The Reporter" ? " · 近 7 天" : ""}</strong>
        </div>

        {filteredNews.length > 0 ? (
          <MasonryGrid>
            {filteredNews.slice(0, visibleCount).map((item, index) => (
              <article className="news-card" key={`${item.source}-${item.url}`}>
                <Link prefetch={false} href={item.storyHref} aria-label={`阅读：${item.title}`}>
                  <div className="news-card-meta">
                    <span>{item.sourceName}</span>
                    <time dateTime={item.publishedAt}>
                      {formatNewsDate(item.publishedAt)}
                    </time>
                  </div>
                  <figure className="news-card-image">
                    <NewsImage
                      source={item.source}
                      src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=6`}
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
          </MasonryGrid>
        ) : (
          <div className="news-empty news-search-empty">
            <span aria-hidden="true">00</span>
            <h2>{query ? "没有找到这家媒体的近期报道" : "暂无近期报道"}</h2>
            {query && <button type="button" onClick={() => setQuery("")}>查看全部新闻</button>}
          </div>
        )}
        {visibleCount < filteredNews.length && <LoadMoreTrigger onLoad={() => setVisibleCount((count) => count + 24)} revision={`${normalizedQuery}:${visibleCount}`} />}
      </section>
    </main>
  );
}
