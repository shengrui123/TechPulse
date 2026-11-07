import { isChineseText } from "./language";

/** Reject obvious translation failures without trying to invent missing facts. */
export function isUsableTranslation(original: string, translated: string): boolean {
  if (!translated.trim() || !isChineseText(translated)) return false;
  const sourceYears = new Set(original.normalize("NFKC").match(/\b(?:19|20)\d{2}\b/g) ?? []);
  const output = translated.normalize("NFKC");
  return [...sourceYears].every((year) => output.includes(year));
}

/** A batch is trustworthy only when every marker appears once and in order. */
export function splitMarkedTranslations(result: string, expected: number): string[] | null {
  const matches = [...result.matchAll(/\[\[\[\s*WP\s*(\d+)\s*\]\]\]/gi)];
  if (matches.length !== expected || matches.some((match, index) => Number(match[1]) !== index)) return null;
  const values = matches.map((match, index) => result.slice((match.index ?? 0) + match[0].length, matches[index + 1]?.index ?? result.length).trim());
  return values.every(Boolean) ? values : null;
}
