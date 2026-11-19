import NewsImage from "./NewsImage";
import InfiniteNews from "./InfiniteNews";
import MasonryGrid from "./MasonryGrid";
import Link from "next/link";
import {
  formatNewsDate,
  type LiveNewsItem,
} from "../data/live-news";
import { sortNewsItems, type NewsSortMode } from "../data/news-sort";
import { encodeNewsStory } from "../data/news-story";
import { newsCategories } from "../data/news-categories";
import { trustedSources } from "../data/sources";

type NewsStreamProps = {
  news: LiveNewsItem[];
  showMore?: boolean;
  magazineEdition?: boolean;
  heading?: string;
  description?: string;
  hideHeader?: boolean;
  frontPage?: boolean;
  sortMode?: NewsSortMode;
  category?: string;
};

function storyHref(item: LiveNewsItem) {
  return `/news/story?story=${encodeNewsStory(item)}`;
}

function NewsCard({
  item,
  priority = false,
  coverEditorial = false,
  sizes = "(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw",
}: {
  item: LiveNewsItem;
  priority?: boolean;
  coverEditorial?: boolean;
  sizes?: string;
}) {
  return (
    <article className="news-card">
      <Link prefetch={false} href={storyHref(item)} aria-label={`阅读：${item.title}`}>
        <div className="news-card-meta">
          <span>{item.sourceName}</span>
          <time dateTime={item.publishedAt}>{formatNewsDate(item.publishedAt)}</time>
        </div>
        <figure className="news-card-image">
          <NewsImage
            source={item.source}
            src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=7${coverEditorial ? "&cover=editorial" : ""}`}
            alt={`${item.title} 新闻图片`}
            width={800}
            height={450}
            sizes={sizes}
            priority={priority}
            unoptimized
          />
        </figure>
        <h2>{item.title}</h2>
        {item.summary && <p>{item.summary}</p>}
        <strong>阅读新闻 →</strong>
      </Link>
    </article>
  );
}

export default function NewsStream({
  news,
  showMore = false,
  magazineEdition = false,
  heading,
  description,
  hideHeader = false,
  frontPage = false,
  sortMode = "importance",
  category,
}: NewsStreamProps) {
  const Grid = frontPage ? "div" : MasonryGrid;
  const orderedNews = sortNewsItems(news, sortMode);
  const visibleNews = orderedNews.slice(0, 24);
  const activeSourceCount = new Set(
    orderedNews.map((item) => item.source),
  ).size;

  if (frontPage) {
    const [lead, ...rest] = visibleNews;
    const railNews = rest.slice(0, 3);
    const posterNews = rest.slice(3, 7);
    const streamNews = rest.slice(7);

    return (
      <main>
        <section
          className="page-shell news-stream front-page"
          aria-label="最新国际新闻"
        >
          {lead ? (
            <div className="front-layout">
              <aside className="front-rail" aria-label="最新发布与栏目">
                <section className="rail-panel">
                  <header className="rail-head">
                    <h2>最新发布</h2>
                    <span>实时</span>
                  </header>
                  <div className="rail-list">
                    {railNews.map((item) => (
                      <Link
                        prefetch={false}
                        className="rail-card"
                        href={storyHref(item)}
                        key={item.url}
                      >
                        <figure className="rail-media">
                          <NewsImage
                            source={item.source}
                            src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=7`}
                            alt={`${item.title} 新闻图片`}
                            width={320}
                            height={200}
                            sizes="(max-width: 900px) 40vw, 200px"
                            unoptimized
                          />
                        </figure>
                        <div className="rail-copy">
                          <small>{item.sourceName}</small>
                          <h3>{item.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rail-panel rail-index">
                  <header className="rail-head">
                    <h2>栏目</h2>
                  </header>
                  <div className="rail-links">
                    {newsCategories.map((entry) => (
                      <Link
                        key={entry.id}
                        href={entry.id === "world" ? "/" : `/news/${entry.id}`}
                      >
                        <span>{entry.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                  <Link className="rail-more" href="/news">
                    全部新闻
                  </Link>
                </section>
              </aside>

              <div className="front-main">
                <article className="front-hero">
                  <figure className="hero-media">
                    <NewsImage
                      source={lead.source}
                      src={`/api/news-image?url=${encodeURIComponent(lead.url)}&source=${encodeURIComponent(lead.source)}&title=${encodeURIComponent(lead.originalTitle || lead.title)}&v=7&cover=editorial`}
                      alt={`${lead.title} 新闻图片`}
                      width={1440}
                      height={810}
                      sizes="(max-width: 900px) 100vw, 70vw"
                      priority
                      unoptimized
                    />
                  </figure>
                  <div className="hero-veil" aria-hidden="true" />
                  <div className="hero-copy">
                    <div className="hero-chips">
                      <span className="hero-live">头条</span>
                      <span>{lead.sourceName}</span>
                      <span>{formatNewsDate(lead.publishedAt)}</span>
                    </div>
                    <h1>
                      <Link prefetch={false} href={storyHref(lead)}>
                        {lead.title}
                      </Link>
                    </h1>
                    {lead.summary && <p>{lead.summary}</p>}
                    <div className="hero-actions">
                      <Link
                        prefetch={false}
                        className="hero-primary"
                        href={storyHref(lead)}
                      >
                        阅读全文
                      </Link>
                      <a
                        className="hero-secondary"
                        href={lead.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        查看原文
                      </a>
                    </div>
                  </div>
                </article>

                {posterNews.length > 0 && (
                  <section className="front-posters" aria-label="更多要闻">
                    <header className="front-row-head">
                      <h2>更多要闻</h2>
                      <Link href="/news">查看全部 →</Link>
                    </header>
                    <div className="poster-row">
                      {posterNews.map((item) => (
                        <Link
                          prefetch={false}
                          className="poster-card"
                          href={storyHref(item)}
                          key={item.url}
                          aria-label={`阅读：${item.title}`}
                        >
                          <figure>
                            <NewsImage
                              source={item.source}
                              src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=7`}
                              alt={`${item.title} 新闻图片`}
                              width={600}
                              height={800}
                              sizes="(max-width: 760px) 50vw, 22vw"
                              unoptimized
                            />
                          </figure>
                          <span className="poster-chip">{item.sourceName}</span>
                          <h3>{item.title}</h3>
                          <small>{formatNewsDate(item.publishedAt)}</small>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section className="front-more" aria-label="最新报道">
                  <header className="front-row-head">
                    <h2>最新报道</h2>
                    <span className="front-count">
                      {orderedNews.length} 条 · {activeSourceCount}/{trustedSources.length} 家
                    </span>
                  </header>
                  <div className="front-grid">
                    {streamNews.map((item) => (
                      <NewsCard item={item} key={`${item.source}-${item.url}`} />
                    ))}
                    <InfiniteNews
                      key={`${category || "all"}-${sortMode}`}
                      category={category}
                      sortMode={sortMode}
                      initialCount={visibleNews.length}
                      initialUrls={visibleNews.map((item) => item.url)}
                      total={orderedNews.length}
                    />
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="news-empty">
              <h2>暂时没有近期新闻</h2>
              <p>新闻源会持续更新，你也可以稍后刷新查看。</p>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main>
      {!hideHeader && (
        <header className="page-shell news-hero">
          <p className="eyebrow">
            {magazineEdition
              ? `THE GLOBAL EDITION · ${trustedSources.length} SOURCES`
              : "全球即时新闻 · 每 30 分钟更新"}
          </p>
          <div>
            <h1>
              {heading ??
                (magazineEdition ? "今日全球新闻杂志" : "最近的国际新闻")}
            </h1>
            <p>
              {description ??
                (magazineEdition
                  ? `从“信源标准”收录的 ${trustedSources.length} 家媒体各选一篇最新报道，以中文编辑、视觉分层与沉浸式长文版式重新呈现。`
                  : `汇总“信源标准”收录的 ${trustedSources.length} 家媒体的近期报道；多数为最近 24 小时，《报导者》为最近 7 天。`)}
            </p>
          </div>
          <div className="news-hero-meta">
            <span>
              {orderedNews.length} 条 · {activeSourceCount}/{trustedSources.length} 家
            </span>
            {showMore && (
              <Link className="news-more-link" href="/news">
                查看更多 <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </header>
      )}

      <section className="page-shell news-stream" aria-label="最新国际新闻">
        {orderedNews.length > 0 ? (
          <Grid
            className={
              magazineEdition ? "news-waterfall news-editorial-grid" : "news-waterfall"
            }
          >
            {visibleNews.map((item, index) => (
              <NewsCard
                item={item}
                key={`${item.source}-${item.url}`}
                priority={index < 3}
              />
            ))}
            <InfiniteNews
              key={`${category || "all"}-${sortMode}`}
              category={category}
              sortMode={sortMode}
              initialCount={visibleNews.length}
              initialUrls={visibleNews.map((item) => item.url)}
              total={orderedNews.length}
            />
          </Grid>
        ) : (
          <div className="news-empty">
            <h2>该分类暂时没有近期新闻</h2>
            <p>新闻源会持续更新，你也可以稍后刷新查看。</p>
          </div>
        )}
      </section>
    </main>
  );
}
