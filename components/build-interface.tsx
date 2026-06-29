'use client';

import { cn } from '@/lib/utils';
import type { DigitStats } from '../lib/types';

interface BuildInterfaceProps {
  lastDigit: number | null;
  digitStats: DigitStats;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export function BuildInterface({
  lastDigit,
  digitStats,
  confidence,
  confidenceLevel,
}: BuildInterfaceProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  // Find highest and lowest digits
  const highestDigit = digitStats.percentages.indexOf(maxPct);
  const lowestDigit = digitStats.percentages.indexOf(minPct);
  const highestPct = digitStats.percentages[highestDigit];
  const lowestPct = digitStats.percentages[lowestDigit];

  const confidenceColor = {
    low: 'text-red-400',
    medium: 'text-yellow-400',
    high: 'text-green-400',
  }[confidenceLevel];

  const confidenceLabel = {
    low: 'Low confidence',
    medium: 'Medium confidence',
    high: 'High confidence',
  }[confidenceLevel];

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
        <div className="border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-colors">
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
                strokeDasharray={`${(confidence / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                strokeLinecap="round"
                className="text-red-400 transition-all duration-500"
              />
            </svg>
            {/* Center text */}
            <div className="absolute text-center">
              <span className="text-white text-4xl sm:text-5xl font-bold">{confidence}%</span>
            </div>
          </div>
        </div>

        {/* Confidence section */}
        <div className="border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-center bg-slate-800/30 backdrop-blur-md hover:border-slate-600 transition-colors">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Confidence
          </p>
          <p className={cn('text-base sm:text-lg font-semibold', confidenceColor)}>
            {confidenceLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
