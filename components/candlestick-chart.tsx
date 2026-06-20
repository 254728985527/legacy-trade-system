'use client';

import { useMemo } from 'react';

export interface OHLC {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IncomingTick {
  price: number;
  direction: 'up' | 'down';
  timestamp: number;
}

interface CandlestickChartProps {
  candleData: OHLC[];
  incomingTicks: IncomingTick[];
  width?: number;
  height?: number;
}

export function CandlestickChart({
  candleData,
  incomingTicks,
  width = 400,
  height = 240,
}: CandlestickChartProps) {
  const { minPrice, maxPrice, candleWidth, spacing } = useMemo(() => {
    if (candleData.length === 0) {
      return { minPrice: 0, maxPrice: 100, candleWidth: 0, spacing: 0 };
    }

    const prices = candleData.flatMap(c => [c.open, c.high, c.low, c.close]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;
    const padding = range * 0.1;

    const totalCandleWidth = width - 40; // Leave margins
    const candleWidth = Math.max(6, Math.floor(totalCandleWidth / candleData.length));
    const spacing = Math.max(2, Math.floor(totalCandleWidth / candleData.length - candleWidth));

    return {
      minPrice: minPrice - padding,
      maxPrice: maxPrice + padding,
      candleWidth,
      spacing,
    };
  }, [candleData, width]);

  const priceToY = (price: number) => {
    const range = maxPrice - minPrice;
    return height - 20 - ((price - minPrice) / range) * (height - 40);
  };

  const getRecentTicks = () => {
    const now = Date.now();
    return incomingTicks.filter(t => now - t.timestamp < 60000).slice(-3); // Last 3 ticks in 60 seconds
  };

  const recentTicks = getRecentTicks();

  return (
    <div className="w-full h-full bg-muted/20 rounded-lg p-4 flex items-center justify-center">
      <svg width={width} height={height} className="border border-border/50 rounded" viewBox={`0 0 ${width} ${height}`}>
        {/* Background grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - 20 - ratio * (height - 40);
          const price = minPrice + ratio * (maxPrice - minPrice);
          return (
            <g key={i}>
              <line x1="30" y1={y} x2={width - 10} y2={y} stroke="rgb(100, 100, 120)" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
              <text x="5" y={y + 4} fontSize="10" fill="rgb(150, 150, 170)" textAnchor="end">
                {price.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line x1="30" y1="0" x2="30" y2={height - 20} stroke="rgb(100, 100, 120)" strokeWidth="1" opacity="0.5" />

        {/* X-axis */}
        <line x1="30" y1={height - 20} x2={width - 10} y2={height - 20} stroke="rgb(100, 100, 120)" strokeWidth="1" opacity="0.5" />

        {/* Candlesticks */}
        {candleData.map((candle, i) => {
          const x = 35 + i * (candleWidth + spacing);
          const o = priceToY(candle.open);
          const c = priceToY(candle.close);
          const h = priceToY(candle.high);
          const l = priceToY(candle.low);

          const isUp = candle.close >= candle.open;
          const bodyTop = Math.min(o, c);
          const bodyHeight = Math.abs(c - o) || 2;
          const color = isUp ? 'rgb(0, 195, 144)' : 'rgb(222, 0, 64)';

          return (
            <g key={i} opacity="0.9">
              {/* Wick */}
              <line x1={x + candleWidth / 2} y1={h} x2={x + candleWidth / 2} y2={l} stroke={color} strokeWidth="1" />

              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={color}
                stroke={color}
                strokeWidth="1"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Incoming tick indicators (circles) */}
        {recentTicks.map((tick, i) => {
          const x = width - 40 - i * 15;
          const y = priceToY(tick.price);
          const color = tick.direction === 'up' ? 'rgb(0, 195, 144)' : 'rgb(222, 0, 64)';

          return (
            <circle
              key={`tick-${i}`}
              cx={x}
              cy={y}
              r="6"
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity="0.8"
            />
          );
        })}

        {/* Incoming tick indicators - filled center dots */}
        {recentTicks.map((tick, i) => {
          const x = width - 40 - i * 15;
          const y = priceToY(tick.price);
          const color = tick.direction === 'up' ? 'rgb(0, 195, 144)' : 'rgb(222, 0, 64)';

          return (
            <circle
              key={`tick-dot-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              opacity="0.9"
            />
          );
        })}

        {/* Price labels on X-axis */}
        {candleData.length > 0 && (
          <>
            <text x={35} y={height - 2} fontSize="9" fill="rgb(150, 150, 170)" textAnchor="middle">
              {candleData.length > 0 ? '1m' : ''}
            </text>
            <text x={width - 20} y={height - 2} fontSize="9" fill="rgb(150, 150, 170)" textAnchor="middle">
              Now
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
