import { type NextRequest, NextResponse } from "next/server";
import {
  isTrustedExternalNewsUrl,
  resolveOriginalNewsUrl,
} from "../../data/google-news";
import { fetchReutersPartnerImage } from "../../data/news-article-content";
import { trustedSources } from "../../data/sources";

export const revalidate = 86400;

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] || "");
}

async function fallbackResponse(sourceName: string) {
  const source = trustedSources.find((item) => item.name === sourceName);
  const label = escapeXml(source?.name || "News");
  const themes: Record<string, { background: string; foreground: string; accent: string }> = {
    "Financial Times": { background: "#fdd0b1", foreground: "#292622", accent: "#e8b493" },
    "BBC News": { background: "#b80000", foreground: "#ffffff", accent: "#850000" },
    "Central News Agency Taiwan": { background: "#064580", foreground: "#ffffff", accent: "#003264" },
    "Reuters": { background: "#262626", foreground: "#ffffff", accent: "#e55d21" },
    "The Guardian": { background: "#052962", foreground: "#ffffff", accent: "#16427a" },
    "The Economist": { background: "#e3120b", foreground: "#ffffff", accent: "#b70e08" },
    "Bloomberg": { background: "#171717", foreground: "#ffffff", accent: "#383838" },
  };
  const theme = themes[sourceName] || { background: "#202833", foreground: "#ffffff", accent: "#334252" };
  let icon = "";
  if (source) {
    try {
      const url = new URL("https://www.google.com/s2/favicons");
      url.searchParams.set("domain", new URL(source.url).hostname);
      url.searchParams.set("sz", "128");
      const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(3000) });
      const type = response.headers.get("content-type")?.split(";")[0];
      if (response.ok && (type === "image/png" || type === "image/x-icon" || type === "image/vnd.microsoft.icon")) {
        const data = await response.arrayBuffer();
        if (data.byteLength > 0 && data.byteLength < 100000) icon = `<image x="${sourceName === "Financial Times" ? 152 : 160}" y="156" width="138" height="138" href="data:${type};base64,${Buffer.from(data).toString("base64")}"/>`;
      }
    } catch { /* Publisher name remains available if the icon cannot be loaded. */ }
  }
  // Keep the publisher mark and name together, as a wide branded cover.
  const x = icon ? 324 : 400;
  const anchor = icon ? "start" : "middle";
  const maxWidth = icon ? 390 : 640;
  const textFit = label.length > (icon ? 18 : 28) ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="${theme.background}"/><path d="M0 365 L800 190 L800 450 L0 450Z" fill="${theme.accent}" opacity=".22"/><path d="M0 52 L800 0 L800 34 L0 133Z" fill="${theme.foreground}" opacity=".035"/>${icon}<text x="${x}" y="225" text-anchor="${anchor}" dominant-baseline="middle" fill="${theme.foreground}" font-family="${sourceName === "Financial Times" ? "Georgia, serif" : "Arial, sans-serif"}" font-size="${sourceName === "Financial Times" ? 40 : 42}" font-weight="700"${textFit}>${label}</text></svg>`;
  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox" } });
}

function imageResponse(imageUrl: string) {
  const redirect = NextResponse.redirect(imageUrl, 307);
  redirect.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  );
  return redirect;
}

function imageFromHtml(html: string): string {
  const propertyFirst = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  const contentFirst = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  );

  const twitterNameFirst = html.match(
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
  );
  const twitterContentFirst = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  );

  return (
    propertyFirst?.[1] ||
    contentFirst?.[1] ||
    twitterNameFirst?.[1] ||
    twitterContentFirst?.[1] ||
    ""
  )
    .replace(/&amp;/g, "&")
    .replace(/\\u0026/g, "&");
}

export async function GET(request: NextRequest) {
  const newsUrl = request.nextUrl.searchParams.get("url");
  const source = request.nextUrl.searchParams.get("source") ?? "";
  const title = request.nextUrl.searchParams.get("title") ?? "";

  if (request.nextUrl.searchParams.get("fallback") === "logo" || !newsUrl) {
    return fallbackResponse(source);
  }

  try {
    if (source === "Reuters" && title) {
      const partnerImage = await fetchReutersPartnerImage(title);
      if (partnerImage) {
        return imageResponse(partnerImage);
      }
    }

    const originalUrl = await resolveOriginalNewsUrl(newsUrl);
    if (!isTrustedExternalNewsUrl(originalUrl)) {
      return fallbackResponse(source);
    }

    const response = await fetch(originalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 WorldPulse image reader" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return fallbackResponse(source);
    }

    const imageUrl = imageFromHtml(await response.text());
    if (!imageUrl) {
      return fallbackResponse(source);
    }

    const parsedImage = new URL(imageUrl);
    if (parsedImage.protocol !== "https:") {
      return fallbackResponse(source);
    }

    return imageResponse(imageUrl);
  } catch {
    return fallbackResponse(source);
  }
}
