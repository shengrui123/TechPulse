import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsStream from "../../components/NewsStream";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import {
  categoryLabels,
  isNewsCategory,
} from "../../data/news-categories";
import { getNewsByCategory } from "../../data/live-news";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isNewsCategory(category)) {
    return { title: "新闻分类未找到 | WorldPulse" };
  }

  const label = categoryLabels[category];
  return {
    title: `${label}新闻 | WorldPulse`,
    description: `来自全球完整信源名单的${label}相关新闻。`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isNewsCategory(category)) {
    notFound();
  }

  const label = categoryLabels[category];
  const news = await getNewsByCategory(category);

  return (
    <>
      <SiteHeader />
      <NewsStream
        news={news}
        heading={`${label}新闻`}
        description={`来自完整信源名单的${label}相关新闻，按发布时间排列，并提供中文标题、摘要与杂志式正文阅读。`}
      />
      <SiteFooter />
    </>
  );
}
