/**
 * Treat text as Chinese only when Han characters make up a meaningful share
 * of its letters. This keeps Chinese copy containing Latin product names from
 * being translated, without misclassifying otherwise non-Chinese copy that
 * happens to contain one Chinese character.
 */
export function isChineseText(value: string): boolean {
  // Japanese and Korean commonly contain Han characters too.
  if (/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(value)) {
    return false;
  }
  const hanCharacters =
    value.match(/[\u3400-\u9fff\uf900-\ufaff]/gu)?.length ?? 0;
  if (hanCharacters === 0) {
    return false;
  }

  const allLetters = value.match(/\p{L}/gu)?.length ?? 0;
  return hanCharacters / Math.max(1, allLetters) >= 0.2;
}
