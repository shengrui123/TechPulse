import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { allowedPublisherHost, decryptVault, encryptVault, fetchMemberPage } from "./member-vault.mjs";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const vaultDir = join(homedir(), ".worldpulse");
const script = fileURLToPath(new URL("./import-licensed-article.mjs", import.meta.url));
const usage = `用法：
  node scripts/member-article.mjs setup --url "https://原媒體文章網址"
  node scripts/member-article.mjs fetch --url "https://原媒體文章網址" --title "標題" --date "2026-11-07T10:00:00+08:00" [--byline "作者"]
Cookie 和加密密碼只在本機終端機隱藏輸入，請勿貼在聊天中。`;
const { values, positionals } = parseArgs({ allowPositionals: true, options: { url: { type: "string" }, title: { type: "string" }, date: { type: "string" }, byline: { type: "string" }, help: { type: "boolean", short: "h" } } });
if (values.help || !values.url || !["setup", "fetch"].includes(positionals[0])) { console.log(usage); process.exit(values.help ? 0 : 1); }
if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("請在本機互動式終端機執行，以便安全輸入機密。");
const url = new URL(values.url);
const publisher = allowedPublisherHost(url.hostname);
if (url.protocol !== "https:" || url.username || url.password || url.port || !publisher || url.pathname === "/") throw new Error("請提供端傳媒或紐約時報的 HTTPS 原文文章網址。");
url.search = ""; url.hash = "";
const vaultPath = join(vaultDir, `${publisher}.enc`);

async function secret(label) {
  process.stdout.write(label);
  return new Promise((resolve, reject) => {
    let value = "";
    const input = process.stdin;
    input.setRawMode(true); input.resume(); input.setEncoding("utf8");
    function finish(error) { input.off("data", onData); input.setRawMode(false); input.pause(); process.stdout.write("\n"); if (error) reject(error); else resolve(value); }
    function onData(chunk) {
      for (const char of chunk) {
        if (char === "\u0003") return finish(new Error("已取消。"));
        if (char === "\r" || char === "\n") return finish();
        if (char === "\u007f" || char === "\b") value = [...value].slice(0, -1).join("");
        else if (char >= " ") value += char;
      }
    }
    input.on("data", onData);
  });
}

if (positionals[0] === "setup") {
  console.log(`將儲存 ${url.hostname} 的 Cookie，僅用於同一網域的文章請求。`);
  const cookie = await secret("貼上登入後的 Cookie 請求標頭值（不會顯示）：");
  if (!cookie || cookie.length > 16000 || /[\r\n\x00-\x1f\x7f]/.test(cookie)) throw new Error("Cookie 為空或含無效字元。");
  const password = await secret("設定本機加密密碼（至少 12 字元，不會顯示）：");
  if (password.length < 12) throw new Error("加密密碼至少需要 12 字元。");
  const confirmation = await secret("再次輸入加密密碼：");
  if (password !== confirmation) throw new Error("密碼不一致，未儲存。");
  await mkdir(vaultDir, { recursive: true, mode: 0o700 });
  const temporary = `${vaultPath}.${randomBytes(8).toString("hex")}.tmp`;
  const handle = await open(temporary, "wx", 0o600);
  try { await handle.writeFile(encryptVault({ hostname: url.hostname, cookie }, password), "utf8"); } finally { await handle.close(); }
  await rename(temporary, vaultPath);
  console.log(`已加密保存在 ${vaultPath}，不會提交到 GitHub。`);
} else {
  if (!values.title || !values.date) throw new Error("抓取文章時請提供 --title 和含時區的 --date。");
  const password = await secret("本機加密密碼（不會顯示）：");
  let saved;
  try { saved = decryptVault(await readFile(vaultPath, "utf8"), password); }
  catch { throw new Error("無法開啟加密資料；請確認已設定、密碼正確且檔案完整。"); }
  if (saved.hostname !== url.hostname || typeof saved.cookie !== "string" || /[\r\n\x00-\x1f\x7f]/.test(saved.cookie)) throw new Error("Cookie 所屬網域與文章網址不一致，請先為該網域重新設定。");
  const html = await fetchMemberPage(url, saved.cookie);
  const root = parse(html);
  const article = root.querySelector("article");
  if (!article) throw new Error("未找到可確認的文章正文；請使用手動匯入。");
  for (const node of article.querySelectorAll("script,style,nav,aside,footer,button,form,figure")) node.remove();
  const paragraphs = article.querySelectorAll("p").map((p) => p.text.replace(/\s+/g, " ").trim()).filter((p) => p.length >= 20);
  if (!paragraphs.length) throw new Error("未取得可用正文；請確認會員登入仍有效。");
  const filename = join(vaultDir, `preview-${randomBytes(8).toString("hex")}.txt`);
  const file = await open(filename, "wx", 0o600);
  try { await file.writeFile(`${paragraphs.join("\n\n")}\n`, "utf8"); } finally { await file.close(); }
  console.log(`已擷取 ${paragraphs.length} 段，預覽檔：${filename}`);
  console.log("請先打開預覽檔，與已登入的原文核對標題、全文與段落；系統無法自動保證是否抓到全文。");
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question("已核對內容完整且有權公開，現在匯入？輸入 yes 繼續： ");
  prompt.close();
  if (answer.trim() !== "yes") { console.log("尚未匯入，預覽檔仍保留供您檢查。"); process.exit(0); }
  const args = [script, "--url", url.toString(), "--title", values.title, "--date", values.date, "--file", filename];
  if (values.byline) args.push("--byline", values.byline);
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error("匯入失敗；預覽檔仍保留供您檢查。");
  await unlink(filename);
}
