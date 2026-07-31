import { useMemo, useEffect, useRef } from 'react';
import type { DigitStats } from '@/lib/types';

interface LDPSectionProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (d: number) => void;
  /** Last 10 incoming digit values (most recent last) */
  recentDigits?: number[];
  /** Last 3 completed candle directions (most recent last) */
  candleDirections?: ('up' | 'down')[];
  /** Called when 3 circles are all same color and next tick arrives */
  onEvenOddSignal?: (signal: 'even' | 'odd') => void;
}

const DIGIT_COLORS = ['#58a6ff', '#f0883e', '#3fb950', '#f85149', '#a371f7', '#58a6ff', '#d29922', '#3fb950', '#f85149', '#a371f7'];

export function LDPSection({
  digitStats, selectedDigit, onDigitSelect,
  recentDigits = [], candleDirections = [], onEvenOddSignal,
}: LDPSectionProps) {
  const pendingSignalRef = useRef<'even' | 'odd' | null>(null);
  const prevDigitsLenRef = useRef(recentDigits.length);

  const { rec, confidence, label } = useMemo(() => {
    if (digitStats.totalTicks < 10) return { rec: null, confidence: 0, label: 'Analyzing…' };
    const expected = 10;
    const pcts = digitStats.percentages;
    let minDigit = 0, minDev = Infinity;
    for (let i = 0; i <= 9; i++) {
      const dev = pcts[i] - expected;
      if (dev < minDev) { minDev = dev; minDigit = i; }
    }
    const conf = Math.min(80, Math.abs(minDev) * 8);
    let lbl = 'WEAK SIGNAL';
    if (conf >= 50) lbl = 'STRONG SIGNAL';
    else if (conf >= 30) lbl = 'MODERATE';
    return { rec: minDigit, confidence: Math.round(conf), label: lbl };
  }, [digitStats]);

  const isStrong = confidence >= 50;
  const color = isStrong ? 'var(--green)' : confidence >= 30 ? 'var(--gold)' : 'var(--text-secondary)';

  // Determine pending even/odd signal when 3 circles are same color
  useEffect(() => {
    if (candleDirections.length < 3) { pendingSignalRef.current = null; return; }
    const last3 = candleDirections.slice(-3);
    const allUp = last3.every(d => d === 'up');
    const allDown = last3.every(d => d === 'down');
    if (allUp) pendingSignalRef.current = 'even';
    else if (allDown) pendingSignalRef.current = 'odd';
    else pendingSignalRef.current = null;
  }, [candleDirections]);

  // Fire signal on next incoming tick
  useEffect(() => {
    const newLen = recentDigits.length;
    if (newLen > prevDigitsLenRef.current && pendingSignalRef.current && onEvenOddSignal) {
      onEvenOddSignal(pendingSignalRef.current);
      pendingSignalRef.current = null;
    }
    prevDigitsLenRef.current = newLen;
  }, [recentDigits.length, onEvenOddSignal]);

  const circles = [0, 1, 2].map(i => {
    const dir = candleDirections[candleDirections.length - 3 + i];
    return dir ?? null;
  });

  const allSame = circles.every(c => c !== null && c === circles[0]);
  const circlesColor = allSame && circles[0] === 'up' ? 'var(--green)' : allSame && circles[0] === 'down' ? 'var(--red)' : null;

  return (
    <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
      {/* Row 1: LDP signal + digit rec + candle circles */}
      <div className="flex items-center justify-between px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>LDP</span>
          <span className="text-[0.65rem] font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
          {confidence > 0 && (
            <span
              className="text-[0.6rem] px-1.5 py-0.5 rounded font-bold"
              style={{ background: isStrong ? 'var(--green-dim)' : 'var(--gold-dim)', color }}
            >
              {confidence}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 3 candle direction circles */}
          <div className="flex items-center gap-1.5">
            {circles.map((dir, i) => {
              const filled = dir !== null;
              const cCol = dir === 'up' ? 'var(--green)' : dir === 'down' ? 'var(--red)' : 'var(--border-col)';
              const dimCol = dir === 'up' ? 'var(--green-dim)' : dir === 'down' ? 'var(--red-dim)' : 'transparent';
              return (
                <div
                  key={i}
                  title={dir === 'up' ? 'Bullish candle' : dir === 'down' ? 'Bearish candle' : 'No data'}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: filled ? dimCol : 'var(--bg-card)',
                    border: `1.5px solid ${cCol}`,
                    boxShadow: allSame && filled ? `0 0 6px ${cCol}` : 'none',
                    transition: 'all 0.3s',
                  }}
                />
              );
            })}
            {allSame && circlesColor && (
              <span
                className="text-[0.55rem] font-black uppercase ml-0.5"
                style={{ color: circlesColor, letterSpacing: '0.5px' }}
              >
                {circles[0] === 'up' ? '▲▲▲' : '▼▼▼'}
              </span>
            )}
          </div>

          {rec !== null && (
            <button
              onClick={() => onDigitSelect(rec)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
              style={{
                background: selectedDigit === rec ? color : 'var(--bg-card)',
                border: `1.5px solid ${color}`,
                color: selectedDigit === rec ? '#fff' : color,
                boxShadow: isStrong ? `0 0 8px ${color}40` : 'none',
              }}
            >
              {rec}
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Last 10 incoming digit ticks */}
      {recentDigits.length > 0 && (
        <div className="flex items-center gap-1 px-3.5 pb-2 overflow-x-auto">
          <span className="text-[0.55rem] uppercase font-bold shrink-0 mr-0.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            LAST 10
          </span>
          {recentDigits.slice(-10).map((d, i, arr) => {
            const isLatest = i === arr.length - 1;
            const digitCol = DIGIT_COLORS[d] ?? 'var(--text-secondary)';
            return (
              <div
                key={i}
                className="shrink-0 flex items-center justify-center rounded text-[0.65rem] font-black transition-all"
                style={{
                  width: isLatest ? 22 : 18,
                  height: isLatest ? 22 : 18,
                  background: isLatest ? digitCol + '33' : 'var(--bg-card)',
                  border: `1px solid ${isLatest ? digitCol : 'var(--border-col)'}`,
                  color: isLatest ? digitCol : 'var(--text-secondary)',
                  boxShadow: isLatest ? `0 0 6px ${digitCol}44` : 'none',
                  opacity: 0.4 + (i / arr.length) * 0.6,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
