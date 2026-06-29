'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DigitStats } from '../lib/types';

interface BuildInterfaceProps {
  lastDigit: number | null;
  digitStats: DigitStats;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  selectedDigit?: number;
}

type SignalType = 'under' | 'over' | null;

export function BuildInterface({
  lastDigit,
  digitStats,
  confidence,
  confidenceLevel,
  selectedDigit = 0,
}: BuildInterfaceProps) {
  const [signal, setSignal] = useState<SignalType>(null);
  const [matchFlash, setMatchFlash] = useState(false);
  const [displayConfidence, setDisplayConfidence] = useState(confidence);
  const [displayConfidenceLevel, setDisplayConfidenceLevel] = useState<'low' | 'medium' | 'high'>(confidenceLevel);

  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  // Find highest and lowest digits
  const highestDigit = digitStats.percentages.indexOf(maxPct);
  const lowestDigit = digitStats.percentages.indexOf(minPct);
  const highestPct = digitStats.percentages[highestDigit];
  const lowestPct = digitStats.percentages[lowestDigit];

  // Signal detection logic
  useEffect(() => {
    // Check if A=C (last digit matches selected digit) OR if incoming tick matches lowest digit
    const isSelectedMatch = lastDigit === selectedDigit && lastDigit !== null;
    const isLowestMatch = lastDigit === lowestDigit && lastDigit !== null;
    const isMatch = isSelectedMatch || isLowestMatch;

    if (isMatch) {
      // Boost confidence to 98% on match
      setDisplayConfidence(98);
      setDisplayConfidenceLevel('high');
      setMatchFlash(true);

      // Flash green for 1 second then reset
      const flashTimer = setTimeout(() => {
        setMatchFlash(false);
        // Let normal signal detection resume
      }, 1000);

      return () => clearTimeout(flashTimer);
    } else {
      // Not a match, so clear match flash if it was active
      setMatchFlash(false);
    }

    // UNDER Signal conditions:
    // 1. Highest digit is 7-9 AND lowest digit is 6-9
    // 2. Highest digit is 0-4 AND last digit (A) equals lowest digit (C)
    const isUnderTraditional = highestDigit >= 7 && highestDigit <= 9 && lowestDigit >= 6 && lowestDigit <= 9;
    const isUnderSpecial = highestDigit >= 0 && highestDigit <= 4 && lastDigit === lowestDigit && lastDigit !== null;
    const isUnder = isUnderTraditional || isUnderSpecial;

    // OVER Signal: highest digit is 5-9, lowest digit is 0-4
    const isOver = highestDigit >= 5 && highestDigit <= 9 && lowestDigit >= 0 && lowestDigit <= 4;

    if (isUnder) {
      setSignal('under');
    } else if (isOver) {
      setSignal('over');
    } else {
      setSignal(null);
    }

    // Update confidence level based on current score
    setDisplayConfidence(confidence);
    const newLevel: 'low' | 'medium' | 'high' = confidence >= 15 ? 'high' : confidence >= 10 ? 'medium' : 'low';
    setDisplayConfidenceLevel(newLevel);
  }, [lastDigit, selectedDigit, highestDigit, lowestDigit, confidence]);

  const confidenceColor = {
    low: 'text-red-400',
    medium: 'text-yellow-400',
    high: 'text-green-400',
  }[displayConfidenceLevel];

  const confidenceLabel = {
    low: 'Low confidence',
    medium: 'Medium confidence',
    high: 'High confidence',
  }[displayConfidenceLevel];

  // Signal styling
  const signalColor = signal === 'under' ? 'text-blue-400' : signal === 'over' ? 'text-orange-400' : '';
  const signalLabel = signal === 'under' ? 'UNDER' : signal === 'over' ? 'OVER' : '';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 space-y-4">
      {/* Top row: Three stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Panel A: Last */}
        <div className="border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-colors">
          <span className="text-slate-500 text-xs sm:text-sm font-medium mb-3">A</span>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold mb-4 tracking-wide">LAST</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-5xl sm:text-6xl font-bold">
              {lastDigit !== null ? lastDigit : '-'}
            </span>
          </div>
        </div>

        {/* Panel B: Highest and Lowest */}
        <div className="border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-500 text-xs sm:text-sm font-medium">B</span>
            <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">
              Highest
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-green-400 text-4xl sm:text-5xl font-bold">{highestDigit}</span>
            <span className="text-green-400 text-sm font-semibold">
              {highestPct.toFixed(1)}%
            </span>
          </div>
          <div className="border-t border-slate-700/50 pt-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-500 text-xs font-medium">C</span>
              <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
                Lowest
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-red-400 text-3xl sm:text-4xl font-bold">{lowestDigit}</span>
              <span className="text-red-400 text-sm font-semibold">
                {lowestPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Panel C: Lowest (standalone) */}
        <div className="border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-colors">
          <span className="text-slate-500 text-xs sm:text-sm font-medium mb-3">C</span>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold mb-4 tracking-wide">LOWEST</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-red-400 text-5xl sm:text-6xl font-bold">{lowestDigit}</span>
            <span className="text-red-400 text-sm font-semibold">
              {lowestPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Circular progress + Confidence */}
      <div className="grid grid-cols-2 gap-4">
        {/* Circular progress */}
        <div
          className={cn(
            'border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-all',
            matchFlash && 'bg-green-500/20 border-green-400/60'
          )}
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background circle */}
            <svg
              className="w-32 h-32 transform -rotate-90 drop-shadow-lg"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-700"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(displayConfidence / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-500',
                  matchFlash ? 'text-green-400' : 'text-red-400'
                )}
              />
            </svg>
            {/* Center text */}
            <div className="absolute text-center">
              <span
                className={cn(
                  'text-4xl sm:text-5xl font-bold transition-colors duration-300',
                  matchFlash ? 'text-green-400' : 'text-white'
                )}
              >
                {displayConfidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Confidence section */}
        <div
          className={cn(
            'border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-all',
            matchFlash && 'bg-green-500/20 border-green-400/60'
          )}
        >
          {/* Signal display with blinking animation */}
          {signal && !matchFlash && (
            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
              .signal-blink {
                animation: blink 0.6s infinite;
              }
            `}</style>
          )}

          {matchFlash ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Match
              </p>
              <p className="text-green-400 text-2xl sm:text-3xl font-bold">✓</p>
            </div>
          ) : signal ? (
            <div className="flex flex-col items-center justify-center signal-blink">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Signal
              </p>
              <p className={cn('text-2xl sm:text-3xl font-bold', signalColor)}>
                {signalLabel}
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
                Confidence
              </p>
              <p className={cn('text-base sm:text-lg font-semibold', confidenceColor)}>
                {confidenceLabel}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
