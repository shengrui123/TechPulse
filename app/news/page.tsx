import type { Metadata } from "next";
import SourceNewsBrowser from "../components/SourceNewsBrowser";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getLatestInternationalNews } from "../data/live-news";
import { encodeNewsStory } from "../data/news-story";

export const metadata: Metadata = {
  title: "全部国际新闻 | WorldPulse",
  description: "来自全球权威媒体的全部近期国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function NewsPage() {
  const news = await getLatestInternationalNews();
  const searchableNews = news.map((item) => ({
    ...item,
    storyHref: `/news/story?story=${encodeNewsStory(item)}`,
  }));

  return (
    <>
      <SiteHeader />
      <SourceNewsBrowser news={searchableNews} heading="全部新闻" />
      <SiteFooter />
    </>
  );
}
