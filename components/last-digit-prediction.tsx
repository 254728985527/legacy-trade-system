'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSubmarketDisplayName } from '@/lib/active-symbols-display-names';
import { getDigitHighlights } from '../lib/digit-stats';
import type { ActiveSymbol, DigitStats, Tick } from '../lib/types';

interface LastDigitPredictionProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
  lastDigit: number | null;
  currentTick: Tick | null;
  activeSymbol: ActiveSymbol | null;
  pipSize: number;
  symbols: ActiveSymbol[];
  onSymbolChange: (symbol: string) => void;
}

/**
 * Medallion center positions measured against the 1402x1122 artwork,
 * expressed as percentages of the container so overlays stay aligned
 * regardless of rendered size.
 */
const DIGIT_X: Record<number, number> = {
  0: 33.17,
  1: 41.94,
  2: 50.78,
  3: 59.56,
  4: 68.33,
  5: 33.17,
  6: 41.94,
  7: 50.78,
  8: 59.56,
  9: 68.33,
};
const ROW_TOP_Y = 19.0; // digits 0-4
const ROW_BOTTOM_Y = 29.0; // digits 5-9

type DigitCategory = 'highest' | 'second' | 'lowest' | 'neutral';
type SubmarketGroup = { displayName: string; symbols: ActiveSymbol[] };

function groupBySubmarket(symbols: ActiveSymbol[]): Map<string, SubmarketGroup> {
  const groups = new Map<string, SubmarketGroup>();
  for (const symbol of symbols) {
    const key = symbol.submarket;
    const existing = groups.get(key);
    if (existing) {
      existing.symbols.push(symbol);
    } else {
      const displayName =
        symbol.submarket_display_name ?? getSubmarketDisplayName(symbol.submarket);
      groups.set(key, { displayName, symbols: [symbol] });
    }
  }
  return groups;
}

/** Ring color used to mark a digit's live statistical category. */
function ringColor(category: DigitCategory, isLive: boolean): string | null {
  if (isLive) return '#1d6fe0'; // blue live cursor takes priority
  switch (category) {
    case 'highest':
      return '#1f7a34';
    case 'second':
      return '#e0a419';
    case 'lowest':
      return '#a51f1f';
    default:
      return null;
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
  symbols,
  onSymbolChange,
}: LastDigitPredictionProps) {
  const { highest, secondHighest, lowest } = getDigitHighlights(digitStats);
  const grouped = useMemo(() => groupBySubmarket(symbols), [symbols]);

  const categoryFor = (digit: number): DigitCategory => {
    if (digit === highest) return 'highest';
    if (digit === secondHighest) return 'second';
    if (digit === lowest) return 'lowest';
    return 'neutral';
  };

  const priceStr =
    currentTick != null ? currentTick.quote.toFixed(pipSize) : '----';
  const symbolName = activeSymbol?.underlying_symbol_name ?? 'Select volatility';

  const renderDigit = (digit: number) => {
    const x = DIGIT_X[digit];
    const y = digit <= 4 ? ROW_TOP_Y : ROW_BOTTOM_Y;
    const pct = digitStats.percentages[digit] ?? 0;
    const category = categoryFor(digit);
    const isLive = digit === lastDigit;
    const isSelected = digit === selectedDigit;
    const ring = ringColor(category, isLive);

    return (
      <div key={digit}>
        {/* Live category / cursor ring overlaid on the artwork medallion */}
        {ring && digitStats.totalTicks > 0 && (
          <span
            aria-hidden="true"
            className={cn('absolute rounded-full', isLive && 'animate-pulse')}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '6.9%',
              aspectRatio: '1 / 1',
              transform: 'translate(-50%, -50%)',
              border: '0.55vw solid ' + ring,
              boxShadow: `0 0 0 0.12vw rgba(0,0,0,0.35), 0 0 1.2vw ${ring}`,
            }}
          />
        )}

        {/* Live percentage badge */}
        {digitStats.totalTicks > 0 && (
          <span
            className="absolute z-10 rounded-full border border-black/30 bg-[#0a1a3f] px-1.5 py-0.5 text-[0.55vw] font-bold leading-none text-[#e9c968] shadow"
            style={{
              left: `${x + 2.6}%`,
              top: `${y - 3.4}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {pct.toFixed(1)}%
          </span>
        )}

        {/* Transparent hotspot to keep digit selection working */}
        <button
          type="button"
          onClick={() => onDigitSelect(digit)}
          aria-pressed={isSelected}
          aria-label={`Digit ${digit}, ${pct.toFixed(1)} percent`}
          className={cn(
            'absolute rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2a4f]',
            isSelected && 'ring-2 ring-[#1a2a4f]'
          )}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '6.9%',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  };

  return (
    <div className="h-full w-full flex items-start justify-center">
      <div className="relative w-full max-w-[820px]" style={{ aspectRatio: '1402 / 1122' }}>
        {/* Exact reference artwork — layout preserved */}
        <img
          src="/images/last-digit-prediction.png"
          alt="Last Digit Prediction board"
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        {/* Functional volatility selector over the artwork dropdown box.
            An opaque cream panel masks the baked-in artwork label. */}
        <div
          className="absolute overflow-hidden rounded-md bg-[#f4edd7]"
          style={{
            left: '5.4%',
            top: '16.2%',
            width: '18.4%',
            height: '5.8%',
          }}
        >
          <Select
            value={activeSymbol?.underlying_symbol ?? ''}
            onValueChange={onSymbolChange}
          >
            <SelectTrigger
              aria-label="Select volatility"
              className="h-full w-full rounded-md border-0 bg-transparent px-2 text-left font-bold text-[#1a2a4f] shadow-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#1a2a4f] [&>span]:truncate [&_svg]:text-[#1a2a4f]"
              style={{ fontSize: 'clamp(9px, 0.95vw, 15px)' }}
            >
              <SelectValue placeholder="Select volatility">
                {symbolName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {Array.from(grouped.entries()).map(
                ([submarket, { displayName, symbols: group }]) => (
                  <SelectGroup key={submarket}>
                    <SelectLabel>{displayName}</SelectLabel>
                    {group.map((symbol) => (
                      <SelectItem
                        key={symbol.underlying_symbol}
                        value={symbol.underlying_symbol}
                      >
                        {symbol.underlying_symbol_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Live price over the price box — cream mask hides baked-in price */}
        <div
          className="absolute flex items-center justify-center overflow-hidden rounded-md bg-[#f4edd7]"
          style={{
            left: '76.6%',
            top: '16.2%',
            width: '18.4%',
            height: '5.8%',
          }}
        >
          <span
            className="whitespace-nowrap font-bold text-[#1a2a4f]"
            style={{ fontSize: 'clamp(10px, 1vw, 16px)' }}
          >
            Price - {priceStr}
          </span>
        </div>

        {/* Live digit overlays */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderDigit)}
      </div>
    </div>
  );
}
