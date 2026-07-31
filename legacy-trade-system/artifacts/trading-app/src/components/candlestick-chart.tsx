import { useMemo } from 'react';

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  isComplete: boolean;
}

interface CandlestickChartProps {
  prices: number[];
  pipSize: number;
  /** Approximate ticks per minute for the active symbol (default 60 for 1s indices) */
  ticksPerMinute?: number;
  height?: number;
}

function buildCandles(prices: number[], ticksPerMinute: number): Candle[] {
  if (prices.length < 2) return [];
  const candles: Candle[] = [];
  const total = prices.length;
  for (let i = 0; i < total; i += ticksPerMinute) {
    const slice = prices.slice(i, i + ticksPerMinute);
    if (slice.length === 0) continue;
    candles.push({
      open: slice[0],
      high: Math.max(...slice),
      low: Math.min(...slice),
      close: slice[slice.length - 1],
      isComplete: i + ticksPerMinute <= total,
    });
  }
  return candles;
}

export function CandlestickChart({ prices, pipSize, ticksPerMinute = 60, height = 180 }: CandlestickChartProps) {
  const MAX_CANDLES = 40;

  const { candles, lastClose, isLastRising } = useMemo(() => {
    const all = buildCandles(prices, ticksPerMinute);
    const visible = all.slice(-MAX_CANDLES);
    if (visible.length === 0) return { candles: [], lastClose: null, isLastRising: true };
    const last = visible[visible.length - 1];
    return {
      candles: visible,
      lastClose: last.close,
      isLastRising: last.close >= last.open,
    };
  }, [prices, ticksPerMinute]);

  if (candles.length < 2) {
    return (
      <div className="flex items-center justify-center text-xs" style={{ height, color: 'var(--text-muted)' }}>
        Building candles…
      </div>
    );
  }

  const W = 320;
  const H = height;
  const PAD_L = 4;
  const PAD_R = 54;
  const PAD_V = 10;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_V * 2;

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 0.0001;

  const toY = (p: number) => PAD_V + chartH - ((p - minP) / range) * chartH;

  const slotW = chartW / candles.length;
  const bodyW = Math.max(2, Math.min(10, slotW - 2));
  const priceStr = lastClose !== null ? lastClose.toFixed(pipSize) : null;
  const lineColor = isLastRising ? 'var(--green)' : 'var(--red)';
  const lastCloseY = lastClose !== null ? toY(lastClose) : H / 2;

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(frac => (
          <line
            key={frac}
            x1={PAD_L} y1={PAD_V + chartH * frac}
            x2={W - PAD_R} y2={PAD_V + chartH * frac}
            stroke="var(--border-col)" strokeWidth="0.5" opacity="0.4"
          />
        ))}

        {candles.map((c, i) => {
          const cx = PAD_L + i * slotW + slotW / 2;
          const isUp = c.close >= c.open;
          const col = isUp ? 'var(--green)' : 'var(--red)';
          const opacity = c.isComplete ? 1 : 0.55;

          const bodyTop = Math.min(toY(c.open), toY(c.close));
          const bodyBot = Math.max(toY(c.open), toY(c.close));
          const bH = Math.max(2, bodyBot - bodyTop);

          return (
            <g key={i} opacity={opacity}>
              {/* Wick */}
              <line
                x1={cx} y1={toY(c.high)}
                x2={cx} y2={toY(c.low)}
                stroke={col} strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={cx - bodyW / 2} y={bodyTop}
                width={bodyW} height={bH}
                fill={col}
                rx="0.5"
              />
            </g>
          );
        })}

        {/* Current price dashed line */}
        <line
          x1={PAD_L} y1={lastCloseY}
          x2={W - PAD_R} y2={lastCloseY}
          stroke={lineColor} strokeWidth="0.5"
          strokeDasharray="4 3" opacity="0.55"
        />
      </svg>

      {/* Price tag */}
      {priceStr && (
        <div
          className="absolute right-0 flex items-center gap-1 px-1.5 py-0.5 text-[0.65rem] font-mono font-bold rounded-l"
          style={{
            top: `${(lastCloseY / H) * 100}%`,
            transform: 'translateY(-50%)',
            background: lineColor,
            color: '#fff',
            minWidth: 48,
          }}
        >
          {priceStr} {isLastRising ? '▲' : '▼'}
        </div>
      )}
    </div>
  );
}

export { buildCandles };
export type { Candle };
