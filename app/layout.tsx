import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  const title = "TechPulse | 洞察全球科技，預見未來趨勢";
  const description =
    "AI 驅動的全球科技資訊情報平台，聚合全球新聞、AI 摘要、趨勢分析與科技公司情報。";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: new URL("/og.png", siteUrl).toString(),
          width: 1536,
          height: 1024,
          alt: "TechPulse 科技情報雷達",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", siteUrl).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
