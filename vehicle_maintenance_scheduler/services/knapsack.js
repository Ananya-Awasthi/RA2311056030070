function knapsack(tasks, maxHours) {
  const n = tasks.length;

  // dp[w] = max impact for capacity w
  const dp = Array(maxHours + 1).fill(0);

  // keep track of choices
  const keep = Array(n)
    .fill(0)
    .map(() => Array(maxHours + 1).fill(false));

  // build dp table
  for (let i = 0; i < n; i++) {
    const { Duration, Impact } = tasks[i];

    for (let w = maxHours; w >= Duration; w--) {
      if (dp[w] < dp[w - Duration] + Impact) {
        dp[w] = dp[w - Duration] + Impact;
        keep[i][w] = true;
      }
    }
  }

  // backtrack to find selected tasks
  let w = maxHours;
  const selected = [];

  for (let i = n - 1; i >= 0; i--) {
    if (keep[i][w]) {
      selected.push(tasks[i]);
      w -= tasks[i].Duration;
    }
  }

  return selected;
}

module.exports = knapsack;