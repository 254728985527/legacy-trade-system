import type { DigitStats } from './types';

export interface PredictionSignal {
  /** Row rank, 1-based */
  rank: number;
  /** Hottest digit for this row (highlighted green) */
  hotDigit: number;
  /** Coldest digit for this row (highlighted red) */
  coldDigit: number;
  /** Trade direction suggested by reversion logic */
  direction: 'UNDER' | 'OVER';
  /** Winning zone for the direction */
  zone: '0-4' | '5-9';
  /** Digits whose appearance triggers entry for this direction */
  entryDigits: number[];
  /** True when the current last digit satisfies the entry trigger */
  active: boolean;
}

/**
 * Identify the highest, second-highest and lowest percentage digits.
 * Returns -1 for a slot when there is no data.
 */
export function getDigitHighlights(stats: DigitStats): {
  highest: number;
  secondHighest: number;
  lowest: number;
} {
  if (stats.totalTicks === 0) {
    return { highest: -1, secondHighest: -1, lowest: -1 };
  }
  const ranked = stats.percentages
    .map((pct, digit) => ({ pct, digit }))
    .sort((a, b) => b.pct - a.pct || a.digit - b.digit);

  return {
    highest: ranked[0].digit,
    secondHighest: ranked[1]?.digit ?? -1,
    lowest: ranked[ranked.length - 1].digit,
  };
}

/**
 * Build dynamic UNDER/OVER reversion signals from live digit stats.
 *
 * Reversion logic (mirrors the strategy card):
 *  - A hot HIGH digit (5-9) suggests an UNDER play (win on 0-4), entered on 7,8,9.
 *  - A hot LOW digit (0-4) suggests an OVER play (win on 5-9), entered on 0,1,2.
 * The row is "active" when the current last digit lands in the entry trigger set.
 */
export function computePredictionSignals(
  stats: DigitStats,
  lastDigit: number | null,
  count = 6
): PredictionSignal[] {
  const ranked = stats.percentages
    .map((pct, digit) => ({ pct, digit }))
    .sort((a, b) => b.pct - a.pct || a.digit - b.digit);
  const cold = [...ranked].reverse();

  const rows: PredictionSignal[] = [];
  for (let i = 0; i < count; i++) {
    const hotDigit = ranked[i % ranked.length].digit;
    const coldDigit = cold[i % cold.length].digit;
    const isHigh = hotDigit >= 5;
    const direction: 'UNDER' | 'OVER' = isHigh ? 'UNDER' : 'OVER';
    const entryDigits = isHigh ? [7, 8, 9] : [0, 1, 2];
    rows.push({
      rank: i + 1,
      hotDigit,
      coldDigit,
      direction,
      zone: isHigh ? '0-4' : '5-9',
      entryDigits,
      active:
        stats.totalTicks > 0 &&
        lastDigit !== null &&
        entryDigits.includes(lastDigit),
    });
  }
  return rows;
}

/**
 * Derive the number of decimal places from a pip value.
 * E.g., 0.01 → 2, 0.001 → 3, 1 → 0
 */
export function pipSizeFromPip(pip: number): number {
  if (pip >= 1) return 0;
  const str = pip.toString();
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return 0;
  return str.length - dotIndex - 1;
}

/**
 * Extract the last digit from a price value.
 * Uses pipSize (number of decimal places) to correctly format the price,
 * since JS drops trailing zeros (e.g., 876.50 → "876.5").
 */
export function getLastDigit(price: number, pipSize: number): number {
  const priceStr = price.toFixed(pipSize);
  const lastChar = priceStr[priceStr.length - 1];
  return parseInt(lastChar, 10);
}

/**
 * Compute digit statistics (counts and percentages) from an array of prices.
 */
export function computeDigitStats(prices: number[], pipSize: number): DigitStats {
  const counts = new Array(10).fill(0);

  for (const price of prices) {
    const digit = getLastDigit(price, pipSize);
    counts[digit]++;
  }

  const totalTicks = prices.length;
  const percentages = counts.map((count) =>
    totalTicks > 0 ? (count / totalTicks) * 100 : 0
  );

  return { counts, percentages, totalTicks };
}

/**
 * Update digit stats incrementally when a new tick arrives.
 * Maintains a sliding window of the last `windowSize` ticks.
 */
export function updateDigitStats(
  prices: number[],
  newPrice: number,
  windowSize: number
): number[] {
  const updated = [...prices, newPrice];
  if (updated.length > windowSize) {
    updated.shift();
  }
  return updated;
}
