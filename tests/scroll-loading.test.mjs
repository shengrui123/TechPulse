import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");

test("re-observes the load marker after every batch even when it stays visible", () => {
  const effects = [];
  const refs = [];
  let cursor = 0;
  let observed = 0;
  let disconnected = 0;
  class FakeObserver {
    constructor(callback) { this.callback = callback; }
    observe() { observed++; this.callback([{ isIntersecting: true }]); }
    disconnect() { disconnected++; }
  }
  const react = {
    useRef(value) { const index = cursor++; return refs[index] ??= { current: value === null ? {} : value }; },
    useEffect(callback, dependencies) {
      const index = cursor++;
      const old = effects[index];
      const changed = !old || !dependencies || dependencies.some((value, i) => !Object.is(value, old.dependencies?.[i]));
      if (changed) effects[index] = { dependencies, callback, cleanup: old?.cleanup, pending: true };
    },
  };
  const source = readFileSync(new URL("../app/components/LoadMoreTrigger.tsx", import.meta.url), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, { module: loaded, exports: loaded.exports, window: { IntersectionObserver: FakeObserver }, IntersectionObserver: FakeObserver, require: (id) => id === "react" ? react : { jsx: () => ({}) } });
  let loads = 0;
  function render(revision, error = false) {
    cursor = 0;
    loaded.exports.default({ onLoad: () => { loads++; }, revision, error });
    for (const effect of effects) if (effect?.pending) { effect.cleanup?.(); effect.cleanup = effect.callback(); effect.pending = false; }
  }
  render(24); render(48); render(72); render(96);
  assert.equal(loads, 4);
  assert.equal(observed, 4);
  assert.equal(disconnected, 3);
  render(96, true);
  assert.equal(loads, 4, "errors should stop automatic retry");
});
