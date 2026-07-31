import React from 'react';
import { DigitStats } from '../types';
import { Cpu } from 'lucide-react';

interface AiEndpointCardProps {
  digitStats: DigitStats;
}

export const AiEndpointCard: React.FC<AiEndpointCardProps> = ({ digitStats }) => {
  const {
    underTarget,
    overTarget,
    percentages,
    direction,
    confidence,
    recommendation,
  } = digitStats;

  const underVals = [0, 1, 2, 3, 4].map((d) => percentages[d] || 0);
  const overVals = [5, 6, 7, 8, 9].map((d) => percentages[d] || 0);

  const underStrong = Math.max(...underVals);
  const underWeak = Math.min(...underVals);

  const overStrong = Math.max(...overVals);
  const overWeak = Math.min(...overVals);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Cpu size={14} className="text-[#22c55e]" />
          AI ENDPOINT (TRADE SIGNAL)
        </span>
        <span className="text-[10px] text-gray-500 font-mono">NEURAL SIGNAL</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Under Side */}
        <div className="flex-1 bg-[#0d0d0d] border border-gray-800 rounded-lg p-2.5 text-center">
          <div className="font-mono text-[9.5px] font-bold text-[#22c55e] tracking-wider mb-1">
            UNDER SIDE (0-4)
          </div>
          <div className="font-sans text-[11px] text-[#8b8b8b] mb-1">
            AI ENDPOINT: <b className="font-mono text-lg text-white">{underTarget}</b>
          </div>
          <div className="flex gap-1 justify-center font-mono">
            <div className="flex-1 bg-[rgba(34,197,94,0.15)] text-[#22c55e] rounded p-1">
              <span className="text-[8px] block">STRONGEST</span>
              <span className="text-xs font-extrabold">{underStrong.toFixed(1)}%</span>
            </div>
            <div className="flex-1 bg-[rgba(239,68,68,0.15)] text-[#ef4444] rounded p-1">
              <span className="text-[8px] block">WEAKEST</span>
              <span className="text-xs font-extrabold">{underWeak.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div className="w-9 h-9 rounded-full bg-[#111] border-2 border-[#F4CB4B] flex items-center justify-center font-['Cinzel',serif] font-extrabold text-xs text-[#F4CB4B] shrink-0 shadow-[0_0_8px_rgba(244,203,75,0.3)]">
          VS
        </div>

        {/* Over Side */}
        <div className="flex-1 bg-[#0d0d0d] border border-gray-800 rounded-lg p-2.5 text-center">
          <div className="font-mono text-[9.5px] font-bold text-[#eab308] tracking-wider mb-1">
            OVER SIDE (5-9)
          </div>
          <div className="font-sans text-[11px] text-[#8b8b8b] mb-1">
            AI ENDPOINT: <b className="font-mono text-lg text-white">{overTarget}</b>
          </div>
          <div className="flex gap-1 justify-center font-mono">
            <div className="flex-1 bg-[rgba(34,197,94,0.15)] text-[#22c55e] rounded p-1">
              <span className="text-[8px] block">STRONGEST</span>
              <span className="text-xs font-extrabold">{overStrong.toFixed(1)}%</span>
            </div>
            <div className="flex-1 bg-[rgba(239,68,68,0.15)] text-[#ef4444] rounded p-1">
              <span className="text-[8px] block">WEAKEST</span>
              <span className="text-xs font-extrabold">{overWeak.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* DCR Summary Grid */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-2 text-center">
          <div className="font-mono text-[9px] text-[#8b8b8b] tracking-wider mb-1">
            DIRECTION
          </div>
          <div className={`font-mono font-extrabold text-sm ${direction === 'UNDER' ? 'text-[#22c55e]' : 'text-[#eab308]'}`}>
            {direction === 'UNDER' ? '↓ UNDER' : '↑ OVER'}
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-2 text-center">
          <div className="font-mono text-[9px] text-[#8b8b8b] tracking-wider mb-1">
            AI CONFIDENCE
          </div>
          <div className="font-mono font-extrabold text-sm text-[#F4CB4B]">
            {confidence.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#F4CB4B] mt-0.5">★★★★☆</div>
        </div>

        <div className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-2 text-center">
          <div className="font-mono text-[9px] text-[#8b8b8b] tracking-wider mb-1">
            RECOMMENDATION
          </div>
          <div
            className={`font-mono font-extrabold text-xs mt-0.5 ${
              recommendation === 'TAKE TRADE ✓' ? 'text-[#22c55e]' : 'text-amber-500'
            }`}
          >
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
