import { useMemo, useRef } from 'react';

interface PriceChartProps {
  prices: number[];
  pipSize: number;
  height?: number;
}

export function PriceChart({ prices, pipSize, height = 180 }: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const MAX_POINTS = 150;

  const pts = prices.slice(-MAX_POINTS);

  const { polyline, lastX, lastY, currentPrice, prevPrice } = useMemo(() => {
    if (pts.length < 2) return { polyline: '', lastX: 0, lastY: height / 2, currentPrice: null, prevPrice: null };

    const w = 320;
    const h = height;
    const pad = 14;
    const minP = Math.min(...pts);
    const maxP = Math.max(...pts);
    const range = maxP - minP || 1;

    const points = pts.map((p, i) => {
      const x = (i / (pts.length - 1)) * (w - pad) + pad / 2;
      const y = h - pad - ((p - minP) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const lastPt = pts[pts.length - 1];
    const prevPt = pts[pts.length - 2];
    const lx = parseFloat(points[points.length - 1].split(',')[0]);
    const ly = parseFloat(points[points.length - 1].split(',')[1]);

    return {
      polyline: points.join(' '),
      lastX: lx,
      lastY: ly,
      currentPrice: lastPt,
      prevPrice: prevPt,
    };
  }, [pts, height]);

  const isRising = currentPrice !== null && prevPrice !== null && currentPrice >= prevPrice;
  const priceStr = currentPrice !== null ? currentPrice.toFixed(pipSize) : null;

  if (pts.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[var(--text-muted)] text-xs"
        style={{ height }}
      >
        Waiting for data…
      </div>
    );
  }

  const lineColor = isRising ? 'var(--green)' : 'var(--red)';
  const dotColor = lineColor;

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 320 ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Fill area under line */}
        <polyline
          points={`${polyline} 320,${height} 0,${height}`}
          fill="url(#chartGrad)"
          stroke="none"
        />

        {/* Price line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pulsing dot at last price */}
        <circle cx={lastX} cy={lastY} r="6" fill={dotColor} opacity="0.2" className="animate-pulse-ring" />
        <circle cx={lastX} cy={lastY} r="3.5" fill={dotColor} />
      </svg>

      {/* Price tag */}
      {priceStr && (
        <div
          className="absolute right-0 flex items-center gap-1.5 px-2 py-1"
          style={{ top: `calc(${(lastY / height) * 100}% - 14px)` }}
        >
          <span
            className="font-mono font-bold text-sm"
            style={{ color: lineColor }}
          >
            {priceStr}
          </span>
          <span
            className="text-xs"
            style={{ color: lineColor }}
          >
            {isRising ? '▲' : '▼'}
          </span>
        </div>
      )}
    </div>
  );
}
