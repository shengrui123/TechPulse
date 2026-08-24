import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the live-news homepage, article routes, and trusted sources", async () => {
  const [
    page,
    newsPage,
    sourceNewsBrowser,
    categoryPage,
    newsStream,
    newsStoryPage,
    newsStoryData,
    newsArticleContent,
    languageData,
    googleNewsData,
    newsImageRoute,
    liveNews,
    articlePage,
    sourcesPage,
    header,
    articleData,
    sourceData,
    loading,
    layout,
    globalStyles,
    vercelConfig,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/news/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/SourceNewsBrowser.tsx", projectRoot), "utf8"),
    readFile(new URL("app/news/[category]/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/NewsStream.tsx", projectRoot), "utf8"),
    readFile(new URL("app/news/story/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/data/news-story.ts", projectRoot), "utf8"),
    readFile(
      new URL("app/data/news-article-content.ts", projectRoot),
      "utf8",
    ),
    readFile(new URL("app/data/language.ts", projectRoot), "utf8"),
    readFile(new URL("app/data/google-news.ts", projectRoot), "utf8"),
    readFile(new URL("app/api/news-image/route.ts", projectRoot), "utf8"),
    readFile(new URL("app/data/live-news.ts", projectRoot), "utf8"),
    readFile(new URL("app/articles/[slug]/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/sources/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", projectRoot), "utf8"),
    readFile(new URL("app/data/articles.ts", projectRoot), "utf8"),
    readFile(new URL("app/data/sources.ts", projectRoot), "utf8"),
    readFile(new URL("app/loading.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /getAllSourceNews\(\)/);
  assert.match(page, /<NewsStream news=\{news\} hideHeader \/>/);
  assert.match(newsPage, /getAllSourceNews\(\)/);
  assert.match(newsPage, /sources=\{liveNewsSourceDirectory\}/);
  assert.match(categoryPage, /getNewsByCategory/);
  assert.match(categoryPage, /isNewsCategory/);
  assert.match(categoryPage, /categoryLabels/);
  assert.match(newsPage, /heading="全部新闻"/);
  assert.match(newsPage, /encodeNewsStory/);
  assert.match(sourceNewsBrowser, /按媒体查看报道/);
  assert.match(sourceNewsBrowser, /搜索媒体来源/);
  assert.match(sourceNewsBrowser, /的全部报道/);
  assert.match(sourceNewsBrowser, /sourceName/);
  assert.match(sourceNewsBrowser, /matchedSources/);
  assert.match(sourceNewsBrowser, /orderedSources/);
  assert.match(sourceNewsBrowser, /activeSourceCount/);
  assert.doesNotMatch(sourceNewsBrowser, /new Map<string/);
  assert.match(categoryPage, /<NewsStream news=\{news\} hideHeader \/>/);
  assert.match(newsStream, /news-waterfall/);
  assert.match(newsStream, /最近的国际新闻/);
  assert.match(newsStream, /showMore/);
  assert.match(newsStream, /href="\/news"/);
  assert.match(newsStream, /查看更多/);
  assert.match(newsStream, /news-card-image/);
  assert.doesNotMatch(newsStream, /news-card-index/);
  assert.doesNotMatch(sourceNewsBrowser, /news-card-index/);
  assert.match(newsStream, /\/api\/news-image\?url=/);
  assert.match(newsStream, /source=\$\{encodeURIComponent\(item\.source\)\}/);
  assert.match(
    newsStream,
    /title=\$\{encodeURIComponent\(item\.originalTitle \|\| item\.title\)\}/,
  );
  assert.match(
    sourceNewsBrowser,
    /title=\$\{encodeURIComponent\(item\.originalTitle \|\| item\.title\)\}/,
  );
  assert.match(newsStream, /\/news\/story\?story=/);
  assert.ok(
    newsStream.indexOf("news-card-image") <
      newsStream.indexOf("<h2>{item.title}</h2>"),
    "news image should appear before the news title",
  );
  assert.match(newsStoryPage, /news-article-page/);
  assert.match(newsStoryPage, /news-article-title-stack/);
  assert.match(newsStoryPage, /news-article-image/);
  assert.match(newsStoryPage, /articleContent\.imageUrl/);
  assert.doesNotMatch(newsStoryPage, /news-article-deck/);
  assert.match(newsStoryPage, /阅读完整原文/);
  assert.match(newsStoryPage, /完整报道、后续更新及图片版权信息/);
  assert.match(newsStoryPage, /Reuters RSS 仅提供标题、链接与发布时间/);
  assert.match(newsStoryPage, /仅标题与链接/);
  assert.match(newsStoryData, /encodeNewsStory/);
  assert.match(newsStoryData, /decodeNewsStory/);
  assert.match(newsStoryData, /cleanStoryText/);
  assert.match(newsStoryData, /originalTitle/);
  assert.match(newsStoryData, /&nbsp;/);
  assert.match(newsStoryData, /isSupportedNewsUrl/);
  assert.match(googleNewsData, /resolveOriginalNewsUrl/);
  assert.match(googleNewsData, /isTrustedExternalNewsUrl/);
  assert.match(googleNewsData, /Fbv4je/);
  assert.match(newsStoryPage, /resolveOriginalNewsUrl/);
  assert.match(newsStoryPage, /fetchArticleContent/);
  assert.match(newsStoryPage, /originalTitle: story\.originalTitle/);
  assert.match(newsStoryPage, /articleContent\.matched/);
  assert.match(newsStoryPage, /articleParagraphs/);
  assert.match(newsStoryPage, /showOriginal: !isChineseText\(original\)/);
  assert.match(newsStoryPage, /\{showOriginal && \(/);
  assert.match(newsStoryPage, /news-article-bilingual-block/);
  assert.match(newsStoryPage, /news-article-original/);
  assert.match(newsStoryPage, /news-article-translation/);
  assert.match(newsStoryPage, /lang="en"/);
  assert.match(newsStoryPage, /lang="zh-CN"/);
  assert.match(newsStoryPage, /RSS 摘要/);
  assert.match(newsStoryPage, /rssSourceLabel/);
  assert.match(newsStoryPage, /Google News RSS/);
  assert.match(newsStoryPage, /原媒体官方 RSS/);
  assert.match(newsStoryPage, /授权全文/);
  assert.match(newsStoryPage, /完整公开正文/);
  assert.match(newsStoryPage, /新闻节选/);
  assert.match(newsStoryPage, /阅读完整原文/);
  assert.match(newsStoryPage, /不设段落或字数上限/);
  assert.doesNotMatch(newsStoryPage, /阅读语言/);
  assert.doesNotMatch(newsStoryPage, /简体中文/);
  assert.match(
    globalStyles,
    /\.news-article-byline\s*\{[^}]*border-bottom:\s*0;/s,
  );
  assert.match(
    globalStyles,
    /\.news-article-bilingual-block\s*\{[^}]*border-bottom:\s*0;/s,
  );
  assert.doesNotMatch(
    globalStyles,
    /linear-gradient\(rgba\(12, 12, 12, 0\.025\) 1px/,
  );
  assert.match(
    globalStyles,
    /\.source-principles\s*\{[^}]*background:\s*transparent;[^}]*color:\s*var\(--ink\);/s,
  );
  assert.match(
    globalStyles,
    /\.principle-grid p\s*\{[^}]*color:\s*var\(--muted\);/s,
  );
  assert.match(
    globalStyles,
    /\.sources-hero h1\s*\{[^}]*font-size:\s*clamp\(48px, 5\.5vw, 82px\);/s,
  );
  assert.match(
    globalStyles,
    /\.sources-hero > p:last-child\s*\{[^}]*font-size:\s*15px;/s,
  );
  assert.match(newsArticleContent, /articleBody/);
  assert.match(newsArticleContent, /imageUrl: string/);
  assert.match(newsArticleContent, /articleImageFromHtml/);
  assert.match(newsArticleContent, /summary-img-substitute/);
  assert.match(newsArticleContent, /originalParagraphs/);
  assert.match(newsArticleContent, /paragraphsFromMarkdown/);
  assert.match(newsArticleContent, /reutersSyndicationUrl/);
  assert.match(newsArticleContent, /reutersSyndicationUrlFromIndex/);
  assert.match(newsArticleContent, /paragraphsFromReutersSyndication/);
  assert.match(newsArticleContent, /https:\/\/www\.internazionale\.it\/ultime-notizie-reuters\//);
  assert.match(newsArticleContent, /reuters-content-en/);
  assert.match(newsArticleContent, /X-Target-Selector.*reuters-content-en/s);
  assert.match(newsArticleContent, /process\.env\.JINA_API_KEY/);
  assert.match(newsArticleContent, /https:\/\/r\.jina\.ai\//);
  assert.match(newsArticleContent, /X-Target-Selector/);
  assert.match(newsArticleContent, /application\\\/ld\\\+json/);
  assert.match(newsArticleContent, /semanticRegions/);
  assert.match(newsArticleContent, /text-long/);
  assert.match(newsArticleContent, /readableParagraphs/);
  assert.match(newsArticleContent, /buildLongExcerpt/);
  assert.match(newsArticleContent, /mode === "full"/);
  assert.match(newsArticleContent, /mode === "complete"/);
  assert.match(newsArticleContent, /\? extracted\.paragraphs/);
  assert.doesNotMatch(newsArticleContent, /selected\.length >= 7/);
  assert.doesNotMatch(newsArticleContent, /characters >= 2600/);
  assert.doesNotMatch(newsArticleContent, /paragraphs\.slice\(0, 80\)/);
  assert.match(newsArticleContent, /contentPolicyForUrl/);
  assert.match(newsArticleContent, /urlMatchesSource/);
  assert.match(newsArticleContent, /titlesLikelyMatch/);
  assert.match(newsArticleContent, /headlineFromHtml/);
  assert.match(newsArticleContent, /clients5\.google\.com/);
  assert.match(newsArticleContent, /translateToChinese/);
  assert.match(newsArticleContent, /r\.jina\.ai/);
  assert.match(newsArticleContent, /fetchReutersSyndicationContent/);
  assert.match(newsArticleContent, /fetchReutersPartnerContent/);
  assert.match(newsArticleContent, /fetchReutersPartnerImage/);
  assert.ok(
    newsArticleContent.indexOf("const partner = await fetchReutersPartnerContent") <
      newsArticleContent.indexOf(
        "const syndicated = await fetchReutersSyndicationContent",
      ),
    "Reuters partner content and its article image should be preferred",
  );
  assert.match(newsArticleContent, /resolveGoogleNewsUrlForHosts/);
  assert.match(newsArticleContent, /channelnewsasia\.com/);
  assert.match(newsArticleContent, /finance\.yahoo\.com/);
  assert.match(newsArticleContent, /investing\.com/);
  assert.match(newsArticleContent, /isChineseText/);
  assert.match(languageData, /hanCharacters/);
  assert.match(newsStoryPage, /paragraphizeSummary/);
  assert.match(newsStoryPage, /较长节选/);
  assert.match(newsImageRoute, /resolveOriginalNewsUrl/);
  assert.match(newsImageRoute, /og:image/);
  assert.match(newsImageRoute, /fetchReutersPartnerImage/);
  assert.match(newsImageRoute, /source === "Reuters" && title/);
  assert.match(newsImageRoute, /world-brief\.png/);
  assert.match(liveNews, /trustedSources\.map/);
  assert.match(liveNews, /site:\$\{domain\} when:7d/);
  assert.match(liveNews, /content:encoded/);
  assert.match(liveNews, /summary\.length > 4000/);
  assert.match(liveNews, /source\.rssUrl \?\? googleNewsFeedUrl/);
  assert.match(liveNews, /newsWindowMs = 24/);
  assert.match(liveNews, /路透社/);
  assert.match(liveNews, /美联社/);
  assert.match(liveNews, /法新社/);
  assert.match(liveNews, /英国广播公司新闻网/);
  assert.match(liveNews, /德国之声/);
  assert.match(liveNews, /法国 24 台/);
  assert.match(liveNews, /日本广播协会国际台/);
  assert.match(liveNews, /加拿大广播公司新闻网/);
  assert.match(liveNews, /澳大利亚广播公司新闻网/);
  assert.match(liveNews, /半岛电视台/);
  assert.match(liveNews, /报导者/);
  assert.match(liveNews, /中央社/);
  assert.match(liveNews, /纽约时报/);
  assert.match(liveNews, /华盛顿邮报/);
  assert.match(liveNews, /卫报/);
  assert.match(liveNews, /西班牙国家报/);
  assert.match(liveNews, /世界报/);
  assert.match(liveNews, /印度教徒报/);
  assert.match(liveNews, /亚洲新闻台/);
  assert.match(liveNews, /端传媒/);
  assert.match(liveNews, /彭博社/);
  assert.match(liveNews, /金融时报/);
  assert.match(liveNews, /华尔街日报/);
  assert.match(liveNews, /经济学人/);
  assert.match(liveNews, /日经亚洲/);
  assert.match(liveNews, /ProPublica 调查新闻/);
  assert.match(liveNews, /translationBatches/);
  assert.match(liveNews, /originalTitle/);
  assert.match(liveNews, /translationBatchCharacters/);
  assert.match(liveNews, /translateTargetsIndividually/);
  assert.match(liveNews, /translationEndpoints/);
  assert.match(liveNews, /clients5\.google\.com/);
  assert.match(liveNews, /attempt < 2/);
  assert.match(liveNews, /isChineseText/);
  assert.match(liveNews, /for \(let pass = 0; pass < 3/);
  assert.match(liveNews, /fetchAllFeeds/);
  assert.match(liveNews, /getSourceEdition/);
  assert.match(liveNews, /getAllSourceNews/);
  assert.match(liveNews, /liveNewsSourceDirectory/);
  assert.match(liveNews, /allSourceNewsWindowMs = newsWindowMs/);
  assert.match(liveNews, /publishedAt >= cutoff/);
  assert.match(liveNews, /field\(xml, "lastBuildDate"\)/);
  assert.match(liveNews, /feedPublishedAt/);
  assert.match(liveNews, /isActualNewsArticle/);
  assert.match(liveNews, /item\.source !== "Reuters"/);
  assert.match(liveNews, /\[0-9\]\{4\}/);
  assert.doesNotMatch(liveNews, /maxStoriesPerSource/);
  assert.match(liveNews, /worldpulse-all-source-news-24h-v9/);
  assert.match(liveNews, /feedConcurrency = 26/);
  assert.match(liveNews, /unstable_cache/);
  assert.match(liveNews, /worldpulse-source-edition-24h-v9/);
  assert.match(loading, /route-loading-bar/);
  assert.match(loading, /route-loading-mark/);
  assert.doesNotMatch(loading, /worldpulse-logo\.png/);
  assert.match(loading, /正在加载新闻/);
  assert.match(layout, /worldpulse-logo\.png/);
  assert.match(layout, /image\/png/);
  assert.match(liveNews, /translate\.googleapis\.com/);
  assert.match(liveNews, /tl", "zh-CN"/);
  assert.match(newsStream, /trustedSources\.length/);
  assert.match(newsStream, /activeSourceCount/);
  assert.match(newsStream, /最近 24/);
  assert.match(newsPage, /maxDuration = 300/);
  assert.match(page, /maxDuration = 300/);
  assert.match(liveNews, /sorted\.slice\(0, limit\)/);
  assert.match(liveNews, /revalidate: 1800/);
  assert.match(newsArticleContent, /cache: "no-store"/);
  assert.match(articlePage, /generateStaticParams/);
  assert.match(articlePage, /继续阅读/);
  assert.match(articlePage, /返回首页/);
  assert.match(articlePage, /查看 \{article.source\} 原始报道/);
  assert.match(header, /WorldPulse/);
  assert.match(header, /newsCategories/);
  assert.match(header, /`\/news\/\$\{id\}`/);
  assert.match(header, /信源标准/);
  assert.match(header, /nav-search-link/);
  assert.match(header, /floating-search/);
  assert.match(header, /\/news#source-search/);
  assert.doesNotMatch(header, /THE DAILY EDITION · SHANGHAI/);
  assert.doesNotMatch(
    `${page}\n${articlePage}\n${header}`,
    /資訊來源|资讯来源|来源库|sources-band|source-row/,
  );

  const slugs = [...articleData.matchAll(/slug: "([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(slugs.length, 10);
  assert.equal(new Set(slugs).size, slugs.length);

  const sourceUrls = [...articleData.matchAll(/sourceUrl:\s*\n?\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(sourceUrls.length, slugs.length);
  assert.ok(sourceUrls.every((url) => url.startsWith("https://")));
  assert.match(articleData, /Associated Press \/ AP/);
  assert.match(articleData, /ProPublica/);
  assert.match(articleData, /2026\.07\.30/);
  assert.match(articleData, /乌克兰称袭击俄两座大型炼油厂/);
  assert.match(layout, /WorldPulse \| 读懂全球正在发生什么/);

  const trustedNames = [
    "BBC News",
    "Reuters",
    "The Wall Street Journal",
    "Bloomberg",
    "Associated Press",
    "Agence France-Presse",
    "The New York Times",
    "The Washington Post",
    "The Guardian",
    "ProPublica",
    "Financial Times",
    "The Economist",
    "United Daily News",
  ];
  trustedNames.forEach((name) => assert.match(sourceData, new RegExp(name)));
  assert.match(sourcesPage, /可信不是标签/);
  assert.match(sourcesPage, /交叉查核/);

  const directoryUrls = [
    ...sourceData.matchAll(/url: "([^"]+)"/g),
  ].map((match) => match[1]);
  assert.equal(directoryUrls.length, 27);
  assert.ok(directoryUrls.every((url) => url.startsWith("https://")));

  const rssUrls = [...sourceData.matchAll(/rssUrl:\s*\n?\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(rssUrls.length, 8);
  assert.ok(rssUrls.every((url) => url.startsWith("https://")));
  assert.ok(
    rssUrls.includes(
      "https://feedfoundry-rss.vercel.app/feeds/445fc7e3c09155599ac6.xml",
    ),
  );
  assert.ok(
    rssUrls.includes(
      "https://feedfoundry-rss.vercel.app/feeds/938754f9bd588c147a53.xml",
    ),
  );
  assert.ok(rssUrls.includes("https://theinitium.com/rss/"));
  assert.ok(rssUrls.includes("https://udn.com/news/rssfeed/"));
  assert.ok(
    rssUrls.includes("https://www.aljazeera.com/xml/rss/all.xml"),
  );
  assert.ok(
    rssUrls.includes(
      "https://feedfoundry-rss.vercel.app/feeds/938754f9bd588c147a53.xml",
    ),
  );
  assert.ok(
    rssUrls.includes(
      "https://public.twreporter.org/rss/twreporter-rss.xml",
    ),
  );

  const vercel = JSON.parse(vercelConfig);
  const pkg = JSON.parse(packageJson);
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "next build --webpack");
  assert.equal(pkg.scripts.build, "next build --webpack");
  assert.doesNotMatch(packageJson, /cloudflare|vinext|wrangler/i);
});
