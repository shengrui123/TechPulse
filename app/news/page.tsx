import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  formatNewsDate,
  getLatestInternationalNews,
} from "../data/live-news";
import { trustedSources } from "../data/sources";

export const metadata: Metadata = {
  title: "最新国际新闻 | WorldPulse",
  description: "来自全球权威媒体的最新国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function NewsPage() {
  const news = await getLatestInternationalNews();
  const activeSourceCount = new Set(news.map((item) => item.source)).size;

  return (
    <>
      <SiteHeader />
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
          <span>
            {news.length} 条 · {activeSourceCount}/{trustedSources.length} 家
          </span>
        </header>

        <section className="page-shell news-stream" aria-label="最新国际新闻">
          {news.length > 0 ? (
            <div className="news-waterfall">
              {news.map((item, index) => (
                <article className="news-card" key={`${item.source}-${item.url}`}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <div className="news-card-meta">
                      <span>{item.sourceName}</span>
                      <time dateTime={item.publishedAt}>
                        {formatNewsDate(item.publishedAt)}
                      </time>
                    </div>
                    <span className="news-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2>{item.title}</h2>
                    {item.summary && <p>{item.summary}</p>}
                    <strong>阅读原文 ↗</strong>
                  </a>
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
      <SiteFooter />
    </>
  );
}
