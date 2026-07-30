import Image from "next/image";
import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { articles } from "./data/articles";

const featured = articles.slice(0, 3);
const latest = articles.slice(3, 10);
const analysis = articles.slice(7, 10);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell hero">
          <div className="hero-copy">
            <p className="eyebrow">NEWS DESK · UPDATED 2026.07.30</p>
            <h1>把世界正在发生的事，整理成值得慢慢读的中文。</h1>
            <p className="hero-description">
              WorldPulse 从全球权威媒体与国际机构中筛选重要时事，涵盖国际、政治、经济、社会、科技、气候与文化，并保留每篇原始报道链接。
            </p>
            <Link className="text-link" href={`/articles/${featured[0].slug}`}>
              阅读今日封面 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Link
            className="hero-visual clickable"
            href={`/articles/${featured[0].slug}`}
            aria-label={`阅读：${featured[0].title}`}
          >
            <Image
              src="/world-brief.png"
              alt="WorldPulse 全球时事编辑图"
              width={1536}
              height={1024}
              priority
            />
            <span>WORLDPULSE · GLOBAL EDITION 001</span>
          </Link>
        </section>

        <section className="page-shell feed-layout" id="latest">
          <div className="feed-main">
            <div className="section-heading">
              <h2>最新动态</h2>
              <Link className="more-news-link" href="/news">
                查看更多 <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="feed-list">
              {latest.map((article) => (
                <article className="feed-item" key={article.slug}>
                  <div className="feed-time">
                    {article.published}
                    <span>{article.tag}</span>
                  </div>
                  <Link className="clickable feed-link" href={`/articles/${article.slug}`}>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <span className="feed-read">阅读全文 →</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell content-section featured-section" id="featured">
          <div className="section-heading">
            <h2>今日值得关注</h2>
            <span>由编辑选读 · {featured.length} 篇</span>
          </div>
          <div className="featured-grid">
            {featured.map((article, index) => (
              <article className="story" key={article.slug}>
                <Link className="clickable story-link" href={`/articles/${article.slug}`}>
                  <div className="story-kicker">
                    <i className={`dot dot-${index + 1}`} />
                    {article.source} · {article.region}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <div className="story-meta">
                    {article.published} · {article.readTime}阅读
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="analysis-band" id="analysis">
          <div className="page-shell">
            <div className="section-heading section-heading-light">
              <h2>深度解读</h2>
              <span>不止看见新闻，也理解变化</span>
            </div>
            <div className="analysis-list">
              {analysis.map((article, index) => (
                <Link
                  className="analysis-item clickable"
                  href={`/articles/${article.slug}`}
                  key={article.slug}
                >
                  <span className="analysis-index">0{index + 1}</span>
                  <div>
                    <p>{article.tag}</p>
                    <h3>{article.title}</h3>
                  </div>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
