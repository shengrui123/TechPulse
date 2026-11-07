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
  const label = escapeXml(source?.shortName || "NEWS");
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
        if (data.byteLength > 0 && data.byteLength < 100000) icon = `<image x="336" y="88" width="128" height="128" href="data:${type};base64,${Buffer.from(data).toString("base64")}"/>`;
      }
    } catch { /* Publisher name remains available if the icon cannot be loaded. */ }
  }
  const y = icon ? 285 : 230;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="#f2f2f7"/>${icon}<text x="400" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#1d1d1f" font-family="Arial, sans-serif" font-size="36" font-weight="700">${label}</text></svg>`;
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
