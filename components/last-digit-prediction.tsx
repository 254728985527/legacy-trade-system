'use client';

import { cn } from '@/lib/utils';
import {
  computePredictionSignals,
  getDigitHighlights,
} from '../lib/digit-stats';
import type { DigitStats } from '../lib/types';
import type { ActiveSymbol, Tick } from '../lib/types';
import { Check, TrendingUp } from 'lucide-react';

interface LastDigitPredictionProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
  lastDigit: number | null;
  currentTick: Tick | null;
  activeSymbol: ActiveSymbol | null;
  pipSize: number;
}

type DigitCategory = 'highest' | 'second' | 'lowest' | 'neutral';

function digitFillClasses(category: DigitCategory): string {
  switch (category) {
    case 'highest':
      return 'bg-[#1f7a34] text-[#f5edd8] border-[#0c3a18]';
    case 'second':
      return 'bg-[#e0a419] text-[#3a2704] border-[#8a6104]';
    case 'lowest':
      return 'bg-[#a51f1f] text-[#f5edd8] border-[#5c0c0c]';
    default:
      return 'bg-[#faf5e4] text-[#1a2a4f] border-[#c8a84e]';
  }
}

export function LastDigitPrediction({
  digitStats,
  selectedDigit,
  onDigitSelect,
  lastDigit,
  currentTick,
  activeSymbol,
  pipSize,
}: LastDigitPredictionProps) {
  const { highest, secondHighest, lowest } = getDigitHighlights(digitStats);
  const signals = computePredictionSignals(digitStats, lastDigit, 6);

  const categoryFor = (digit: number): DigitCategory => {
    if (digit === highest) return 'highest';
    if (digit === secondHighest) return 'second';
    if (digit === lowest) return 'lowest';
    return 'neutral';
  };

  const priceStr =
    currentTick != null ? currentTick.quote.toFixed(pipSize) : '----';

  const renderDigit = (digit: number) => {
    const pct = digitStats.percentages[digit] ?? 0;
    const category = categoryFor(digit);
    const isLive = digit === lastDigit;
    const isSelected = digit === selectedDigit;

    return (
      <button
        key={digit}
        type="button"
        onClick={() => onDigitSelect(digit)}
        aria-pressed={isSelected}
        aria-label={`Digit ${digit}, ${pct.toFixed(1)} percent`}
        className="flex flex-col items-center gap-1 focus:outline-none group"
      >
        <span
          className={cn(
            'relative flex items-center justify-center rounded-full border-2 font-bold shadow-md transition-transform group-hover:scale-105',
            'w-11 h-11 sm:w-12 sm:h-12 text-lg sm:text-xl',
            digitFillClasses(category),
            isLive && 'ring-2 ring-[#1d6fe0] ring-offset-2 ring-offset-[#faf5e4]',
            isSelected && 'outline outline-2 outline-[#1a2a4f]'
          )}
        >
          {digit}
        </span>
        <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#1a2a4f]/80">
          {pct.toFixed(1)}%
        </span>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Ornate framed panel */}
      <div className="rounded-xl border-2 border-[#c8a84e] bg-[#faf5e4] shadow-lg overflow-hidden">
        {/* Title bar */}
        <div className="bg-gradient-to-b from-[#132a5c] to-[#0a1a3f] border-b-2 border-[#c8a84e] px-3 py-2 sm:py-3 text-center">
          <h2 className="font-serif tracking-wider text-[#e9c968] text-lg sm:text-2xl font-bold text-balance">
            LAST DIGIT PREDICTION
          </h2>
        </div>

        {/* Symbol + price row */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#c8a84e]/60">
          <span className="rounded-md border border-[#c8a84e] bg-[#fffbf0] px-2 py-1 text-xs sm:text-sm font-semibold text-[#1a2a4f] truncate">
            {activeSymbol?.underlying_symbol_name ?? 'Volatility'}
          </span>
          <span className="rounded-md border border-[#c8a84e] bg-[#fffbf0] px-2 py-1 text-xs sm:text-sm font-semibold text-[#1a2a4f] whitespace-nowrap">
            Price - {priceStr}
          </span>
        </div>

        {/* Digit medallions */}
        <div className="px-3 py-3 space-y-3">
          <div>
            <p className="text-center text-[11px] sm:text-xs font-bold tracking-widest text-[#1a2a4f] mb-1.5">
              DIGIT 0 TO 4
            </p>
            <div className="grid grid-cols-5 place-items-center gap-1">
              {[0, 1, 2, 3, 4].map(renderDigit)}
            </div>
          </div>
          <div>
            <p className="text-center text-[11px] sm:text-xs font-bold tracking-widest text-[#1a2a4f] mb-1.5">
              DIGIT 5 TO 9
            </p>
            <div className="grid grid-cols-5 place-items-center gap-1">
              {[5, 6, 7, 8, 9].map(renderDigit)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 py-2 border-y border-[#c8a84e]/60 bg-[#fffbf0]">
          <LegendItem color="#1d6fe0" label="Live Cursor" sub="Current Digit" />
          <LegendItem color="#1f7a34" label="Highest %" sub="Highest" />
          <LegendItem color="#e0a419" label="Second %" sub="2nd Highest" />
          <LegendItem color="#a51f1f" label="Lowest %" sub="Lowest" />
        </div>

        {/* Dynamic signal rows */}
        <div className="divide-y divide-[#c8a84e]/40">
          {signals.map((s) => (
            <div
              key={s.rank}
              className="flex items-center gap-2 px-3 py-2 text-[#1a2a4f]"
            >
              {/* Rank badge */}
              <span className="flex-none w-8 h-8 rounded-md bg-gradient-to-b from-[#132a5c] to-[#0a1a3f] border border-[#c8a84e] text-[#e9c968] flex items-center justify-center text-xs font-bold">
                {String(s.rank).padStart(2, '0')}
              </span>

              {/* Hot / cold digits */}
              <div className="flex items-center gap-1 flex-none">
                <span
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs font-bold border',
                    digitFillClasses('highest')
                  )}
                >
                  {s.hotDigit}
                </span>
                <span
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs font-bold border',
                    digitFillClasses('lowest')
                  )}
                >
                  {s.coldDigit}
                </span>
              </div>

              {/* Direction */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <TrendingUp
                  className={cn(
                    'w-4 h-4 flex-none',
                    s.direction === 'UNDER'
                      ? 'text-[#1f7a34]'
                      : 'text-[#a51f1f]'
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-xs sm:text-sm font-bold leading-tight',
                      s.direction === 'UNDER'
                        ? 'text-[#1f7a34]'
                        : 'text-[#a51f1f]'
                    )}
                  >
                    {s.direction}
                  </p>
                  <p className="text-[10px] leading-tight text-[#1a2a4f]/70 truncate">
                    ENTRY {s.entryDigits.join(',')}
                  </p>
                </div>
              </div>

              {/* Zone */}
              <span
                className={cn(
                  'flex-none w-11 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                  s.zone === '0-4'
                    ? 'bg-[#1f7a34] text-[#f5edd8] border-[#0c3a18]'
                    : 'bg-[#a51f1f] text-[#f5edd8] border-[#5c0c0c]'
                )}
              >
                {s.zone}
              </span>

              {/* Active check */}
              <span
                className={cn(
                  'flex-none w-6 h-6 rounded-full flex items-center justify-center border',
                  s.active
                    ? 'bg-[#1f7a34] border-[#0c3a18] text-[#f5edd8]'
                    : 'bg-[#e6ddc4] border-[#c8a84e]/50 text-transparent'
                )}
                aria-label={s.active ? 'Entry signal active' : 'No signal'}
              >
                <Check className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>

        {/* Footer motto */}
        <div className="bg-gradient-to-b from-[#132a5c] to-[#0a1a3f] border-t-2 border-[#c8a84e] px-3 py-2 text-center">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-[#e9c968]">
            FOCUS | PLAN | EXECUTE &middot; PREDICT | TRADE | PROFIT
          </p>
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  sub,
}: {
  color: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-full border border-black/20 flex-none"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-[11px] leading-tight">
        <span className="font-bold text-[#1a2a4f]">{label}</span>
        <span className="block text-[#1a2a4f]/60">{sub}</span>
      </span>
    </div>
  );
}
