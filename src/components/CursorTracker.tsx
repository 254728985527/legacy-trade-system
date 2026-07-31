import React from 'react';
import { Target } from 'lucide-react';

interface CursorTrackerProps {
  currentDigit: number;
  targetDigit: number;
  remainingTicks: number;
}

export const CursorTracker: React.FC<CursorTrackerProps> = ({
  currentDigit,
  targetDigit,
  remainingTicks,
}) => {
  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Target size={14} className="text-[#3b82f6]" />
          LIVE CURSOR TRACKER
        </span>
        <span className="text-[10px] text-gray-500 font-mono">TARGET DISTANCE</span>
      </div>

      <div className="flex flex-col gap-2 font-mono">
        <div className="flex items-center justify-between text-center">
          <div className="flex-1">
            <div className="text-[10px] text-[#8b8b8b] tracking-wider">CURRENT</div>
            <div id="ct-current" className="font-extrabold text-2xl text-[#3b82f6] mt-0.5">
              {currentDigit}
            </div>
          </div>

          <div className="text-xl text-[#8b8b8b] px-2 font-bold animate-pulse">→</div>

          <div className="flex-1">
            <div className="text-[10px] text-[#8b8b8b] tracking-wider">TARGET</div>
            <div id="ct-target" className="font-extrabold text-2xl text-[#22c55e] mt-0.5">
              {targetDigit}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-[10px] text-[#8b8b8b] tracking-wider">REMAINING</div>
            <div id="ct-remaining" className="font-extrabold text-2xl text-white mt-0.5">
              {remainingTicks}
            </div>
            <div className="text-[9px] text-[#8b8b8b]">TICKS</div>
          </div>
        </div>

        {/* Stepper Dots Visualizer */}
        <div className="flex items-center justify-center gap-1.5 mt-2 pt-2 border-t border-[#1a1a1a]">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => {
            const isCurrent = step === currentDigit;
            const isTarget = step === targetDigit;
            let bgClass = 'bg-[#181818] text-gray-500 border-gray-800';
            if (isCurrent) bgClass = 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_8px_#3b82f6]';
            else if (isTarget) bgClass = 'bg-[#22c55e] text-black font-bold border-[#22c55e] shadow-[0_0_8px_#22c55e]';

            return (
              <div
                key={step}
                className={`w-6 h-6 rounded-full border text-[10px] flex items-center justify-center font-bold transition-all duration-200 ${bgClass}`}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
