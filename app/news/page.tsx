import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  formatNewsDate,
  getLatestInternationalNews,
} from "../data/live-news";

export const metadata: Metadata = {
  title: "最新国际新闻 | WorldPulse",
  description: "来自全球权威媒体的最新国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getLatestInternationalNews();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="page-shell news-hero">
          <p className="eyebrow">全球即時新聞 · 每 15 分鐘更新</p>
          <div>
            <h1>最近的国际新闻</h1>
            <p>
              來自英國廣播公司新聞網、衛報、紐約時報與金融時報，
              依發布時間彙整，顯示所有可取得的新聞。
            </p>
          </div>
          <span>{news.length} 条</span>
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
