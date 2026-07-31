'use client';
import React from 'react';
import { DigitStats } from '@/types';
import { MousePointer, Target } from 'lucide-react';

interface DigitRangeCardsProps {
  digitStats: DigitStats;
  currentDigit: number;
}

export const DigitRangeCards: React.FC<DigitRangeCardsProps> = ({ digitStats, currentDigit }) => {
  const {
    percentages,
    highestDigit,
    secondHighestDigit,
    lowestDigit,
    threshold0_4,
    threshold5_9,
    numerator0_4,
    numerator5_9,
  } = digitStats;

  const renderDigitGroup = (digits: number[], threshold: number, numerator: number, groupTitle: string) => {
    // Check if the incoming currentDigit is in this group (0-4 or 5-9)
    const isGroupActive = digits.includes(currentDigit);

    // Digits above and below threshold in this group
    const overDigits = digits.filter((d) => percentages[d] > threshold);
    const underDigits = digits.filter((d) => percentages[d] <= threshold);

    const overTotal = overDigits.reduce((s, d) => s + percentages[d], 0);
    const underTotal = underDigits.reduce((s, d) => s + percentages[d], 0);

    return (
      <div className={`bg-[#0a0a0a] border ${isGroupActive ? 'border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.25)]' : 'border-[rgba(212,175,55,0.35)]'} rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)] flex-1 min-w-[300px] transition-all duration-200`}>
        <div className="flex items-center justify-between mb-3.5 border-b border-[#1f1f1f] pb-2">
          <div className="font-['Inter',sans-serif] font-extrabold text-sm text-[#F4CB4B] tracking-wider uppercase">
            {groupTitle}
          </div>
          {isGroupActive ? (
            <span className="flex items-center gap-1.5 text-[10.5px] font-mono font-extrabold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/60 px-2.5 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <Target size={12} className="text-[#3b82f6] animate-spin" style={{ animationDuration: '3s' }} />
              CURSOR TOUCHING [{currentDigit}]
            </span>
          ) : (
            <span className="text-[10px] font-mono text-gray-500">RANGE ACTIVE</span>
          )}
        </div>

        {/* Digit Circles Row */}
        <div className="flex justify-between gap-1.5 mb-2.5 pt-2">
          {digits.map((d) => {
            const isCurrent = d === currentDigit;
            const pct = percentages[d] || 0;
            let styleClass = 'border-[#333] text-white bg-[#0d0d0d]';
            let pctClass = 'border-[#2c2c2c] text-[#8b8b8b] bg-[#0d0d0d]';

            if (isCurrent) {
              styleClass = 'border-[#3b82f6] text-[#3b82f6] shadow-[0_0_18px_rgba(59,130,246,0.85)] bg-[#0f172a] scale-110 ring-2 ring-[#3b82f6]/50';
              pctClass = 'border-[#3b82f6] text-white bg-[#3b82f6] font-extrabold shadow-[0_0_8px_rgba(59,130,246,0.6)]';
            } else if (d === highestDigit) {
              styleClass = 'border-[#22c55e] text-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.35)] bg-[#0d0d0d]';
              pctClass = 'border-[#22c55e] text-[#22c55e] bg-[#0d0d0d]';
            } else if (d === secondHighestDigit) {
              styleClass = 'border-[#eab308] text-[#eab308] shadow-[0_0_12px_rgba(234,179,8,0.3)] bg-[#0d0d0d]';
              pctClass = 'border-[#eab308] text-[#eab308] bg-[#0d0d0d]';
            } else if (d === lowestDigit) {
              styleClass = 'border-[#ef4444] text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)] bg-[#0d0d0d]';
              pctClass = 'border-[#ef4444] text-[#ef4444] bg-[#0d0d0d]';
            }

            return (
              <div key={d} className="flex flex-col items-center gap-1.5 flex-1 relative">
                {/* Animated Cursor Pointer Tag when touched */}
                {isCurrent && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-[#3b82f6] text-white text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-full shadow-[0_0_12px_#3b82f6] z-20 animate-bounce whitespace-nowrap">
                    <MousePointer size={10} className="fill-white" />
                    <span>TOUCH</span>
                  </div>
                )}

                <div
                  className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center font-mono font-extrabold text-xl sm:text-22 border-[2.5px] transition-all duration-150 relative ${styleClass}`}
                >
                  {d}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#3b82f6] animate-ping opacity-75" />
                  )}
                </div>
                <div
                  className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md border text-center transition-all duration-150 ${pctClass}`}
                >
                  {pct.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Dual Over / Under Threshold Box */}
        <div className="relative flex mt-4 border border-gray-900 rounded-xl overflow-visible">
          {/* Left Side: Over */}
          <div className="flex-1 p-3 pt-4 text-center bg-gradient-to-b from-[rgba(34,197,94,0.14)] to-[rgba(34,197,94,0.03)] border border-[rgba(34,197,94,0.55)] rounded-l-xl">
            <div className="font-mono font-extrabold text-[10.5px] text-[#22c55e] tracking-tight">
              OVER (Above {threshold.toFixed(1)}%)
            </div>
            <div className="font-mono text-xs text-[#eaeaea] my-2">
              {overDigits.length ? overDigits.join(' · ') : '—'}
            </div>
            <div className="font-mono text-[10px] text-[#8b8b8b] mb-1">
              {overDigits.length} Digit{overDigits.length !== 1 ? 's' : ''}
            </div>
            <div className="font-mono font-extrabold text-xl text-[#22c55e]">
              {overTotal.toFixed(1)}%
            </div>
          </div>

          {/* Center Threshold Gauge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#050505] border-2 border-[#F4CB4B] flex flex-col items-center justify-center z-10 shadow-[0_0_18px_rgba(212,175,55,0.35),inset_0_0_12px_rgba(212,175,55,0.15)]">
            <div className="font-mono font-extrabold text-base text-white">
              {threshold.toFixed(1)}%
            </div>
            <div className="font-mono text-[7.5px] text-[#F4CB4B] tracking-wider mt-0.5 uppercase">
              THRESHOLD
            </div>
            <div className="font-mono text-[9px] text-[#8b8b8b] mt-0.5">
              {numerator} ÷ 5
            </div>
          </div>

          {/* Right Side: Under */}
          <div className="flex-1 p-3 pt-4 text-center bg-gradient-to-b from-[rgba(239,68,68,0.14)] to-[rgba(239,68,68,0.03)] border border-[rgba(239,68,68,0.55)] border-l-0 rounded-r-xl">
            <div className="font-mono font-extrabold text-[10.5px] text-[#ef4444] tracking-tight">
              UNDER (Below {threshold.toFixed(1)}%) ↓
            </div>
            <div className="font-mono text-xs text-[#eaeaea] my-2">
              {underDigits.length ? underDigits.join(' · ') : '—'}
            </div>
            <div className="font-mono text-[10px] text-[#8b8b8b] mb-1">
              {underDigits.length} Digit{underDigits.length !== 1 ? 's' : ''}
            </div>
            <div className="font-mono font-extrabold text-xl text-[#ef4444]">
              {underTotal.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {renderDigitGroup([0, 1, 2, 3, 4], threshold0_4, numerator0_4, 'DIGIT 0 TO 4')}
      {renderDigitGroup([5, 6, 7, 8, 9], threshold5_9, numerator5_9, 'DIGIT 5 TO 9')}
    </div>
  );
};
