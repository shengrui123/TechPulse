import Image from "next/image";
import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { articles } from "./data/articles";

const featured = articles.slice(0, 3);
const latest = articles.slice(3, 7);
const analysis = articles.slice(7, 10);

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell hero">
          <div className="hero-copy">
            <p className="eyebrow">TODAY&apos;S BRIEF · 2026.07.30</p>
            <h1>把全球科技的重要讯号，整理成值得慢慢读的中文。</h1>
            <p className="hero-description">
              TechPulse 筛选人工智能、半导体、科学与产品领域的重要变化，以清楚的摘要、趋势脉络和编辑判断，帮助你理解世界正在发生什么。
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
              src="/og.png"
              alt="TechPulse 全球科技讯号图"
              width={1536}
              height={1024}
              priority
            />
            <span>TECHPULSE INTELLIGENCE · 001</span>
          </Link>
        </section>

        <section className="page-shell content-section" id="featured">
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
                    {article.kicker} · {article.tag}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <div className="story-meta">
                    {article.readTime}阅读 · AI SCORE {article.score}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell feed-layout" id="latest">
          <div>
            <div className="section-heading">
              <h2>最新动态</h2>
              <span>持续更新</span>
            </div>
            <div className="feed-list">
              {latest.map((article) => (
                <article className="feed-item" key={article.slug}>
                  <div className="feed-time">
                    {article.time}
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

          <aside className="daily-brief">
            <span>DAILY BRIEF · 08:00</span>
            <h2>每天五分钟，看懂最重要的科技变化。</h2>
            <p>三条重点新闻、一组趋势变化，以及它们为何值得你关心。</p>
            <Link href={`/articles/${articles[0].slug}`}>查看今日简报 →</Link>
          </aside>
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
