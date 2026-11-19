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
import { trustedSources } from "../data/sources";

type NewsStreamProps = {
  news: LiveNewsItem[];
  showMore?: boolean;
  magazineEdition?: boolean;
  heading?: string;
  description?: string;
  hideHeader?: boolean;
  sortMode?: NewsSortMode;
  category?: string;
};

export default function NewsStream({
  news,
  showMore = false,
  magazineEdition = false,
  heading,
  description,
  hideHeader = false,
  sortMode = "importance",
  category,
}: NewsStreamProps) {
  const orderedNews = sortNewsItems(news, sortMode);
  const visibleNews = orderedNews.slice(0, 24);
  const activeSourceCount = new Set(
    orderedNews.map((item) => item.source),
  ).size;

  if (hideHeader) {
    const groupLabels = [
      ["今日焦点", "THE TOP STORIES"], ["正在发生", "AROUND THE WORLD"],
      ["全球视野", "THE BIG PICTURE"], ["深入了解", "STORIES THAT MATTER"],
      ["更多值得关注", "MORE TO EXPLORE"], ["来自世界各地", "GLOBAL DISPATCHES"],
      ["新闻速览", "THE LATEST"], ["继续阅读", "KEEP READING"],
      ["世界观察", "WORLD WATCH"], ["今日聚焦", "IN FOCUS"],
      ["环球动态", "GLOBAL UPDATE"], ["更多报道", "MORE STORIES"],
    ];
    const groups = groupLabels.map(([title, subtitle], index) => ({
      title, subtitle, items: visibleNews.slice(index * 2, index * 2 + 2),
    })).filter((group) => group.items.length);
    const date = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "long", day: "numeric", weekday: "long" }).format(new Date());
    return (
      <main className="edition-home">
        <div className="page-shell edition-content">
          <header className="edition-heading">
            <p>WORLD PULSE · 每日环球精选</p>
            <h1>{date}</h1>
            <span>发现今天正在发生的世界</span>
          </header>
          {groups.map((group, groupIndex) => (
            <section className="edition-section" key={group.title} aria-label={group.title}>
              <div className="edition-section-heading"><div><h2>{group.title}</h2><span>{group.subtitle}</span></div><span>{groupIndex === 0 ? "今日精选" : "环球报道"}</span></div>
              <div className={`edition-grid edition-grid-${groupIndex % 3}`}>
                {group.items.map((item, index) => (
                  <article className="edition-card" key={`${item.source}-${item.url}`}>
                    <Link prefetch={false} href={`/news/story?story=${encodeNewsStory(item)}`} aria-label={`阅读：${item.title}`}>
                      <NewsImage source={item.source} src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=6`} alt="" width={1000} height={650} sizes="(max-width: 700px) 100vw, 70vw" priority={groupIndex === 0 && index < 2} unoptimized />
                      <div className="edition-card-copy"><span className="edition-card-kicker">{item.sourceName} · {formatNewsDate(item.publishedAt)}</span><h3>{item.title}</h3><span className="edition-card-action">阅读报道 <span aria-hidden="true">↗</span></span></div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {orderedNews.length === 0 && <div className="news-empty"><h2>暂时没有近期新闻</h2><p>新闻源会持续更新，你也可以稍后刷新查看。</p></div>}
          <section className="edition-section edition-more" aria-label="更多新闻"><div className="edition-section-heading"><div><h2>更多新闻</h2><span>MORE STORIES</span></div></div><div className="news-waterfall edition-infinite"><InfiniteNews key={`${category || "all"}-${sortMode}`} category={category} sortMode={sortMode} initialCount={visibleNews.length} initialUrls={visibleNews.map((item) => item.url)} total={orderedNews.length} /></div></section>
        </div>
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
          <MasonryGrid
            className={
              magazineEdition
                ? "news-waterfall news-editorial-grid"
                : "news-waterfall"
            }
          >
            {visibleNews.map((item, index) => (
              <article className="news-card" key={`${item.source}-${item.url}`}>
                <Link
                  prefetch={false}
                  href={`/news/story?story=${encodeNewsStory(item)}`}
                  aria-label={`阅读：${item.title}`}
                >
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
            <InfiniteNews key={`${category || "all"}-${sortMode}`} category={category} sortMode={sortMode} initialCount={visibleNews.length} initialUrls={visibleNews.map((item) => item.url)} total={orderedNews.length} />
          </MasonryGrid>
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
