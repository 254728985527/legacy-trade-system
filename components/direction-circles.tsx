'use client';

import { cn } from '@/lib/utils';

interface DirectionCirclesProps {
  incomingTicks: Array<{
    price: number;
    direction: 'up' | 'down';
    timestamp: number;
  }>;
}

export function DirectionCircles({ incomingTicks }: DirectionCirclesProps) {
  // Get last 3 ticks for direction display
  const lastThree = incomingTicks.slice(-3);

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-muted-foreground">Direction:</span>
      <div className="flex gap-1.5">
        {[2, 1, 0].map((i) => {
          const tick = lastThree[i];
          const isUp = tick?.direction === 'up';
          const color = isUp ? 'bg-[#00C390]' : 'bg-[#DE0040]';

          return (
            <div
              key={i}
              className={cn(
                'w-5 h-5 rounded-full transition-all',
                tick ? color : 'bg-muted/40',
                'border border-current opacity-80'
              )}
              title={tick ? `${tick.direction.toUpperCase()} - ${tick.price.toFixed(2)}` : 'No data'}
            />
          );
        })}
      </div>
    </div>
  );
}
