import assert from "node:assert/strict";
import test from "node:test";
import { allowedPublisherHost, decryptVault, encryptVault, fetchMemberPage } from "../scripts/member-vault.mjs";

test("encrypts Cookie and rejects wrong passwords and tampering", () => {
  const payload = { hostname: "theinitium.com", cookie: "session=example-sensitive-value" };
  const secret = "test long password";
  const vault = encryptVault(payload, secret);
  assert.ok(!vault.includes(payload.cookie));
  assert.deepEqual(decryptVault(vault, secret), payload);
  assert.throws(() => decryptVault(vault, "wrong password"));
  const altered = JSON.parse(vault);
  const ciphertext = Buffer.from(altered.ciphertext, "base64"); ciphertext[0] ^= 1;
  altered.ciphertext = ciphertext.toString("base64");
  assert.throws(() => decryptVault(JSON.stringify(altered), secret));
});

test("only recognizes the two publisher domains", () => {
  assert.equal(allowedPublisherHost("www.nytimes.com"), "nyt");
  assert.equal(allowedPublisherHost("theinitium.com"), "initium");
  assert.equal(allowedPublisherHost("nytimes.com.example.org"), null);
});

test("never sends the Cookie after a cross-domain redirect", async () => {
  const calls = [];
  const fakeFetch = async (url, options) => {
    calls.push({ url: url.toString(), cookie: options.headers.Cookie });
    return new Response(null, { status: 302, headers: { location: "https://example.org/collect" } });
  };
  await assert.rejects(fetchMemberPage(new URL("https://theinitium.com/article/one"), "session=test", fakeFetch), /不同網域/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://theinitium.com/article/one");
});

test("follows same-host redirects and returns the page", async () => {
  let calls = 0;
  const fakeFetch = async () => ++calls === 1
    ? new Response(null, { status: 302, headers: { location: "/article/updated" } })
    : new Response("<article>ok</article>", { status: 200, headers: { "content-type": "text/html" } });
  assert.equal(await fetchMemberPage(new URL("https://theinitium.com/article/one"), "session=test", fakeFetch), "<article>ok</article>");
  assert.equal(calls, 2);
});


test("rejects non-publisher addresses before making a request", async () => {
  let requested = false;
  const fakeFetch = async () => { requested = true; throw new Error("unexpected request"); };
  await assert.rejects(fetchMemberPage(new URL("https://example.org/"), "session=test", fakeFetch), /不支援/);
  assert.equal(requested, false);
});
