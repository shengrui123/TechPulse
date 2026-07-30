import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { articles, getArticle } from "../../data/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticle((await params).slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | WorldPulse`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticle((await params).slug);

  if (!article) {
    notFound();
  }

  const related = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="article-page">
        <div className="page-shell article-breadcrumb">
          <Link href="/">首页</Link>
          <span>/</span>
          <span>{article.tag}</span>
        </div>

        <article>
          <header className="page-shell article-hero">
            <p className="eyebrow">
              {article.kicker} · {article.tag}
            </p>
            <h1>{article.title}</h1>
            <p className="article-deck">{article.summary}</p>
            <div className="article-byline">
              <span>WorldPulse 编辑部</span>
              <span>{article.published}</span>
              <span>{article.readTime}阅读</span>
              <strong>{article.source}</strong>
            </div>
          </header>

          <div className="article-rule" />

          <div className="page-shell article-layout">
            <aside className="article-aside">
              <span>IN THIS STORY</span>
              <p>三个值得记住的重点</p>
              <ol>
                {article.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ol>
            </aside>

            <div className="article-body">
              {article.paragraphs.map((paragraph, index) => (
                <p className={index === 0 ? "article-lead" : ""} key={paragraph}>
                  {paragraph}
                </p>
              ))}
              <div className="article-note">
                <strong>WorldPulse 编辑说明</strong>
                <p>
                  本文依据权威来源整理为中文摘要，不替代原始报道。重要事实与后续更新请以来源页面为准。
                </p>
                <a href={article.sourceUrl} target="_blank" rel="noreferrer">
                  查看 {article.source} 原始报道 ↗
                </a>
              </div>
              <Link className="back-link" href="/">
                ← 返回首页
              </Link>
            </div>
          </div>
        </article>

        <section className="page-shell related-section">
          <div className="section-heading">
            <h2>继续阅读</h2>
            <span>跨地区、跨议题理解世界</span>
          </div>
          <div className="featured-grid">
            {related.map((item, index) => (
              <article className="story" key={item.slug}>
                <Link className="clickable story-link" href={`/articles/${item.slug}`}>
                  <div className="story-kicker">
                    <i className={`dot dot-${index + 1}`} />
                    {item.source} · {item.region}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="story-meta">{item.readTime}阅读</div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
