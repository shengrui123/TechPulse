import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the TechPulse product content in the Next.js page", async () => {
  const [page, layout, vercelConfig, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("vercel.json", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /AI 驅動的全球科技資訊情報平台/);
  assert.match(page, /今日科技焦點/);
  assert.match(page, /24 個高價值科技資訊源/);
  assert.match(page, /TechCrunch/);
  assert.match(page, /Hacker News/);
  assert.match(page, /從全球原文到可信情報/);
  assert.match(layout, /TechPulse \| 洞察全球科技，預見未來趨勢/);

  const vercel = JSON.parse(vercelConfig);
  const pkg = JSON.parse(packageJson);
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "next build --webpack");
  assert.equal(pkg.scripts.build, "next build --webpack");
  assert.doesNotMatch(packageJson, /cloudflare|vinext|wrangler/i);
});
