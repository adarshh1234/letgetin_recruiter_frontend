export type DiffSegmentType = "unchanged" | "added" | "removed";

export interface DiffSegment {
  type: DiffSegmentType;
  text: string;
}

/**
 * Splits into word / punctuation / whitespace tokens (rather than whole "word+trailing
 * punctuation" chunks) so a word followed by a period at a sentence boundary still matches
 * the same word without its punctuation elsewhere - otherwise "improvement." and "improvement"
 * are treated as entirely different tokens and the diff fragments unnecessarily at every
 * sentence-ending word.
 */
function tokenize(text: string): string[] {
  const matches = text.match(/\w+|[^\w\s]+|\s+/g);
  return matches || [];
}

/**
 * Word-level diff via classic LCS dynamic programming. Resume bullets are short (a few
 * dozen words) so an O(n*m) table is negligible - no need for a heavier Myers-diff library.
 */
export function diffWords(originalText: string, proposedText: string): DiffSegment[] {
  const a = tokenize(originalText);
  const b = tokenize(proposedText);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const segments: DiffSegment[] = [];
  const pushSegment = (type: DiffSegmentType, text: string) => {
    const last = segments[segments.length - 1];
    if (last && last.type === type) {
      last.text += text;
    } else {
      segments.push({ type, text });
    }
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pushSegment("unchanged", b[j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushSegment("removed", a[i]);
      i++;
    } else {
      pushSegment("added", b[j]);
      j++;
    }
  }
  while (i < n) {
    pushSegment("removed", a[i]);
    i++;
  }
  while (j < m) {
    pushSegment("added", b[j]);
    j++;
  }

  return segments;
}

/** Convenience helper: just the substrings that were added/changed in the proposed text. */
export function getAddedPhrases(originalText: string, proposedText: string): string[] {
  const segments = diffWords(originalText, proposedText);
  return segments
    .filter((s) => s.type === "added")
    .map((s) => s.text.trim())
    .filter((s) => s.length > 0);
}
