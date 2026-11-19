import Link from "next/link";
import NewsImage from "./NewsImage";
import { encodeNewsStory } from "../data/news-story";
import { formatNewsDate, type LiveNewsItem } from "../data/live-news";
import { sortNewsItems, type NewsSortMode } from "../data/news-sort";

function storyHref(item: LiveNewsItem) {
  return `/news/story?story=${encodeNewsStory(item)}`;
}

function StoryImage({ item, priority = false }: { item: LiveNewsItem; priority?: boolean }) {
  return <NewsImage source={item.source} src={`/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=6`} alt="" width={1000} height={600} sizes="(max-width: 760px) 100vw, 70vw" priority={priority} unoptimized />;
}

export default function HomeDashboard({ news, sortMode }: { news: LiveNewsItem[]; sortMode: NewsSortMode }) {
  const items = sortNewsItems(news, sortMode);
  const [featured, ...rest] = items;
  if (!featured) return null;

  return <section className="home-dashboard page-shell" aria-label="今日新闻精选">
    <aside className="dashboard-sidebar">
      <div className="dashboard-panel">
        <div className="dashboard-panel-heading"><h2>最新报道</h2><span>持续更新</span></div>
        <div className="dashboard-latest">
          {rest.slice(0, 3).map((item) => <Link className="dashboard-latest-card" href={storyHref(item)} prefetch={false} key={item.url}>
            <StoryImage item={item} /><span>{item.title}</span><b aria-hidden="true">↗</b>
          </Link>)}
        </div>
      </div>
      <div className="dashboard-panel dashboard-sources">
        <div className="dashboard-panel-heading"><h2>全球视野</h2><Link href="/sources">全部 →</Link></div>
        <p>从可信来源，了解世界正在发生的事。</p>
        {rest.slice(3, 7).map((item) => <Link className="dashboard-source" href={storyHref(item)} prefetch={false} key={item.url}>
          <span className="dashboard-source-image"><StoryImage item={item} /></span><span><strong>{item.sourceName}</strong><small>{formatNewsDate(item.publishedAt)}</small></span><b aria-hidden="true">↗</b>
        </Link>)}
      </div>
    </aside>
    <div className="dashboard-content">
      <Link className="dashboard-feature" href={storyHref(featured)} prefetch={false}>
        <StoryImage item={featured} priority />
        <div className="dashboard-feature-content"><span className="dashboard-pill">✦ 今日焦点</span><div><span className="dashboard-feature-source">{featured.sourceName} · {formatNewsDate(featured.publishedAt)}</span><h1>{featured.title}</h1>{featured.summary && <p>{featured.summary}</p>}<span className="dashboard-read">阅读报道 <span aria-hidden="true">↗</span></span></div></div>
      </Link>
      <div className="dashboard-section-heading"><div><span>EXPLORE THE WORLD</span><h2>更多值得关注</h2></div><a href="#latest-news">查看全部 ↗</a></div>
      <div className="dashboard-recommendations">
        {rest.slice(0, 4).map((item) => <Link className="dashboard-recommendation" href={storyHref(item)} prefetch={false} key={item.url}>
          <StoryImage item={item} /><div><span>{item.sourceName}</span><h3>{item.title}</h3><small>{formatNewsDate(item.publishedAt)}</small></div><b aria-hidden="true">↗</b>
        </Link>)}
      </div>
    </div>
  </section>;
}
