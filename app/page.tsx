import type { Metadata } from "next";
import NewsStream from "./components/NewsStream";
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
    <>
      <SiteHeader />
      <NewsStream news={news} hideHeader sortMode={newsSortMode(sort)} />
      <SiteFooter />
    </>
  );
}
