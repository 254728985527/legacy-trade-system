'use client';

import { useMemo } from 'react';
import { SignalCircles } from './signal-circles';
import type { Candle } from '@/hooks/use-candle-data';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleStickChartProps {
  currentPrice?: number;
  candles?: Candle[];
  symbol?: string;
  isGlowingSignal?: boolean;
  onSignalFire?: (direction: 'UP' | 'DOWN') => void;
}

export function CandleStickChart({ 
  currentPrice = 94582.04, 
  candles = [], 
  symbol = 'Jump 10 Index',
  isGlowingSignal = false,
  onSignalFire
}: CandleStickChartProps) {
  // Use real candle data or generate mock data
  const candleData = useMemo(() => {
    if (candles.length > 0) {
      return candles.slice(-8).map((c, idx) => ({
        time: idx,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
    }
    
    // Generate 8 candlesticks for display
    const data: CandleData[] = [];
    let price = 94400;
    for (let i = 0; i < 8; i++) {
      const open = price;
      const change = (Math.random() - 0.5) * 200;
      const high = Math.max(open, open + change) + Math.random() * 100;
      const low = Math.min(open, open + change) - Math.random() * 100;
      const close = open + change;
      price = close;
      data.push({ time: i, open, high, low, close });
    }
    return data;
  }, [candles]);

  const minPrice = Math.min(...candleData.map(c => c.low)) - 50;
  const maxPrice = Math.max(...candleData.map(c => c.high)) + 50;
  const priceRange = maxPrice - minPrice;

  const chartWidth = 400;
  const chartHeight = 200;
  const candleWidth = chartWidth / candleData.length;
  const padding = 10;

  return (
    <div className={`w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5 mb-6 ${isGlowingSignal ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/50' : ''}`}>
      {/* Signal Circles */}
      <SignalCircles candles={candles} isGlowing={isGlowingSignal} onSignalFire={onSignalFire} />

      <div className="flex justify-between items-center mb-4">
        <p className="text-[rgb(255,193,7)] text-sm font-bold">CANDLE</p>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-14 h-12 bg-white rounded-lg hover:opacity-80 transition-opacity cursor-pointer"></div>
          ))}
        </div>
      </div>

      <div className="relative h-48 bg-[rgb(20,24,31)] rounded border border-[rgb(255,255,255,0.08)] mb-4">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={`h-${ratio}`}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="rgb(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Candlesticks */}
          {candleData.map((candle, idx) => {
            const x = idx * candleWidth + candleWidth / 2;
            const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
            const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
            const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
            const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

            const isUp = candle.close >= candle.open;
            const candleColor = isUp ? '#00ff88' : '#ff0088';
            const wickColor = isUp ? '#00ff88' : '#ff0088';

            return (
              <g key={idx}>
                {/* Wick (high-low) */}
                <line x1={x} y1={highY} x2={x} y2={lowY} stroke={wickColor} strokeWidth="1" opacity="0.6" />
                {/* Body (open-close) */}
                <rect
                  x={x - candleWidth * 0.25}
                  y={Math.min(openY, closeY)}
                  width={candleWidth * 0.5}
                  height={Math.abs(closeY - openY) || 2}
                  fill={candleColor}
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Price display overlay */}
        <div className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
          {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
