import React from 'react';
import { DigitStats } from '../types';
import { Zap } from 'lucide-react';

interface SignalCardProps {
  digitStats: DigitStats;
}

export const SignalCard: React.FC<SignalCardProps> = ({ digitStats }) => {
  const { highestDigit, secondHighestDigit, lowestDigit, direction } = digitStats;

  const topItems = [
    { digit: highestDigit, color: '#22c55e' },
    { digit: secondHighestDigit, color: '#eab308' },
    { digit: lowestDigit, color: '#ef4444' },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Zap size={14} className="text-[#22c55e]" />
          SIGNAL (TOP 3 DIGITS)
        </span>
        <span className="text-[10px] text-gray-500 font-mono">CLUSTER</span>
      </div>

      <div className="flex justify-around items-center">
        {topItems.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-extrabold text-lg bg-[#0d0d0d]"
              style={{ borderColor: item.color, color: item.color }}
            >
              {item.digit}
            </div>
            <div className="font-mono text-[9.5px] text-[#8b8b8b] tracking-wider uppercase">
              TOP
            </div>
          </div>
        ))}
      </div>

      <div
        className={`font-mono text-[10.5px] font-extrabold tracking-wider text-center mt-3 pt-2.5 border-t border-[#1a1a1a] ${
          direction === 'UNDER' ? 'text-[#22c55e]' : 'text-[#eab308]'
        }`}
      >
        ✓ CONFIRMED DIRECTION: {direction}
      </div>
    </div>
  );
};
