import type { Metadata } from "next";
import NewsStream from "./components/NewsStream";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getLatestInternationalNews } from "./data/live-news";

export const metadata: Metadata = {
  title: "最新国际新闻 | WorldPulse",
  description: "首页展示全球权威媒体最近发布的 200 条国际新闻。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function Home() {
  const news = await getLatestInternationalNews(200);

  return (
    <>
      <SiteHeader />
      <NewsStream news={news} showMore />
      <SiteFooter />
    </>
  );
}
