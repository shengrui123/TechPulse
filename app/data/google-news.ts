import "server-only";
import { trustedSources } from "./sources";

const trustedHosts = new Set(
  trustedSources.map((source) =>
    new URL(source.url).hostname.replace(/^www\./, ""),
  ),
);

export function isTrustedExternalNewsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.replace(/^www\./, "");
    return [...trustedHosts].some(
      (trustedHost) =>
        hostname === trustedHost || hostname.endsWith(`.${trustedHost}`),
    );
  } catch {
    return false;
  }
}

export function isSupportedNewsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "news.google.com" ||
        isTrustedExternalNewsUrl(value))
    );
  } catch {
    return false;
  }
}

function articleAttributes(html: string) {
  return {
    timestamp: html.match(/data-n-a-ts=["']([^"']+)/)?.[1] || "",
    signature: html.match(/data-n-a-sg=["']([^"']+)/)?.[1] || "",
  };
}

async function decodeGoogleNewsUrl(newsUrl: string): Promise<string> {
  const parsed = new URL(newsUrl);
  const articleId = parsed.pathname.split("/").filter(Boolean).at(-1);
  if (!articleId) {
    return newsUrl;
  }

  const pageResponse = await fetch(parsed, {
    headers: { "User-Agent": "Mozilla/5.0 WorldPulse article reader" },
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(8000),
  });

  if (!pageResponse.ok) {
    return newsUrl;
  }

  const { timestamp, signature } = articleAttributes(
    await pageResponse.text(),
  );
  if (!timestamp || !signature) {
    return newsUrl;
  }

  const payload = [
    "garturlreq",
    [
      [
        "en-US",
        "US",
        ["FINANCE_TOP_INDICES", "WEB_TEST_1_0_0"],
        null,
        null,
        1,
        1,
        "US:en",
        null,
        180,
        null,
        null,
        null,
        null,
        null,
        0,
      ],
      "en-US",
      "US",
      1,
      [2, 3, 4, 8],
      1,
      0,
      "655000234",
      0,
      0,
      null,
      0,
    ],
    articleId,
    timestamp,
    signature,
  ];
  const requestBody = new URLSearchParams({
    "f.req": JSON.stringify([
      [["Fbv4je", JSON.stringify(payload), null, "generic"]],
    ]),
  });

  const decodeResponse = await fetch(
    "https://news.google.com/_/DotsSplashUi/data/batchexecute",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 WorldPulse article reader",
      },
      body: requestBody,
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!decodeResponse.ok) {
    return newsUrl;
  }

  const responseText = await decodeResponse.text();
  const jsonLine = responseText
    .split("\n")
    .find((line) => line.startsWith("[["));
  if (!jsonLine) {
    return newsUrl;
  }

  const outer = JSON.parse(jsonLine) as unknown;
  if (
    !Array.isArray(outer) ||
    !Array.isArray(outer[0]) ||
    typeof outer[0][2] !== "string"
  ) {
    return newsUrl;
  }

  const decoded = JSON.parse(outer[0][2]) as unknown;
  if (
    !Array.isArray(decoded) ||
    typeof decoded[1] !== "string" ||
    !isTrustedExternalNewsUrl(decoded[1])
  ) {
    return newsUrl;
  }

  return decoded[1];
}

export async function resolveOriginalNewsUrl(
  newsUrl: string,
): Promise<string> {
  if (isTrustedExternalNewsUrl(newsUrl)) {
    return newsUrl;
  }

  try {
    const parsed = new URL(newsUrl);
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "news.google.com"
    ) {
      return newsUrl;
    }

    return await decodeGoogleNewsUrl(newsUrl);
  } catch {
    return newsUrl;
  }
}
