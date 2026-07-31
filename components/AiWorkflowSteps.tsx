'use client';
import React from 'react';
import { DigitStats } from '@/types';
import { Cpu, Rocket } from 'lucide-react';

interface AiWorkflowStepsProps {
  digitStats: DigitStats;
  currentDigit: number;
  isExecuting: boolean;
  isExecutedPop: boolean;
  lastExecutedDirection: 'UNDER' | 'OVER';
  lastExecutedConfidence: number;
}

export const AiWorkflowSteps: React.FC<AiWorkflowStepsProps> = ({
  digitStats,
  currentDigit,
  isExecuting,
  isExecutedPop,
  lastExecutedDirection,
  lastExecutedConfidence,
}) => {
  const { direction, confidence, underTarget, overTarget, confirmDigits, confirmLabel, entryRangeArr, confirmRangeArr } =
    digitStats;

  const activeTarget = direction === 'UNDER' ? underTarget : overTarget;
  const isTouched = currentDigit === activeTarget;
  const isConfirmHit = confirmDigits.includes(currentDigit);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="text-center mb-4">
        <h2 className="font-sans font-extrabold text-base sm:text-lg text-[#22c55e] flex items-center justify-center gap-2">
          <Cpu size={18} className="text-[#22c55e]" />
          <span>AI ENGINE</span>
          <span id="ai-range-label" className="text-[#F4CB4B] bg-[#111] px-2 py-0.5 rounded border border-[#D4AF37]/40 text-xs sm:text-sm">
            {direction === 'UNDER' ? 'UNDER (0 - 4)' : 'OVER (5 - 9)'}
          </span>
        </h2>
        <div className="font-mono text-[10.5px] text-[#8b8b8b] tracking-widest mt-0.5 uppercase">
          AI ENDPOINT TO EXECUTION WORKFLOW
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-stretch">
        {/* Step 1 */}
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.35)] rounded-lg p-3 relative flex flex-col justify-between">
          <div>
            <div className="w-5 h-5 rounded-full bg-[#F4CB4B] text-black font-extrabold font-mono text-xs flex items-center justify-center mb-1.5">
              1
            </div>
            <div className="font-sans font-bold text-[10.5px] text-[#F4CB4B] uppercase tracking-wider mb-1">
              AI Endpoint
            </div>
            <div className="font-sans text-[10px] text-[#8b8b8b] mb-2 leading-relaxed">
              AI recommends trade {direction} ({entryRangeArr[0]}-{entryRangeArr[entryRangeArr.length - 1]})
            </div>
          </div>
          <div>
            <div className="bg-[#111] border border-[#262626] rounded-md p-2 text-center mb-2">
              <div className="text-[9px] text-[#8b8b8b] mb-1">ENTRY POINT</div>
              <div className="font-mono font-extrabold text-2xl text-white">{activeTarget}</div>
            </div>
            <div className="font-mono text-[9px] text-[#8b8b8b] uppercase">
              CONFIDENCE
              <div className="font-sans font-extrabold text-xs text-[#22c55e] mt-0.5">
                {confidence.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.35)] rounded-lg p-3 relative flex flex-col justify-between">
          <div>
            <div className="w-5 h-5 rounded-full bg-[#F4CB4B] text-black font-extrabold font-mono text-xs flex items-center justify-center mb-1.5">
              2
            </div>
            <div className="font-sans font-bold text-[10.5px] text-[#F4CB4B] uppercase tracking-wider mb-1">
              Cursor Touching
            </div>
            <div className="font-sans text-[10px] text-[#8b8b8b] mb-2 leading-relaxed">
              Live cursor reaches the entry digit
            </div>
          </div>
          <div>
            <div className="bg-[#111] border border-[#262626] rounded-md p-2 text-center mb-2">
              <div className="text-[9px] text-[#8b8b8b] mb-1">LIVE CURSOR</div>
              <div className="flex justify-center gap-1 mt-1">
                {entryRangeArr.map((d) => (
                  <div
                    key={d}
                    className={`w-4.5 h-4.5 rounded-full border text-[9px] font-mono flex items-center justify-center font-bold ${
                      d === currentDigit
                        ? 'border-[#22c55e] text-[#22c55e] bg-[rgba(34,197,94,0.2)] shadow-[0_0_6px_#22c55e]'
                        : 'border-[#333] text-gray-500'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="font-mono text-[9px] text-[#8b8b8b] uppercase">
              STATUS
              <div className={`font-sans font-extrabold text-xs mt-0.5 ${isTouched ? 'text-[#22c55e]' : 'text-amber-500'}`}>
                {isTouched ? 'TOUCHED ✓' : 'WATCHING'}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.35)] rounded-lg p-3 relative flex flex-col justify-between">
          <div>
            <div className="w-5 h-5 rounded-full bg-[#F4CB4B] text-black font-extrabold font-mono text-xs flex items-center justify-center mb-1.5">
              3
            </div>
            <div className="font-sans font-bold text-[10.5px] text-[#F4CB4B] uppercase tracking-wider mb-1">
              Confirmation Check
            </div>
            <div className="font-sans text-[10px] text-[#8b8b8b] mb-2 leading-relaxed">
              Engine checks {confirmLabel}
            </div>
          </div>
          <div>
            <div className="bg-[#111] border border-[#262626] rounded-md p-2 text-center mb-2">
              <div className="text-[9px] text-[#8b8b8b] mb-1">NEXT TICK</div>
              <div className="flex justify-center gap-1 mt-1">
                {confirmRangeArr.map((d) => (
                  <div
                    key={d}
                    className={`w-4.5 h-4.5 rounded-full border text-[9px] font-mono flex items-center justify-center font-bold ${
                      confirmDigits.includes(d)
                        ? 'border-[#22c55e] text-[#22c55e] bg-[rgba(34,197,94,0.15)]'
                        : 'border-[#333] text-gray-500'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="font-mono text-[9px] text-[#8b8b8b] uppercase">
              RESULT
              <div className="font-sans font-extrabold text-xs text-[#22c55e] mt-0.5">
                WATCHING {confirmDigits.join(' / ')}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Execution Point with Orange Blink */}
        <div
          className={`bg-[#0d0d0d] border border-[rgba(212,175,55,0.35)] rounded-lg p-3 relative flex flex-col justify-between transition-all duration-300 ${
            isExecuting
              ? 'bg-[rgba(255,160,32,0.35)] border-[#FFA020] shadow-[0_0_22px_rgba(255,160,32,0.65)] scale-105 z-20'
              : ''
          }`}
        >
          <div>
            <div className="w-5 h-5 rounded-full bg-[#F4CB4B] text-black font-extrabold font-mono text-xs flex items-center justify-center mb-1.5">
              4
            </div>
            <div className="font-sans font-bold text-[10.5px] text-[#F4CB4B] uppercase tracking-wider mb-1">
              Execution Point
            </div>
            <div className="font-sans text-[10px] text-[#8b8b8b] mb-2 leading-relaxed">
              Fires when cursor lands on {confirmDigits.join(' or ')}
            </div>
          </div>

          <div className="text-center my-1">
            <div className="w-9 h-9 rounded-full border-2 border-[#22c55e] flex items-center justify-center mx-auto text-base text-[#22c55e] bg-[#111]">
              <Rocket size={18} />
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] text-[#8b8b8b] uppercase text-center">
              TRADE STATUS
              <div className="font-sans font-extrabold text-xs text-[#22c55e] mt-0.5">
                {isConfirmHit ? 'FIRING ⚡' : 'ARMED'}
              </div>
            </div>
            <div
              className={`font-sans font-black text-xs text-[#FFA020] tracking-widest text-center mt-1 transition-opacity duration-200 ${
                isExecuting ? 'opacity-100 animate-bounce' : 'opacity-0'
              }`}
            >
              EXECUTE
            </div>
          </div>
        </div>

        {/* Step 5: Trade Executed with Green Pop */}
        <div
          className={`bg-[#0d0d0d] border border-[rgba(212,175,55,0.35)] rounded-lg p-3 relative flex flex-col justify-between transition-all duration-300 ${
            isExecutedPop
              ? 'scale-105 bg-[rgba(34,197,94,0.35)] border-[#22c55e] shadow-[0_0_26px_rgba(34,197,94,0.7)] z-20'
              : ''
          }`}
        >
          <div>
            <div className="w-5 h-5 rounded-full bg-[#F4CB4B] text-black font-extrabold font-mono text-xs flex items-center justify-center mb-1.5">
              5
            </div>
            <div className="font-sans font-bold text-[10.5px] text-[#F4CB4B] uppercase tracking-wider mb-1">
              Trade Executed
            </div>
            <div className="font-sans text-[10px] text-[#8b8b8b] mb-2 leading-relaxed">
              {direction} trade placed successfully
            </div>
          </div>

          <div className="text-center font-black text-2xl text-[#22c55e] my-1">
            {direction === 'UNDER' ? '⬇' : '⬆'}
          </div>

          <div className="font-mono text-[9px] text-[#8b8b8b] uppercase text-center">
            DIRECTION / CONFIDENCE
            <div className="font-sans font-extrabold text-xs text-[#22c55e] mt-0.5">
              {lastExecutedDirection} · {lastExecutedConfidence.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
