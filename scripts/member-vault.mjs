import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const params = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function encryptVault(value, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(password, salt, 32, params);
  try {
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
    return JSON.stringify({ version: 1, salt: salt.toString("base64"), iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), ciphertext: ciphertext.toString("base64") });
  } finally { key.fill(0); }
}

export function decryptVault(value, password) {
  const record = JSON.parse(value);
  if (record.version !== 1) throw new Error("不支援的加密資料格式。");
  const salt = Buffer.from(record.salt, "base64");
  const iv = Buffer.from(record.iv, "base64");
  const tag = Buffer.from(record.tag, "base64");
  if (salt.length !== 16 || iv.length !== 12 || tag.length !== 16) throw new Error("加密資料格式不正確。");
  const key = scryptSync(password, salt, 32, params);
  try {
    const cipher = createDecipheriv("aes-256-gcm", key, iv);
    cipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([cipher.update(Buffer.from(record.ciphertext, "base64")), cipher.final()]).toString("utf8"));
  } finally { key.fill(0); }
}

export function allowedPublisherHost(hostname) {
  const host = hostname.toLowerCase();
  if (host === "theinitium.com" || host.endsWith(".theinitium.com")) return "initium";
  if (host === "nytimes.com" || host.endsWith(".nytimes.com")) return "nyt";
  return null;
}

export async function fetchMemberPage(url, cookie, fetchImpl = fetch) {
  if (url.protocol !== "https:" || url.username || url.password || url.port || !allowedPublisherHost(url.hostname)) throw new Error("不支援的媒體網址。");
  let current = url;
  let response;
  for (let i = 0; i < 4; i += 1) {
    response = await fetchImpl(current, { redirect: "manual", headers: { Cookie: cookie, "User-Agent": "Mozilla/5.0 WorldPulse licensed article reader", Accept: "text/html,application/xhtml+xml" }, signal: AbortSignal.timeout(15000) });
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get("location");
    if (!location) throw new Error("媒體回傳沒有目的地的重新導向。");
    const next = new URL(location, current);
    if (next.protocol !== "https:" || next.hostname !== url.hostname || next.port || next.username || next.password) throw new Error("媒體轉向不同網域；為保護 Cookie 已停止，請改用實際原文網址。");
    current = next;
  }
  if (!response?.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error(`無法讀取文章（HTTP ${response?.status ?? "無回應"}）；登入可能已過期或媒體不支援此方式。`);
  const declaredSize = Number(response.headers.get("content-length"));
  if (declaredSize > 5000000) throw new Error("文章頁面過大。");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("媒體沒有回傳文章頁面。");
  const chunks = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 5000000) { await reader.cancel(); throw new Error("文章頁面過大。"); } chunks.push(value); }
  return Buffer.concat(chunks).toString("utf8");
}
