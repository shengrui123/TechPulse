import type { Metadata } from "next";
import NewsStream from "./components/NewsStream";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getSourceEdition } from "./data/live-news";

export const metadata: Metadata = {
  title: "最新国际新闻 | WorldPulse",
  description: "每日精选完整全球信源名单中各家媒体的最新重要报道。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function Home() {
  const news = await getSourceEdition();

  return (
    <>
      <SiteHeader />
      <NewsStream news={news} showMore magazineEdition />
      <SiteFooter />
    </>
  );
}
