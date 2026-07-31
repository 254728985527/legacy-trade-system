'use client';

import React, { memo } from 'react';
import { TickData } from '@/types';

interface IncomingTickRingProps {
  latestTick: TickData | null;
  totalCollected: number;
  sampleWindow?: number;
}

export const IncomingTickRing: React.FC<IncomingTickRingProps> = memo(({
  latestTick,
  totalCollected,
  sampleWindow = 1000,
}) => {
  const digit = latestTick ? latestTick.digit : 0;
  const change = latestTick?.change || 0;
  const isUp = change >= 0;
  const fillPct = Math.min(100, Math.round((totalCollected / sampleWindow) * 100));

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)] flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span>📡 INCOMING TICK</span>
        <span className="text-[10px] text-gray-500 font-mono animate-pulse">REALTIME</span>
      </div>

      <div className="text-[#D4AF37] text-xs tracking-widest my-1 font-mono">★★★★★</div>

      {/* Ring Gauge with Smooth Rotation */}
      <div className="relative w-36 h-36 rounded-full border-4 border-[rgba(212,175,55,0.35)] flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.15)_inset] bg-[#0d0d0d]">
        <div
          className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[#F4CB4B] border-r-[#F4CB4B] transition-transform duration-300"
          style={{ transform: `rotate(${(digit * 36) + 45}deg)` }}
        ></div>
        <div id="incoming-digit" className="font-mono font-extrabold text-5xl sm:text-6xl text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] flex flex-col items-center transition-all duration-200">
          <span className="animate-pulse">{digit}</span>
          {latestTick && (
            <span className="text-[10px] text-[#22c55e] tracking-tight font-normal">
              {latestTick.timestampStr}
            </span>
          )}
        </div>
      </div>

      {/* Price Change Badge with Animation */}
      <div className="mt-2 font-mono text-[11px] font-bold">
        {latestTick ? (
          <span className={`px-2 py-0.5 rounded border transition-all duration-200 ${isUp ? 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]' : 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]'}`}>
            CHANGE: {isUp ? '+' : ''}{change.toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-500">CHANGE: --</span>
        )}
      </div>

      <div className="font-mono text-[11px] text-[#8b8b8b] mt-2 tracking-wider font-bold">
        TICKS: {totalCollected}/{sampleWindow}
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden border border-gray-900">
        <div
          className="h-full bg-gradient-to-r from-[#8a6a1c] to-[#F4CB4B] rounded-full transition-all duration-500"
          style={{ width: `${fillPct}%` }}
        ></div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom memo comparison for performance
  // Only re-render if tick digit changes or collection changes significantly
  return (
    prevProps.latestTick?.digit === nextProps.latestTick?.digit &&
    prevProps.latestTick?.change === nextProps.latestTick?.change &&
    Math.abs(prevProps.totalCollected - nextProps.totalCollected) < 5
  );
});
