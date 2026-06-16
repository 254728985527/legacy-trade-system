'use client';

import { useEffect } from 'react';
import type { Candle } from '@/hooks/use-candle-data';

interface SignalCirclesProps {
  candles: Candle[];
  isGlowing?: boolean;
  onSignalFire?: (direction: 'UP' | 'DOWN') => void;
}

export function SignalCircles({ candles, isGlowing = false, onSignalFire }: SignalCirclesProps) {
  // Get last 3 candles
  const last3 = candles.slice(-3);

  // Determine colors based on candle direction (close vs previous close)
  const getSignalColor = (candle: Candle, previousCandle: Candle | undefined): string => {
    if (!previousCandle) return 'bg-gray-500'; // No comparison
    return candle.close > previousCandle.close ? 'bg-emerald-500' : 'bg-red-500';
  };

  const circleData = last3.map((candle, index) => {
    const previousCandle = last3[index - 1];
    return {
      candle,
      color: getSignalColor(candle, previousCandle),
      direction: !previousCandle ? 'N/A' : candle.close > previousCandle.close ? 'UP' : 'DOWN',
    };
  });

  // Check if all 3 are same color
  const allGreen = circleData.every((d) => d.color === 'bg-emerald-500');
  const allRed = circleData.every((d) => d.color === 'bg-red-500');
  const hasSignal = allGreen || allRed;

  // Trigger trade signal when all circles are same color
  useEffect(() => {
    if (hasSignal && onSignalFire && candles.length >= 3) {
      const direction = allGreen ? 'UP' : 'DOWN';
      onSignalFire(direction);
    }
  }, [hasSignal, allGreen, onSignalFire, candles.length]);

  return (
    <div className="flex items-center gap-4 my-4">
      <p className="text-white text-sm font-medium min-w-fit">Signal:</p>
      
      <div className="flex gap-3">
        {circleData.map((data, index) => (
          <div
            key={index}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all ${
              data.color
            } ${
              isGlowing && hasSignal
                ? 'shadow-lg shadow-current ring-2 ring-current animate-pulse'
                : ''
            }`}
            title={`Candle ${index + 1}: ${data.direction} (${data.candle.close.toFixed(2)})`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {allGreen && (
        <div className={`ml-4 text-emerald-400 text-sm font-bold ${isGlowing ? 'animate-pulse' : ''}`}>
          ✓ STRONG UPTREND
        </div>
      )}
      {allRed && (
        <div className={`ml-4 text-red-400 text-sm font-bold ${isGlowing ? 'animate-pulse' : ''}`}>
          ✓ STRONG DOWNTREND
        </div>
      )}
    </div>
  );
}
