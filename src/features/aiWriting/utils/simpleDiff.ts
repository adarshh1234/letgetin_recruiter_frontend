export type DiffOp = { type: 'equal' | 'add' | 'remove'; value: string };

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) || [];
}

// Word-level LCS diff. Deliberately not a dependency — inputs are capped (~6000 chars)
// so the O(n*m) table stays small.
export function diffWords(oldText: string, newText: string): DiffOp[] {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: DiffOp[] = [];
  const pushOrMerge = (type: DiffOp['type'], value: string) => {
    const last = ops[ops.length - 1];
    if (last && last.type === type) last.value += value;
    else ops.push({ type, value });
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pushOrMerge('equal', a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushOrMerge('remove', a[i]);
      i++;
    } else {
      pushOrMerge('add', b[j]);
      j++;
    }
  }
  while (i < n) {
    pushOrMerge('remove', a[i]);
    i++;
  }
  while (j < m) {
    pushOrMerge('add', b[j]);
    j++;
  }

  return ops;
}
