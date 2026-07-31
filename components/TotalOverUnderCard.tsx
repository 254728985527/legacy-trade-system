'use client';
import React from 'react';
import { DigitStats } from '@/types';
import { PieChart } from 'lucide-react';

interface TotalOverUnderCardProps {
  digitStats: DigitStats;
}

export const TotalOverUnderCard: React.FC<TotalOverUnderCardProps> = ({ digitStats }) => {
  const { underTotalPct, overTotalPct } = digitStats;

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <PieChart size={14} className="text-[#D4AF37]" />
          TOTAL % ON OVER &amp; UNDER
        </span>
        <span className="text-[10px] text-gray-500 font-mono">AGGREGATE</span>
      </div>

      <div className="flex gap-2">
        {/* Under Box */}
        <div className="flex-1 p-3 rounded-lg text-center bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.4)]">
          <div className="font-mono text-[10px] font-bold tracking-wider text-[#22c55e]">
            UNDER (0-4)
          </div>
          <div className="font-mono text-[9.5px] text-[#8b8b8b] my-0.5">0+1+2+3+4</div>
          <div className="font-mono font-extrabold text-2xl text-[#22c55e]">
            {underTotalPct.toFixed(1)}%
          </div>
        </div>

        {/* Over Box */}
        <div className="flex-1 p-3 rounded-lg text-center bg-[rgba(234,179,8,0.12)] border border-[rgba(234,179,8,0.4)]">
          <div className="font-mono text-[10px] font-bold tracking-wider text-[#eab308]">
            OVER (5-9)
          </div>
          <div className="font-mono text-[9.5px] text-[#8b8b8b] my-0.5">5+6+7+8+9</div>
          <div className="font-mono font-extrabold text-2xl text-[#eab308]">
            {overTotalPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Horizontal Split Percentage Bar */}
      <div className="flex h-5 rounded-md overflow-hidden mt-3 font-mono text-[10px] font-extrabold shadow-inner border border-gray-900">
        <div
          className="bg-[#22c55e] text-black flex items-center justify-center transition-all duration-300"
          style={{ width: `${underTotalPct}%` }}
        >
          UNDER {underTotalPct.toFixed(1)}%
        </div>
        <div
          className="bg-[#eab308] text-black flex items-center justify-center transition-all duration-300"
          style={{ width: `${overTotalPct}%` }}
        >
          OVER {overTotalPct.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
