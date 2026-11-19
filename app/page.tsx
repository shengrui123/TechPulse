import type { Metadata } from "next";
import NewsStream from "./components/NewsStream";
import HomeDashboard from "./components/HomeDashboard";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getAllSourceNews } from "./data/live-news";
import { newsSortMode } from "./data/news-sort";

export const metadata: Metadata = {
  title: "国际新闻 | WorldPulse",
  description: "来自全球完整信源名单的国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type HomeProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { sort } = await searchParams;
  const news = await getAllSourceNews();

  return (
    <div className="home-experience">
      <SiteHeader />
      <HomeDashboard news={news} sortMode={newsSortMode(sort)} />
      <div id="latest-news" className="home-news-feed">
        <div className="page-shell home-feed-heading"><span>THE LATEST</span><h2>最新国际新闻</h2><p>持续追踪全球正在发生的事</p></div>
        <NewsStream news={news} hideHeader sortMode={newsSortMode(sort)} />
      </div>
      <SiteFooter />
    </div>
  );
}
