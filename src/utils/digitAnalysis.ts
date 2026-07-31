import { DigitStats, TickData } from '../types';

/**
 * Extracts the last digit from a price quote given its pip size or decimal precision.
 * Example: price = 6924.61, pip_size = 2 -> 1
 */
export function extractLastDigit(price: number, pipSize: number = 2): number {
  if (isNaN(price)) return 0;
  // Format string to fixed pipSize
  const str = price.toFixed(pipSize);
  const lastChar = str.slice(-1);
  const digit = parseInt(lastChar, 10);
  return isNaN(digit) ? 0 : digit;
}

/**
 * Formats price into integer part and decimal part with trailing zeros based on pip size.
 */
export function formatPriceParts(price: number, pipSize: number = 2): { intPart: string; decPart: string } {
  if (isNaN(price)) return { intPart: '0', decPart: '00' };
  const str = price.toFixed(pipSize);
  const parts = str.split('.');
  return {
    intPart: parts[0] || '0',
    decPart: parts[1] || '0'.repeat(pipSize),
  };
}

/**
 * Computes complete digit distribution, classification, AI confidence, and direction.
 */
export function calculateDigitStats(ticks: TickData[], sampleWindow: number = 1000): DigitStats {
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const windowTicks = ticks.slice(-sampleWindow);
  const totalTicks = windowTicks.length;

  if (totalTicks === 0) {
    return {
      counts,
      percentages: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      totalTicks: 0,
      highestDigit: 0,
      secondHighestDigit: 1,
      lowestDigit: 9,
      underTotalPct: 50,
      overTotalPct: 50,
      avgPct: 10,
      threshold0_4: 10,
      threshold5_9: 10,
      numerator0_4: 25,
      numerator5_9: 25,
      direction: 'UNDER',
      confidence: 75.0,
      underTarget: 4,
      overTarget: 6,
      recommendation: 'TAKE TRADE ✓',
      confirmDigits: [5, 6],
      confirmLabel: 'DIGIT 5 TO 9',
      entryRangeArr: [0, 1, 2, 3, 4],
      confirmRangeArr: [5, 6, 7, 8, 9],
    };
  }

  for (const t of windowTicks) {
    if (t.digit >= 0 && t.digit <= 9) {
      counts[t.digit]++;
    }
  }

  const percentages = counts.map((c) => Math.round((c / totalTicks) * 1000) / 10);

  // Find highest, 2nd highest, and lowest digits
  const indexed = percentages.map((p, i) => ({ digit: i, pct: p }));
  indexed.sort((a, b) => b.pct - a.pct);

  const highestDigit = indexed[0].digit;
  const secondHighestDigit = indexed[1].digit;
  const lowestDigit = indexed[indexed.length - 1].digit;

  // Calculate totals for Under (0-4) and Over (5-9)
  const underTotalPct = Math.round((percentages[0] + percentages[1] + percentages[2] + percentages[3] + percentages[4]) * 10) / 10;
  const overTotalPct = Math.round((percentages[5] + percentages[6] + percentages[7] + percentages[8] + percentages[9]) * 10) / 10;

  const avgPct = 10;

  // Derive dynamic threshold values for range cards
  const underHighest = Math.max(percentages[0], percentages[1], percentages[2], percentages[3], percentages[4]);
  const overHighest = Math.max(percentages[5], percentages[6], percentages[7], percentages[8], percentages[9]);

  const numerator0_4 = Math.round(underHighest * 2.5) || 24;
  const numerator5_9 = Math.round(overHighest * 2.5) || 26;

  const threshold0_4 = Math.round((numerator0_4 / 5) * 10) / 10;
  const threshold5_9 = Math.round((numerator5_9 / 5) * 10) / 10;

  // Direction rule:
  // If the strongest digit (highest percentage) is 0, 1, 2, 3 -> Strength lies deep inside Under (0-4) -> Direction UNDER
  // If the strongest digit is 4, 5, 6, 7, 8, 9 -> Momentum sits in/near Over -> Direction OVER
  const direction: 'UNDER' | 'OVER' = highestDigit <= 3 ? 'UNDER' : 'OVER';

  // AI confidence is derived from highest digit weight + directional bias
  const topWeight = indexed[0].pct;
  const runnerWeight = indexed[1].pct;
  const spread = topWeight - runnerWeight;
  const rawConfidence = 60 + topWeight * 1.2 + spread * 1.5;
  const confidence = Math.min(96.8, Math.max(62.4, Math.round(rawConfidence * 10) / 10));

  const recommendation: 'TAKE TRADE ✓' | 'WAIT ✕' = confidence >= 70.0 ? 'TAKE TRADE ✓' : 'WAIT ✕';

  // Target digits for endpoint display
  const underTarget = [0, 1, 2, 3, 4].reduce((best, d) => (percentages[d] > percentages[best] ? d : best), 0);
  const overTarget = [5, 6, 7, 8, 9].reduce((best, d) => (percentages[d] > percentages[best] ? d : best), 5);

  let confirmDigits: number[];
  let confirmLabel: string;
  let entryRangeArr: number[];
  let confirmRangeArr: number[];

  if (direction === 'OVER') {
    entryRangeArr = [5, 6, 7, 8, 9];
    confirmRangeArr = [0, 1, 2, 3, 4];
    confirmDigits = [3, 4];
    confirmLabel = 'DIGIT 0 TO 4';
  } else {
    entryRangeArr = [0, 1, 2, 3, 4];
    confirmRangeArr = [5, 6, 7, 8, 9];
    confirmDigits = [5, 6];
    confirmLabel = 'DIGIT 5 TO 9';
  }

  return {
    counts,
    percentages,
    totalTicks,
    highestDigit,
    secondHighestDigit,
    lowestDigit,
    underTotalPct,
    overTotalPct,
    avgPct,
    threshold0_4,
    threshold5_9,
    numerator0_4,
    numerator5_9,
    direction,
    confidence,
    underTarget,
    overTarget,
    recommendation,
    confirmDigits,
    confirmLabel,
    entryRangeArr,
    confirmRangeArr,
  };
}
