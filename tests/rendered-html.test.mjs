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

  assert.match(page, /AI 驱动的全球科技情报/);
  assert.match(page, /今日科技焦点/);
  assert.match(page, /编辑精选/);
  assert.match(page, /趋势仪表板/);
  assert.match(page, /AI 研究助手/);
  assert.match(page, /从全球动态，到可信情报/);
  assert.doesNotMatch(page, /資訊來源|资讯来源|sources-band|source-row/);
  assert.match(layout, /TechPulse \| 洞察全球科技，预见未来趋势/);

  const vercel = JSON.parse(vercelConfig);
  const pkg = JSON.parse(packageJson);
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "next build --webpack");
  assert.equal(pkg.scripts.build, "next build --webpack");
  assert.doesNotMatch(packageJson, /cloudflare|vinext|wrangler/i);
});
