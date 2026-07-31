'use client';
import React from 'react';
import { DigitStats } from '@/types';
import { Award } from 'lucide-react';

interface KeyDigitsCardProps {
  digitStats: DigitStats;
}

export const KeyDigitsCard: React.FC<KeyDigitsCardProps> = ({ digitStats }) => {
  const { highestDigit, secondHighestDigit, lowestDigit, percentages, direction } = digitStats;

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Award size={14} className="text-[#F4CB4B]" />
          KEY DIGITS
        </span>
        <span className="text-[10px] text-gray-500 font-mono">DOMINANCE</span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Highest Digit */}
        <div className="flex items-center gap-2.5 py-2 border-b border-[#1a1a1a]">
          <div className="w-8 h-8 rounded-full bg-[rgba(34,197,94,0.15)] text-[#22c55e] border-2 border-[#22c55e] flex items-center justify-center font-mono font-extrabold text-xs shrink-0">
            {highestDigit}
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9.5px] text-[#8b8b8b] tracking-wider uppercase">
              HIGHEST
            </div>
            <div className="font-mono font-extrabold text-sm text-[#22c55e]">
              {percentages[highestDigit]?.toFixed(1)}%
            </div>
          </div>
          <div className="font-mono text-[9px] font-extrabold text-[#F4CB4B] border border-[rgba(212,175,55,0.35)] px-1.5 py-0.5 rounded">
            TOP
          </div>
        </div>

        {/* Direction Indicator */}
        <div
          className={`font-mono text-[9.5px] font-extrabold tracking-wider ml-11 my-1 ${
            direction === 'UNDER' ? 'text-[#22c55e]' : 'text-[#eab308]'
          }`}
        >
          → Drives direction: {direction}
        </div>

        {/* 2nd Highest Digit */}
        <div className="flex items-center gap-2.5 py-2 border-b border-[#1a1a1a]">
          <div className="w-8 h-8 rounded-full bg-[rgba(234,179,8,0.15)] text-[#eab308] border-2 border-[#eab308] flex items-center justify-center font-mono font-extrabold text-xs shrink-0">
            {secondHighestDigit}
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9.5px] text-[#8b8b8b] tracking-wider uppercase">
              2ND HIGHEST
            </div>
            <div className="font-mono font-extrabold text-sm text-[#eab308]">
              {percentages[secondHighestDigit]?.toFixed(1)}%
            </div>
          </div>
          <div className="font-mono text-[9px] font-extrabold text-[#F4CB4B] border border-[rgba(212,175,55,0.35)] px-1.5 py-0.5 rounded">
            TOP
          </div>
        </div>

        {/* Lowest Digit */}
        <div className="flex items-center gap-2.5 py-2">
          <div className="w-8 h-8 rounded-full bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-2 border-[#ef4444] flex items-center justify-center font-mono font-extrabold text-xs shrink-0">
            {lowestDigit}
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9.5px] text-[#8b8b8b] tracking-wider uppercase">
              LOWEST
            </div>
            <div className="font-mono font-extrabold text-sm text-[#ef4444]">
              {percentages[lowestDigit]?.toFixed(1)}%
            </div>
          </div>
          <div className="font-mono text-[9px] font-extrabold text-[#F4CB4B] border border-[rgba(212,175,55,0.35)] px-1.5 py-0.5 rounded">
            TOP
          </div>
        </div>
      </div>
    </div>
  );
};
