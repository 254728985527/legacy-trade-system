'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface OHLC {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  digit?: number;
  signal?: 'EVEN' | 'ODD';
  direction?: 'up' | 'down';
}

interface DirectionCirclesProps {
  candleData: OHLC[];
  onThreeRisesDetected?: (signal: boolean) => void;
}

export function DirectionCircles({ candleData, onThreeRisesDetected }: DirectionCirclesProps) {
  const [signalGiven, setSignalGiven] = useState(false);
  const [hasTriggeredThisRound, setHasTriggeredThisRound] = useState(false);

  // Get last 3 candles for direction display
  const lastThree = candleData.slice(-3);

  // Check for 3 consecutive rises
  useEffect(() => {
    if (candleData.length >= 3 && !hasTriggeredThisRound) {
      const last3 = candleData.slice(-3);
      const allRise = last3.every(c => c.direction === 'up' || (c.close >= c.open));

      if (allRise) {
        console.log('[v0] 3 consecutive rises detected');
        setSignalGiven(true);
        setHasTriggeredThisRound(true);
        onThreeRisesDetected?.(true);

        // Reset after 2 seconds to allow detection of next signal
        setTimeout(() => {
          setSignalGiven(false);
        }, 2000);
      }
    }

    // Reset trigger when candle pattern breaks
    if (candleData.length >= 3) {
      const last3 = candleData.slice(-3);
      const allRise = last3.every(c => c.direction === 'up' || (c.close >= c.open));

      if (!allRise && hasTriggeredThisRound) {
        // After signal is given and pattern breaks, prepare for next check
        setTimeout(() => {
          setHasTriggeredThisRound(false);
        }, 3000);
      }
    }
  }, [candleData, hasTriggeredThisRound, onThreeRisesDetected]);

  const getCandelDirection = (candle: OHLC) => {
    return candle.direction === 'up' || (candle.close >= candle.open) ? 'up' : 'down';
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Candle Direction:</span>
        <div className="flex gap-1.5">
          {[2, 1, 0].map((i) => {
            const candle = lastThree[i];
            const isUp = candle ? getCandelDirection(candle) === 'up' : false;
            const color = isUp ? 'bg-[#00C390]' : 'bg-[#DE0040]';

            return (
              <div
                key={i}
                className={cn(
                  'w-6 h-6 rounded-full transition-all shadow-sm',
                  candle ? color : 'bg-muted/40',
                  'border-2 border-current',
                  signalGiven && 'animate-pulse ring-2 ring-yellow-400'
                )}
                title={candle ? `${isUp ? 'RISE' : 'FALL'} - O: ${candle.open.toFixed(2)} C: ${candle.close.toFixed(2)}` : 'No data'}
              />
            );
          })}
        </div>
      </div>

      {/* Signal indicator */}
      {signalGiven && (
        <div className="ml-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-xs font-semibold text-yellow-500 animate-pulse">
          3 RISE SIGNAL
        </div>
      )}
    </div>
  );
}
