import Image from "next/image";
import Link from "next/link";
import {
  formatNewsDate,
  type LiveNewsItem,
} from "../data/live-news";
import { encodeNewsStory } from "../data/news-story";
import { trustedSources } from "../data/sources";

type NewsStreamProps = {
  news: LiveNewsItem[];
  showMore?: boolean;
};

export default function NewsStream({
  news,
  showMore = false,
}: NewsStreamProps) {
  const activeSourceCount = new Set(news.map((item) => item.source)).size;

  return (
    <main>
      <header className="page-shell news-hero">
        <p className="eyebrow">全球即时新闻 · 每 15 分钟更新</p>
        <div>
          <h1>最近的国际新闻</h1>
          <p>
            汇总“信源标准”收录的 {trustedSources.length} 家媒体最近 48
            小时的报道，所有新闻均提供中文标题与中文摘要。
          </p>
        </div>
        <div className="news-hero-meta">
          <span>
            {news.length} 条 · {activeSourceCount}/{trustedSources.length} 家
          </span>
          {showMore && (
            <Link className="news-more-link" href="/news">
              查看更多 <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </header>

      <section className="page-shell news-stream" aria-label="最新国际新闻">
        {news.length > 0 ? (
          <div className="news-waterfall">
            {news.map((item, index) => (
              <article className="news-card" key={`${item.source}-${item.url}`}>
                <Link
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
          <div className="news-empty">
            <h2>新闻源暂时没有回应</h2>
            <p>页面会自动重试，请稍后刷新。</p>
          </div>
        )}
      </section>
    </main>
  );
}
