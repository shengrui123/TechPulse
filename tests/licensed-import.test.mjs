import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = new URL("../scripts/import-licensed-article.mjs", import.meta.url);

test("imports and updates authorized articles while rejecting unrelated sources", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "licensed-article-"));
  try {
    const store = path.join(dir, "articles.json");
    const body = path.join(dir, "body.txt");
    await writeFile(store, "[]");
    await writeFile(body, "First paragraph.\n\nSecond paragraph.\n");
    const args = [script.pathname, "--url", "https://www.nytimes.com/2026/11/07/world/example.html?tracking=1", "--title", "Test article", "--date", "2026-11-07T10:00:00+08:00", "--file", body];
    const run = (input) => spawnSync(process.execPath, input, { encoding: "utf8", env: { ...process.env, LICENSED_ARTICLE_STORE: store } });
    assert.equal(run(args).status, 0);
    let data = JSON.parse(await readFile(store, "utf8"));
    assert.equal(data.length, 1);
    assert.equal(data[0].source, "The New York Times");
    assert.equal(data[0].url, "https://nytimes.com/2026/11/07/world/example.html");
    assert.deepEqual(data[0].paragraphs, ["First paragraph.", "Second paragraph."]);
    await writeFile(body, "Updated paragraph.");
    assert.equal(run(args).status, 0);
    data = JSON.parse(await readFile(store, "utf8"));
    assert.equal(data.length, 1);
    assert.deepEqual(data[0].paragraphs, ["Updated paragraph."]);
    const invalid = [...args]; invalid[2] = "https://example.com/article";
    assert.notEqual(run(invalid).status, 0);
    assert.equal(JSON.parse(await readFile(store, "utf8")).length, 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("matches imported articles by publisher and canonical URL", async () => {
  const { createRequire } = await import("node:module");
  const vm = await import("node:vm");
  const require = createRequire(import.meta.url);
  const ts = require("typescript");
  const input = await readFile(new URL("../app/data/licensed-articles.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const entry = { source: "Initium Media", url: "https://theinitium.com/article/example", title: "測試", publishedAt: "2026-11-07T02:00:00.000Z", byline: "", paragraphs: ["第一段", "第二段"] };
  const loaded = { exports: {} };
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, URL, require: () => ({ default: [entry] }) });
  assert.equal(loaded.exports.findLicensedArticle("https://www.theinitium.com/article/example/?tracking=1", "Initium Media")?.title, "測試");
  assert.equal(loaded.exports.findLicensedArticle(entry.url, "The New York Times"), undefined);
  assert.equal(loaded.exports.findLicensedArticle("https://theinitium.com/article/other", "Initium Media"), undefined);
});
