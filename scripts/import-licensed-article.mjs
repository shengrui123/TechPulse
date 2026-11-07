import { readFile, writeFile, rename } from "node:fs/promises";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

const destination = process.env.LICENSED_ARTICLE_STORE || fileURLToPath(new URL("../app/data/licensed-articles.json", import.meta.url));
const { values } = parseArgs({ options: {
  url: { type: "string" }, title: { type: "string" }, date: { type: "string" },
  file: { type: "string" }, byline: { type: "string", default: "" },
  help: { type: "boolean", short: "h" },
} });
if (values.help || !values.url || !values.title || !values.date || !values.file) {
  console.log('用法：node scripts/import-licensed-article.mjs --url "原文網址" --title "文章標題" --date "2026-11-07T10:00:00+08:00" --file "全文.txt" [--byline "作者"]');
  process.exit(values.help ? 0 : 1);
}
let url;
try { url = new URL(values.url); } catch { throw new Error("原文網址無效。"); }
if (url.protocol !== "https:" || url.username || url.password) throw new Error("請使用不含帳號密碼的 HTTPS 原文網址。");
const hostname = url.hostname.replace(/^www\./, "");
const isHost = (host) => hostname === host || hostname.endsWith(`.${host}`);
const source = isHost("theinitium.com") ? "Initium Media" : isHost("nytimes.com") ? "The New York Times" : null;
if (!source || url.pathname === "/") throw new Error("僅支援端傳媒或紐約時報的文章網址。");
const date = new Date(values.date);
if (!Number.isFinite(date.getTime()) || !/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(values.date)) throw new Error("日期必須包含時間和時區，例如 2026-11-07T10:00:00+08:00。");
const title = values.title.trim();
if (!title || title.length > 500 || values.byline.length > 500) throw new Error("標題或作者無效。");
const body = await readFile(values.file, "utf8");
if (body.length > 500000) throw new Error("全文不得超過 500,000 字元。");
const paragraphs = body.replace(/^\uFEFF/, "").split(/\r?\n\s*\r?\n/).map((part) => part.replace(/\s*\r?\n\s*/g, " ").trim()).filter(Boolean);
if (!paragraphs.length) throw new Error("全文檔案是空的。");
url.hash = ""; url.search = ""; url.hostname = hostname; url.pathname = url.pathname.replace(/\/+$/, "") || "/";
const record = { source, url: url.toString(), title, publishedAt: date.toISOString(), byline: values.byline.trim(), paragraphs };
const records = JSON.parse(await readFile(destination, "utf8"));
if (!Array.isArray(records)) throw new Error("授權文章資料格式無效。");
const canonical = (value) => { const parsed = new URL(value); parsed.hash = ""; parsed.search = ""; parsed.hostname = parsed.hostname.replace(/^www\./, ""); parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/"; return parsed.toString(); };
const index = records.findIndex((item) => item.source === source && canonical(item.url) === record.url);
if (index >= 0) records[index] = record; else records.push(record);
const temporary = `${destination}.tmp`;
await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, "utf8");
await rename(temporary, destination);
console.log(`${index >= 0 ? "已更新" : "已匯入"}：${title}（${source}，${paragraphs.length} 段）`);
console.log("全文已寫入網站原始碼；推送並部署後，網站訪客及儲存庫有權限的讀者可看到全文。");
