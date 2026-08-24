/**
 * Treat text as Chinese only when Han characters make up a meaningful share
 * of its letters. This keeps Chinese copy containing Latin product names from
 * being translated, without misclassifying otherwise non-Chinese copy that
 * happens to contain one Chinese character.
 */
export function isChineseText(value: string): boolean {
  const hanCharacters =
    value.match(/[\u3400-\u9fff\uf900-\ufaff]/gu)?.length ?? 0;
  if (hanCharacters === 0) {
    return false;
  }

  const latinCharacters = value.match(/[a-z]/giu)?.length ?? 0;
  return hanCharacters / Math.max(1, hanCharacters + latinCharacters) >= 0.2;
}
