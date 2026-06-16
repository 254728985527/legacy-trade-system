'use client';

import type { Candle } from '@/hooks/use-candle-data';

interface CandleSignalBoxesProps {
  candles: Candle[];
}

export function CandleSignalBoxes({ candles }: CandleSignalBoxesProps) {
  // Get the last candle (current/active)
  const lastCandle = candles[candles.length - 1];
  const secondLastCandle = candles[candles.length - 2];
  const thirdLastCandle = candles[candles.length - 3];

  // Determine if candle is rising or falling based on close vs open
  const getCandleDirection = (candle: Candle | undefined): 'rise' | 'fall' | null => {
    if (!candle) return null;
    return candle.close > candle.open ? 'rise' : candle.close < candle.open ? 'fall' : null;
  };

  const directions = [
    getCandleDirection(thirdLastCandle),
    getCandleDirection(secondLastCandle),
    getCandleDirection(lastCandle),
  ];

  const getBoxColor = (direction: 'rise' | 'fall' | null) => {
    if (direction === 'rise') return 'bg-green-400'; // Light green for rise
    if (direction === 'fall') return 'bg-red-400'; // Light red for fall
    return 'bg-gray-600'; // Gray for no data
  };

  const getLabel = (direction: 'rise' | 'fall' | null) => {
    if (direction === 'rise') return '↑ RISE';
    if (direction === 'fall') return '↓ FALL';
    return '—';
  };

  return (
    <div className="flex gap-3 items-center justify-end">
      {directions.map((direction, idx) => (
        <div
          key={idx}
          className={`w-16 h-12 rounded-lg flex items-center justify-center font-bold text-sm text-black transition-all ${getBoxColor(
            direction
          )} ${direction ? 'shadow-lg' : 'opacity-50'}`}
        >
          {getLabel(direction)}
        </div>
      ))}
    </div>
  );
}
