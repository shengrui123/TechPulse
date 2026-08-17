import type { Metadata } from "next";
import NewsStream from "./components/NewsStream";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getSourceEdition } from "./data/live-news";

export const metadata: Metadata = {
  title: "国际新闻 | WorldPulse",
  description: "来自全球完整信源名单的国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function Home() {
  const news = await getSourceEdition();

  return (
    <>
      <SiteHeader />
      <NewsStream news={news} hideHeader />
      <SiteFooter />
    </>
  );
}
