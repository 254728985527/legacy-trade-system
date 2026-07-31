'use client';
import React from 'react';
import { DigitStats } from '@/types';
import { BarChart2 } from 'lucide-react';

interface DigitStrengthRankingProps {
  digitStats: DigitStats;
}

export const DigitStrengthRanking: React.FC<DigitStrengthRankingProps> = ({ digitStats }) => {
  const { percentages, avgPct } = digitStats;
  const maxPct = Math.max(...percentages, 15);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-2 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <BarChart2 size={14} className="text-[#D4AF37]" />
          DIGIT STRENGTH RANKING
        </span>
        <span className="text-[10px] text-gray-400 font-mono">DISTRIBUTION WEIGHT</span>
      </div>

      <div className="flex items-end gap-2.5 h-32 mt-3 px-2 border-b border-gray-800 pb-2">
        {percentages.map((p, i) => {
          let barColor = '#eab308'; // neutral
          if (p > avgPct * 1.1) barColor = '#22c55e'; // strong
          else if (p < avgPct * 0.9) barColor = '#ef4444'; // weak

          const heightPct = Math.max(8, Math.round((p / maxPct) * 100));

          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div
                className="font-mono text-[11px] font-bold mb-1 transition-all group-hover:scale-110"
                style={{ color: barColor }}
              >
                {p.toFixed(1)}%
              </div>
              <div
                className="w-full rounded-t transition-all duration-300 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                style={{ height: `${heightPct}%`, backgroundColor: barColor }}
              ></div>
              <div className="font-mono text-xs text-[#8b8b8b] mt-1.5 font-bold">{i}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-3 font-mono text-[10.5px] text-[#8b8b8b]">
        <span className="flex items-center gap-1.5">
          <i className="w-2 h-2 rounded-full bg-[#22c55e]"></i> STRONG (&gt;avg)
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2 h-2 rounded-full bg-[#eab308]"></i> NEUTRAL (≈avg)
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2 h-2 rounded-full bg-[#ef4444]"></i> WEAK (&lt;avg)
        </span>
      </div>
    </div>
  );
};
