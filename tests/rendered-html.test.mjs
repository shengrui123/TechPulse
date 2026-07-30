import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the editorial homepage and article detail routes", async () => {
  const [page, articlePage, header, articleData, layout, vercelConfig, packageJson] =
    await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/articles/[slug]/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/SiteHeader.tsx", projectRoot), "utf8"),
    readFile(new URL("app/data/articles.ts", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /把世界正在发生的事/);
  assert.match(page, /今日值得关注/);
  assert.match(page, /最新动态/);
  assert.match(page, /深度解读/);
  assert.match(page, /全球权威媒体与国际机构/);
  assert.match(page, /href=\{`\/articles\/\$\{/);
  assert.match(articlePage, /generateStaticParams/);
  assert.match(articlePage, /继续阅读/);
  assert.match(articlePage, /返回首页/);
  assert.match(articlePage, /查看 \{article.source\} 原始报道/);
  assert.match(header, /WorldPulse/);
  assert.match(header, /国际/);
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
  assert.match(articleData, /国际货币基金组织 IMF/);
  assert.match(articleData, /世界卫生组织 WHO/);
  assert.match(articleData, /联合国教科文组织 UNESCO/);
  assert.match(articleData, /美联社 AP/);
  assert.match(layout, /WorldPulse \| 读懂全球正在发生什么/);

  const vercel = JSON.parse(vercelConfig);
  const pkg = JSON.parse(packageJson);
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "next build --webpack");
  assert.equal(pkg.scripts.build, "next build --webpack");
  assert.doesNotMatch(packageJson, /cloudflare|vinext|wrangler/i);
});
