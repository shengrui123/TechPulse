import type { Metadata } from "next";
import { headers } from "next/headers";
import BackToTop from "./components/BackToTop";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  const title = "WorldPulse | 读懂全球正在发生什么";
  const description =
    "汇集全球权威可信新闻来源，以中文整理国际、政治、经济、社会、科技、气候与文化时事。";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: [{ url: "/worldpulse-logo.png", type: "image/png" }],
      shortcut: "/worldpulse-logo.png",
      apple: "/worldpulse-logo.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: new URL("/world-brief.png", siteUrl).toString(),
          width: 1536,
          height: 1024,
          alt: "WorldPulse 全球时事编辑图",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/world-brief.png", siteUrl).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" data-scroll-behavior="smooth">
      <body>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
