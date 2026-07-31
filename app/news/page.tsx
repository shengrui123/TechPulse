import type { Metadata } from "next";
import NewsStream from "../components/NewsStream";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getLatestInternationalNews } from "../data/live-news";

export const metadata: Metadata = {
  title: "全部国际新闻 | WorldPulse",
  description: "来自全球权威媒体的全部近期国际新闻，按发布时间持续更新。",
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function NewsPage() {
  const news = await getLatestInternationalNews();

  return (
    <>
      <SiteHeader />
      <NewsStream
        news={news}
        heading="全部新闻"
        description="来自完整信源名单的全部近期新闻，按发布时间排列，并提供中文标题、摘要与杂志式正文阅读。"
      />
      <SiteFooter />
    </>
  );
}
