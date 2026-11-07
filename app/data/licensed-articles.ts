import entries from "./licensed-articles.json";

export type LicensedArticle = {
  source: "Initium Media" | "The New York Times";
  url: string;
  title: string;
  publishedAt: string;
  byline: string;
  paragraphs: string[];
};

export const licensedArticles = entries as LicensedArticle[];

export function canonicalArticleUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.replace(/^www\./, "");
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return "";
  }
}

export function findLicensedArticle(url: string, source: string): LicensedArticle | undefined {
  const canonical = canonicalArticleUrl(url);
  if (!canonical) return undefined;
  return licensedArticles.find((article) => article.source === source && canonicalArticleUrl(article.url) === canonical);
}
