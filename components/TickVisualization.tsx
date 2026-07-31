'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { TickData } from '@/types';

interface TickVisualizationProps {
  ticks: TickData[];
  isConnected: boolean;
}

export const TickVisualization: React.FC<TickVisualizationProps> = ({ ticks, isConnected }) => {
  const lastTickLengthRef = useRef(0);
  const animatingRef = useRef<Set<number>>(new Set());
  
  // Memoize the display ticks to avoid recalculation on every render
  const displayTicks = useMemo(() => {
    const last50 = ticks.slice(-50);
    return last50.reverse();
  }, [ticks]);

  // Track animation in a ref and trigger immediate DOM update via CSS class
  useEffect(() => {
    if (ticks.length > lastTickLengthRef.current) {
      lastTickLengthRef.current = ticks.length;
      animatingRef.current.clear();
      // Animation handled purely via CSS transitions - no state update needed
    }
  }, [ticks.length]);

  if (!isConnected) {
    return (
      <div className="bg-[#0a0a0a] border-2 border-[#FF6B6B] rounded-xl p-8 text-center">
        <div className="text-[#FF6B6B] text-lg font-bold uppercase tracking-widest mb-2">🔴 NOT CONNECTED</div>
        <div className="text-gray-400">Waiting for WebSocket connection...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border-2 border-[#22c55e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span className="text-[#22c55e] text-lg font-bold uppercase tracking-widest">🎯 INCOMING TICKS</span>
        </div>
        <div className="text-gray-400 text-sm font-mono">Total: {ticks.length}</div>
      </div>

      <div className="grid grid-cols-10 gap-2 mb-4">
        {displayTicks.map((tick, idx) => (
          <div
            key={`${tick.epoch}-${idx}`}
            className="aspect-square flex items-center justify-center rounded-lg font-mono font-bold text-white transition-all duration-200 bg-[#1a1a1a] border border-[rgba(212,175,55,0.35)] hover:bg-[#F4CB4B] hover:shadow-[0_0_20px_rgba(244,203,75,0.5)]"
          >
            {tick.digit}
          </div>
        ))}
      </div>

      {ticks.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-4 pb-4 border-b border-[#1a1a1a]">
            <span>Latest: {ticks[ticks.length - 1].digit}</span>
            <span>Price: {ticks[ticks.length - 1].quote.toFixed(2)}</span>
            <span>Time: {ticks[ticks.length - 1].timestampStr}</span>
          </div>

          {/* Digit Distribution */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Digit Frequency (Last 50 ticks):</div>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 10 }, (_, i) => {
                const count = displayTicks.filter((t) => t.digit === i).length;
                const percentage = displayTicks.length > 0 ? (count / displayTicks.length) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#F4CB4B] to-[#8a6a1c] rounded transition-all"
                      style={{ height: `${Math.max(4, percentage * 2)}px` }}
                    ></div>
                    <span className="text-[10px] font-mono font-bold text-gray-400">{i}</span>
                    <span className="text-[9px] text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
