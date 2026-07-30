import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the editorial homepage, article routes, and trusted sources", async () => {
  const [
    page,
    newsPage,
    liveNews,
    articlePage,
    sourcesPage,
    header,
    articleData,
    sourceData,
    layout,
    vercelConfig,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/news/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/data/live-news.ts", projectRoot), "utf8"),
    readFile(new URL("app/articles/[slug]/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/sources/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", projectRoot), "utf8"),
    readFile(new URL("app/data/articles.ts", projectRoot), "utf8"),
    readFile(new URL("app/data/sources.ts", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /把世界正在发生的事/);
  assert.match(page, /今日值得关注/);
  assert.match(page, /最新动态/);
  assert.match(page, /深度解读/);
  assert.match(page, /全球权威媒体与国际机构/);
  assert.match(page, /href="\/news"/);
  assert.match(page, /查看更多/);
  assert.match(page, /href=\{`\/articles\/\$\{/);
  assert.ok(
    page.indexOf('id="latest"') < page.indexOf('id="featured"'),
    "latest news should appear before editor picks",
  );
  assert.match(newsPage, /getLatestInternationalNews\(\)/);
  assert.match(newsPage, /news-waterfall/);
  assert.match(newsPage, /最近的国际新闻/);
  assert.match(liveNews, /trustedSources\.map/);
  assert.match(liveNews, /site:\$\{domain\} when:2d/);
  assert.match(liveNews, /newsWindowMs = 48/);
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
  assert.match(liveNews, /纽约时报/);
  assert.match(liveNews, /华盛顿邮报/);
  assert.match(liveNews, /卫报/);
  assert.match(liveNews, /西班牙国家报/);
  assert.match(liveNews, /世界报/);
  assert.match(liveNews, /印度教徒报/);
  assert.match(liveNews, /亚洲新闻台/);
  assert.match(liveNews, /彭博社/);
  assert.match(liveNews, /金融时报/);
  assert.match(liveNews, /华尔街日报/);
  assert.match(liveNews, /经济学人/);
  assert.match(liveNews, /日经亚洲/);
  assert.match(liveNews, /ProPublica 调查新闻/);
  assert.match(liveNews, /translationBatches/);
  assert.match(liveNews, /translationBatchCharacters/);
  assert.match(liveNews, /fetchAllFeeds/);
  assert.match(liveNews, /feedConcurrency = 3/);
  assert.match(liveNews, /translate\.googleapis\.com/);
  assert.match(liveNews, /tl", "zh-CN"/);
  assert.match(newsPage, /trustedSources\.length/);
  assert.match(newsPage, /activeSourceCount/);
  assert.match(newsPage, /最近 48/);
  assert.match(newsPage, /maxDuration = 300/);
  assert.match(liveNews, /revalidate: 900/);
  assert.match(articlePage, /generateStaticParams/);
  assert.match(articlePage, /继续阅读/);
  assert.match(articlePage, /返回首页/);
  assert.match(articlePage, /查看 \{article.source\} 原始报道/);
  assert.match(header, /WorldPulse/);
  assert.match(header, /国际/);
  assert.match(header, /信源标准/);
  assert.match(header, /订阅全球晨报/);
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
  ];
  trustedNames.forEach((name) => assert.match(sourceData, new RegExp(name)));
  assert.match(sourcesPage, /可信不是标签/);
  assert.match(sourcesPage, /交叉查核/);

  const directoryUrls = [
    ...sourceData.matchAll(/url: "([^"]+)"/g),
  ].map((match) => match[1]);
  assert.equal(directoryUrls.length, 23);
  assert.ok(directoryUrls.every((url) => url.startsWith("https://")));

  const vercel = JSON.parse(vercelConfig);
  const pkg = JSON.parse(packageJson);
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "next build --webpack");
  assert.equal(pkg.scripts.build, "next build --webpack");
  assert.doesNotMatch(packageJson, /cloudflare|vinext|wrangler/i);
});
