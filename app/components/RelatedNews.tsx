import Link from "next/link";
import { formatNewsDate, getAllSourceNews } from "../data/live-news";
import { encodeNewsStory, type NewsStory } from "../data/news-story";

const stopWords = new Set(["the", "and", "for", "with", "from", "that", "this", "after", "over", "says", "said", "will", "news", "what", "how", "its", "new", "about"]);

function terms(title: string): Set<string> {
  const words = title.toLowerCase().match(/[a-z0-9]{3,}|[\u3400-\u9fff]{2,}/gu) ?? [];
  return new Set(words.flatMap((word) => {
    if (/^[\u3400-\u9fff]+$/u.test(word)) {
      return Array.from({ length: Math.max(0, word.length - 1) }, (_, i) => word.slice(i, i + 2));
    }
    return stopWords.has(word) ? [] : [word];
  }));
}

export default async function RelatedNews({ story }: { story: NewsStory }) {
  const news = await getAllSourceNews();
  const originalTerms = terms(story.originalTitle || story.title);
  const chineseTerms = terms(story.title);
  const ranked = news.flatMap((item) => {
    if (item.url === story.url) return [];
    const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((word) => b.has(word)).length;
    const score = Math.max(overlap(originalTerms, terms(item.originalTitle || item.title)), overlap(chineseTerms, terms(item.title)));
    return score >= 3 ? [{ item, score }] : [];
  }).sort((a, b) => b.score - a.score);
  const sameSource = ranked.filter(({ item }) => item.source === story.source);
  const otherSources = ranked.filter(({ item }) => item.source !== story.source);
  const selected = (sameSource.length ? sameSource : otherSources).slice(0, 5);

  return <aside className="related-news" aria-label="相关新闻">
    <p className="related-news-kicker">继续了解</p>
    <h2>{sameSource.length ? "相关报道与进展" : "其他媒体的相关报道"}</h2>
    {selected.length ? <ul>{selected.map(({ item }) => <li key={item.url}>
      <Link prefetch={false} href={`/news/story?story=${encodeNewsStory(item)}`}>{item.title}</Link>
      <p>{item.sourceName} · {formatNewsDate(item.publishedAt)}</p>
    </li>)}</ul> : <p className="related-news-empty">最近 24 小时暂未找到足够相关的报道。</p>}
    <p className="related-news-caption">根据报道标题自动匹配，请结合发布时间判断事件进展。</p>
  </aside>;
}
