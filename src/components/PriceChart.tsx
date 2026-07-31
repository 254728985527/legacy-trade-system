import React from 'react';
import { DerivSymbol, TickData } from '../types';

interface PriceChartProps {
  ticks: TickData[];
  selectedSymbol: DerivSymbol;
}

export const PriceChart: React.FC<PriceChartProps> = ({ ticks, selectedSymbol }) => {
  const chartTicks = ticks.slice(-100);
  const prices = chartTicks.map((t) => t.quote);

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 100;
  const range = maxPrice - minPrice || 1;

  // SVG polyline coordinates
  const svgWidth = 800;
  const svgHeight = 180;

  const points = chartTicks
    .map((t, idx) => {
      const x = (idx / Math.max(1, chartTicks.length - 1)) * svgWidth;
      const y = svgHeight - ((t.quote - minPrice) / range) * (svgHeight - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const recentDigits = ticks.slice(-30).map((t) => t.digit);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-[#F4CB4B] tracking-wider uppercase font-mono">
          📈 REAL-TIME TICK PRICE SPARKLINE ({selectedSymbol.display_name})
        </h3>
        <div className="font-mono text-xs text-gray-400">
          MIN: <span className="text-white font-bold">{minPrice.toFixed(selectedSymbol.pip_size)}</span> | MAX:{' '}
          <span className="text-white font-bold">{maxPrice.toFixed(selectedSymbol.pip_size)}</span>
        </div>
      </div>

      {/* SVG Sparkline Chart */}
      <div className="w-full bg-[#0d0d0d] border border-gray-900 rounded-lg p-2 relative overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
          {/* Background grid lines */}
          <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#1f1f1f" strokeDasharray="4" />
          <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="#1f1f1f" strokeDasharray="4" />
          <line x1="0" y1="150" x2={svgWidth} y2="150" stroke="#1f1f1f" strokeDasharray="4" />

          {/* Polyline */}
          {points && (
            <polyline
              fill="none"
              stroke="#F4CB4B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          )}

          {/* Latest Point Pulsing Dot */}
          {chartTicks.length > 0 && (
            <g>
              <circle
                cx={svgWidth}
                cy={
                  svgHeight -
                  ((chartTicks[chartTicks.length - 1].quote - minPrice) / range) * (svgHeight - 20) -
                  10
                }
                r="5"
                fill="#22c55e"
              />
              <circle
                cx={svgWidth}
                cy={
                  svgHeight -
                  ((chartTicks[chartTicks.length - 1].quote - minPrice) / range) * (svgHeight - 20) -
                  10
                }
                r="10"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
                className="animate-ping"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Last 30 Digits Ticker Tape */}
      <div>
        <div className="font-mono text-xs text-[#F4CB4B] font-bold mb-2 uppercase tracking-wider">
          🔥 RECENT 30 DIGITS SEQUENCE:
        </div>
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#0d0d0d] border border-gray-900 rounded-lg">
          {recentDigits.map((d, i) => {
            const isUnder = d <= 4;
            const isEven = d % 2 === 0;

            return (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-extrabold text-xs border transition-transform duration-200 hover:scale-110 ${
                  isUnder
                    ? 'bg-green-950/80 text-green-400 border-green-600'
                    : 'bg-amber-950/80 text-amber-400 border-amber-600'
                }`}
                title={`Digit: ${d} (${isEven ? 'Even' : 'Odd'}, ${isUnder ? 'Under' : 'Over'})`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
