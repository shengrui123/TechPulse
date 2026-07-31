import { type NextRequest, NextResponse } from "next/server";
import {
  isTrustedExternalNewsUrl,
  resolveOriginalNewsUrl,
} from "../../data/google-news";

export const revalidate = 86400;

function fallbackResponse(request: NextRequest) {
  return NextResponse.redirect(new URL("/world-brief.png", request.url), 307);
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

  if (!newsUrl) {
    return fallbackResponse(request);
  }

  try {
    const originalUrl = await resolveOriginalNewsUrl(newsUrl);
    if (!isTrustedExternalNewsUrl(originalUrl)) {
      return fallbackResponse(request);
    }

    const response = await fetch(originalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 WorldPulse image reader" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return fallbackResponse(request);
    }

    const imageUrl = imageFromHtml(await response.text());
    if (!imageUrl) {
      return fallbackResponse(request);
    }

    const parsedImage = new URL(imageUrl);
    if (parsedImage.protocol !== "https:") {
      return fallbackResponse(request);
    }

    const redirect = NextResponse.redirect(imageUrl, 307);
    redirect.headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    );
    return redirect;
  } catch {
    return fallbackResponse(request);
  }
}
