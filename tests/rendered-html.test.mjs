import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the TechPulse intelligence platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>TechPulse \| 洞察全球科技，預見未來趨勢<\/title>/i,
  );
  assert.match(html, /AI 驅動的全球科技資訊情報平台/);
  assert.match(html, /今日科技焦點/);
  assert.match(html, /24 個高價值科技資訊源/);
  assert.match(html, /TechCrunch/);
  assert.match(html, /Hacker News/);
  assert.match(html, /從全球原文到可信情報/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});
