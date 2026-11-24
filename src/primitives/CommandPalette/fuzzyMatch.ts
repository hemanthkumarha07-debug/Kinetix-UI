export interface FuzzyMatchResult {
  isMatch: boolean;
  score: number;
  matchedIndices: number[];
}

/**
 * Deterministic custom fuzzy matcher for command palette filtering.
 * Scores sequential matches, word-boundary bonuses, and exact substring matches.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();

  if (!q) {
    return { isMatch: true, score: 1, matchedIndices: [] };
  }

  if (q.length > t.length) {
    return { isMatch: false, score: 0, matchedIndices: [] };
  }

  // Exact substring match bonus
  const exactIndex = t.indexOf(q);
  if (exactIndex !== -1) {
    const matchedIndices: number[] = [];
    for (let i = 0; i < q.length; i++) {
      matchedIndices.push(exactIndex + i);
    }
    const score = 100 + (exactIndex === 0 ? 50 : 20) - exactIndex;
    return { isMatch: true, score, matchedIndices };
  }

  // Sequential fuzzy match with bonuses
  let qIdx = 0;
  let score = 0;
  const matchedIndices: number[] = [];
  let prevMatchIdx = -2;

  for (let tIdx = 0; tIdx < t.length && qIdx < q.length; tIdx++) {
    if (t[tIdx] === q[qIdx]) {
      matchedIndices.push(tIdx);

      // Scoring rules:
      let charScore = 10;

      // Bonus for match at start of string
      if (tIdx === 0) {
        charScore += 25;
      }

      // Bonus for match right after word boundary (space, dash, slash, dot)
      if (tIdx > 0 && /[\s\-_/.]/.test(t[tIdx - 1])) {
        charScore += 20;
      }

      // Bonus for camelCase word boundary (e.g. 'c' in 'slideOverDrawer')
      if (tIdx > 0 && target[tIdx] !== target[tIdx].toLowerCase() && target[tIdx - 1] === target[tIdx - 1].toLowerCase()) {
        charScore += 18;
      }

      // Bonus for consecutive matches
      if (tIdx === prevMatchIdx + 1) {
        charScore += 15;
      }

      score += charScore;
      prevMatchIdx = tIdx;
      qIdx++;
    }
  }

  // All query characters must be matched
  if (qIdx === q.length) {
    // Penalty for long target strings containing sparse matches
    score -= (target.length - q.length) * 0.5;
    return { isMatch: true, score, matchedIndices };
  }

  return { isMatch: false, score: 0, matchedIndices: [] };
}
