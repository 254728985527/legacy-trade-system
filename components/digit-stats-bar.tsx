'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="space-y-3">
      <span className="text-xs text-muted-foreground block">
        Last digit prediction
      </span>
      <div className="grid grid-cols-10 gap-2 place-items-center w-full">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const isHighest = digitStats.totalTicks > 0 && pct === maxPct;
          const isLowest = digitStats.totalTicks > 0 && pct === minPct;

          return (
            <div key={digit} className="flex flex-col items-center gap-1.5 w-full">
              <Button
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'w-10 h-10 text-sm font-semibold rounded-lg p-0',
                  isSelected && 'bg-primary text-white',
                  !isSelected && 'bg-muted/40 border-muted-foreground/30 text-foreground hover:bg-muted/60'
                )}
              >
                {digit}
              </Button>
              <span
                className={cn(
                  'text-[10px] font-mono text-center leading-tight',
                  isHighest && 'text-[#00C390] font-semibold',
                  isLowest && 'text-[#DE0040] font-semibold',
                  !isHighest && !isLowest && 'text-muted-foreground'
                )}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
