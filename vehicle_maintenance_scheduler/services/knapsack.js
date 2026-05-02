function knapsack(tasks, maxHours) {
  const n = tasks.length;
  const dp = Array(maxHours + 1).fill(0);

  const keep = Array(n)
    .fill(0)
    .map(() => Array(maxHours + 1).fill(false));

  for (let i = 0; i < n; i++) {
    const { Duration, Impact } = tasks[i];

    for (let w = maxHours; w >= Duration; w--) {
      if (dp[w] < dp[w - Duration] + Impact) {
        dp[w] = dp[w - Duration] + Impact;
        keep[i][w] = true;
      }
    }
  }

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