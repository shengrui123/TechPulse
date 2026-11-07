import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
function loadModule(file, dependencies = {}) {
  const input = readFileSync(new URL(file, import.meta.url), "utf8");
  const code = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require: (name) => dependencies[name] });
  return loaded.exports;
}
const language = loadModule("../app/data/language.ts");
const quality = loadModule("../app/data/translation-quality.ts", { "./language": language });

test("recognizes both forms of Chinese without mistaking Japanese or Korean for Chinese", () => {
  assert.equal(language.isChineseText("人工智能正在改变世界"), true);
  assert.equal(language.isChineseText("人工智慧正在改變世界"), true);
  assert.equal(language.isChineseText("日本の政府が新しい政策を発表"), false);
  assert.equal(language.isChineseText("한국 정부가 새로운 정책을 발표했다"), false);
  assert.equal(language.isChineseText("The government announced a new policy"), false);
});

test("rejects missing years and untranslated output", () => {
  assert.equal(quality.isUsableTranslation("Agreement signed in 2026", "协议于2026年签署"), true);
  assert.equal(quality.isUsableTranslation("Agreement signed in 2026", "协议于2025年签署"), false);
  assert.equal(quality.isUsableTranslation("Agreement signed in 2026", "Agreement signed in 2026"), false);
});

test("rejects missing, reordered and duplicated batch markers", () => {
  assert.deepEqual(Array.from(quality.splitMarkedTranslations("[[[WP0]]] 甲 [[[WP1]]] 乙", 2)), ["甲", "乙"]);
  assert.equal(quality.splitMarkedTranslations("[[[WP1]]] 乙 [[[WP0]]] 甲", 2), null);
  assert.equal(quality.splitMarkedTranslations("[[[WP0]]] 甲 [[[WP0]]] 乙", 2), null);
  assert.equal(quality.splitMarkedTranslations("[[[WP0]]] 甲", 2), null);
});
