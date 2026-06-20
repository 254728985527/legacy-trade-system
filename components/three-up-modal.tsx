'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OHLC, IncomingTick } from './candlestick-chart';

interface ThreeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastDigit: number;
  candleData: OHLC[];
  incomingTicks: IncomingTick[];
  onTradeEven: () => void;
  onTradeOdd: () => void;
  isTrading: boolean;
}

export function ThreeUpModal({
  isOpen,
  onClose,
  lastDigit,
  candleData,
  incomingTicks,
  onTradeEven,
  onTradeOdd,
  isTrading,
}: ThreeUpModalProps) {
  if (!isOpen) return null;

  const isEven = lastDigit % 2 === 0;

  // Mini chart rendering
  const width = 300;
  const height = 180;

  const prices = candleData.flatMap(c => [c.open, c.high, c.low, c.close]);
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 100;
  const range = maxPrice - minPrice || 1;
  const padding = range * 0.1;

  const chartMinPrice = minPrice - padding;
  const chartMaxPrice = maxPrice + padding;

  const priceToY = (price: number) => {
    const chartRange = chartMaxPrice - chartMinPrice;
    return height - 40 - ((price - chartMinPrice) / chartRange) * (height - 60);
  };

  const candleWidth = Math.max(4, Math.floor((width - 40) / Math.max(candleData.length, 1)));
  const spacing = Math.max(1, Math.floor((width - 40) / Math.max(candleData.length, 1) - candleWidth));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg shadow-2xl w-96 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">3 Up Ticks Detected! 🚀</h2>
          <p className="text-sm text-muted-foreground">Price is rising - Ready to trade?</p>
        </div>

        {/* Mini Chart */}
        <div className="border border-border/50 rounded-lg bg-muted/10 p-3">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
            {/* Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => {
              const y = height - 40 - ratio * (height - 60);
              const price = chartMinPrice + ratio * (chartMaxPrice - chartMinPrice);
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2={width - 10} y2={y} stroke="rgb(100, 100, 120)" strokeWidth="1" strokeDasharray="2,2" opacity="0.2" />
                  <text x="5" y={y + 3} fontSize="9" fill="rgb(150, 150, 170)" textAnchor="end">
                    {price.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Candlesticks */}
            {candleData.map((c, i) => {
              const x = 30 + i * (candleWidth + spacing);
              const o = priceToY(c.open);
              const h = priceToY(c.high);
              const l = priceToY(c.low);
              const close = priceToY(c.close);
              const isUp = c.close >= c.open;
              const color = isUp ? 'rgb(0, 195, 144)' : 'rgb(222, 0, 64)';
              const bodyTop = Math.min(o, close);
              const bodyHeight = Math.abs(close - o) || 2;

              return (
                <g key={i} opacity="0.9">
                  <line x1={x + candleWidth / 2} y1={h} x2={x + candleWidth / 2} y2={l} stroke={color} strokeWidth="1" />
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.8"
                  />
                </g>
              );
            })}

            {/* Up tick circles on the right */}
            {incomingTicks.slice(-3).map((tick, i) => {
              const x = width - 40 - i * 12;
              const y = priceToY(tick.price);
              const color = tick.direction === 'up' ? 'rgb(0, 195, 144)' : 'rgb(222, 0, 64)';

              return (
                <circle
                  key={`tick-${i}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              );
            })}
          </svg>
        </div>

        {/* Last Digit Display */}
        <div className="bg-muted/30 rounded-lg p-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Last Digit Captured</p>
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex w-12 h-12 rounded-full bg-primary text-white items-center justify-center text-2xl font-bold">
              {lastDigit}
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Digit is</p>
              <p className={cn('text-lg font-bold', isEven ? 'text-green-500' : 'text-blue-500')}>
                {isEven ? 'EVEN' : 'ODD'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className={cn(
              'w-full h-12 rounded-lg font-semibold text-white',
              isEven
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-green-600/50 hover:bg-green-700/50 disabled:opacity-50'
            )}
            disabled={!isEven || isTrading}
            onClick={onTradeEven}
          >
            {isTrading ? 'Trading...' : 'Trade EVEN'}
          </Button>

          <Button
            className={cn(
              'w-full h-12 rounded-lg font-semibold text-white',
              !isEven
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600/50 hover:bg-blue-700/50 disabled:opacity-50'
            )}
            disabled={isEven || isTrading}
            onClick={onTradeOdd}
          >
            {isTrading ? 'Trading...' : 'Trade ODD'}
          </Button>

          <Button
            variant="outline"
            className="w-full h-10 rounded-lg"
            disabled={isTrading}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
