import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { resolveOriginalNewsUrl } from "../../data/google-news";
import { fetchArticleContent } from "../../data/news-article-content";
import { formatNewsDate } from "../../data/live-news";
import { decodeNewsStory } from "../../data/news-story";

type StoryPageProps = {
  searchParams: Promise<{ story?: string }>;
};

async function storyFromParams(searchParams: StoryPageProps["searchParams"]) {
  const { story } = await searchParams;
  return story ? decodeNewsStory(story) : null;
}

function paragraphizeSummary(summary: string): string[] {
  const sentences =
    summary.match(/[^。！？.!?]+[。！？.!?]+[”’」』】)]*|[^。！？.!?]+$/gu) ??
    [];
  const paragraphs: string[] = [];
  let current = "";

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) {
      continue;
    }
    if (current && current.length + sentence.length > 180) {
      paragraphs.push(current);
      current = "";
    }
    current += sentence;
  }
  if (current) {
    paragraphs.push(current);
  }
  return paragraphs;
}

function rssSourceLabel(value: string): string {
  try {
    return new URL(value).hostname === "news.google.com"
      ? "Google News RSS"
      : "原媒体官方 RSS";
  } catch {
    return "RSS";
  }
}

export async function generateMetadata({
  searchParams,
}: StoryPageProps): Promise<Metadata> {
  const story = await storyFromParams(searchParams);

  return story
    ? {
        title: `${story.title} | WorldPulse`,
        description: story.summary || `${story.sourceName} 最新报道`,
      }
    : { title: "新闻未找到 | WorldPulse" };
}

export default async function StoryPage({ searchParams }: StoryPageProps) {
  const story = await storyFromParams(searchParams);
  if (!story) {
    notFound();
  }

  const originalUrl = await resolveOriginalNewsUrl(story.url);
  const rssSource = rssSourceLabel(story.url);
  const articleContent = await fetchArticleContent(originalUrl, {
    source: story.source,
    originalTitle: story.originalTitle,
  });
  const summaryParagraphs = paragraphizeSummary(story.summary);
  const originalSummaryParagraphs = paragraphizeSummary(
    story.originalSummary || story.summary,
  );
  const paragraphs =
    articleContent.paragraphs.length > 0
      ? articleContent.paragraphs
      : summaryParagraphs;
  const originalParagraphs =
    articleContent.originalParagraphs.length > 0
      ? articleContent.originalParagraphs
      : originalSummaryParagraphs;
  const bilingualParagraphs = paragraphs.map((translated, index) => ({
    original: originalParagraphs[index] || translated,
    translated,
  }));
  const emptyContentMessage =
    story.source === "Reuters"
      ? "Reuters RSS 仅提供标题、链接与发布时间，原文页面目前拒绝服务器读取。请使用下方按钮前往 Reuters 查看完整报道。"
      : "该来源暂未提供新闻摘要。";
  const readingMinutes = Math.max(
    1,
    Math.ceil(paragraphs.join("").length / 450),
  );

  return (
    <>
      <SiteHeader />
      <main className="news-article-page">
        <article className="page-shell news-article">
          <nav className="news-article-breadcrumb" aria-label="面包屑">
            <Link href="/">首页</Link>
            <span>/</span>
            <Link href="/news">全部新闻</Link>
          </nav>

          <header className="news-article-header">
            <div className="news-article-title-stack">
              {story.originalTitle && story.originalTitle !== story.title && (
                <p className="news-article-original-title" lang="en">
                  {story.originalTitle}
                </p>
              )}
              <h1>{story.title}</h1>
              <p className="eyebrow">
                {story.sourceName} · {formatNewsDate(story.publishedAt)}
              </p>
            </div>
          </header>

          <figure className="news-article-image">
            <Image
              src={`/api/news-image?url=${encodeURIComponent(story.url)}&v=2`}
              alt={`${story.title} 新闻图片`}
              width={1600}
              height={900}
              sizes="(max-width: 1200px) 100vw, 1160px"
              priority
              unoptimized
            />
            <figcaption>
              图片与报道来自 {story.sourceName}，WorldPulse 进行中文整理。
            </figcaption>
          </figure>

          <div className="news-article-layout">
            <div className="news-article-copy">
              <div className="article-reading-line">
                <span>WORLD PULSE / 国际</span>
                <span>预计阅读 {readingMinutes} 分钟</span>
              </div>
              {articleContent.byline && (
                <p className="news-article-byline">
                  记者 / 作者：{articleContent.byline}
                </p>
              )}
              {bilingualParagraphs.length > 0 ? (
                bilingualParagraphs.map(({ original, translated }, index) => (
                  <section
                    className="news-article-bilingual-block"
                    key={`${index}-${original}`}
                    aria-label={`双语正文第 ${index + 1} 段`}
                  >
                    <p className="news-article-original" lang="en">
                      {original}
                    </p>
                    <p
                      className={
                        index === 0
                          ? "news-article-translation news-article-lead"
                          : "news-article-translation"
                      }
                      lang="zh-CN"
                    >
                      {translated}
                    </p>
                  </section>
                ))
              ) : (
                <p className="news-article-lead">{emptyContentMessage}</p>
              )}

              <div className="news-article-note">
                <span>编辑说明</span>
                <p>
                  {!articleContent.matched
                    ? story.summary
                      ? `本条目来自${rssSource}，并已核对原媒体来源；暂未取得可确认匹配的正文，因此完整显示 RSS 提供的摘要。完整报道及后续更新请以原媒体页面为准。`
                      : `本条目来自${rssSource}，但 RSS 未提供摘要，原媒体页面也暂未返回可确认的正文。本站不会将空白内容标示为完整报道，请前往原媒体页面阅读。`
                    : articleContent.mode === "full"
                    ? `本条目来自${rssSource}；原文核对通过且信源允许全文展示，正文不设段落或字数上限。非中文内容会翻译成中文，中文原文则直接保留，并按照杂志阅读方式排版。`
                    : articleContent.mode === "complete"
                    ? `本条目来自${rssSource}；原文核对通过，并完整展示原媒体公开页面中可取得的正文段落。非中文内容会逐段翻译成中文，中文原文则直接保留。完整报道、后续更新及图片版权信息请以原媒体页面为准。`
                    : `本条目来自${rssSource}；核对原文后自动提取原媒体公开页面的较长节选，非中文内容会翻译成中文，中文原文则直接保留。节选长度随可取得正文增加，不再套用固定段落或字数上限；完整报道、后续更新及图片版权信息请以原媒体页面为准。`}
                </p>
              </div>

              <a
                className="original-news-button"
                href={originalUrl}
                target="_blank"
                rel="noreferrer"
              >
                阅读完整原文 <span aria-hidden="true">↗</span>
              </a>
            </div>

            <aside className="news-article-aside">
              <span>来源</span>
              <strong>{story.sourceName}</strong>
              <span>发布时间</span>
              <time dateTime={story.publishedAt}>
                {formatNewsDate(story.publishedAt)}
              </time>
              <span>内容范围</span>
              <strong>
                {!articleContent.matched
                  ? story.summary
                    ? "RSS 摘要"
                    : "仅标题与链接"
                  : articleContent.mode === "full"
                    ? "授权全文"
                    : articleContent.mode === "complete"
                      ? "完整公开正文"
                    : "较长新闻节选"}
              </strong>
            </aside>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
