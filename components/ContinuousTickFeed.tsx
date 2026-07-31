'use client';
import React, { useMemo, useRef, memo, useEffect } from 'react';
import { TickData } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ContinuousTickFeedProps {
  ticks: TickData[];
  isConnected: boolean;
}

export const ContinuousTickFeed = memo(function ContinuousTickFeed({ ticks, isConnected }: ContinuousTickFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTickCountRef = useRef(0);

  // Memoize derived values to avoid recalculation
  const latestTick = useMemo(() => ticks.length > 0 ? ticks[ticks.length - 1] : null, [ticks.length]);
  const recentTicks = useMemo(() => [...ticks].slice(-50).reverse(), [ticks]);

  // Compute displayed values directly from memoized latestTick to avoid state updates
  const isUp = latestTick && latestTick.change >= 0;
  const previousTick = ticks.length > 1 ? ticks[ticks.length - 2] : null;

  // Auto-scroll to latest tick when new ticks arrive
  useEffect(() => {
    if (containerRef.current && ticks.length > prevTickCountRef.current) {
      prevTickCountRef.current = ticks.length;
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
      });
    }
  }, [ticks.length]);

  const ticksPerSecond = useMemo(() => {
    if (ticks.length < 2) return 0;
    const oldestTick = ticks[0];
    const newestTick = ticks[ticks.length - 1];
    const timeDiff = newestTick.epoch - oldestTick.epoch;
    if (timeDiff === 0) return 0;
    return Math.round((ticks.length / timeDiff) * 100) / 100;
  }, [ticks.length]);

  return (
    <div className="space-y-4 p-4 bg-[#0a0a0a] rounded-lg border border-[rgba(212,175,55,0.2)]">
      {/* Current Live Price Display */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-400">CONTINUOUS LIVE TICK STREAM</div>
        <div className="flex items-center justify-center gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">PRICE</div>
            <div className="text-4xl font-mono font-bold text-white animate-pulse">
              {latestTick?.quote.toFixed(5) || '---'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">DIGIT</div>
            <div className={`text-4xl font-mono font-bold text-[#F4CB4B] transition-all duration-300 ${latestTick ? 'scale-110' : 'scale-100'}`}>
              {latestTick?.digit !== undefined ? latestTick.digit : '-'}
            </div>
          </div>
        </div>

        {/* Price Change Indicator */}
        {latestTick && previousTick && (
          <div className="flex items-center justify-center gap-2 mt-3 animate-pulse">
            {isUp ? (
              <>
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-green-500 font-mono">
                  +{Math.abs(latestTick.quote - previousTick.quote).toFixed(5)}
                </span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className="text-red-500" />
                <span className="text-red-500 font-mono">
                  {(latestTick.quote - previousTick.quote).toFixed(5)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Connection Status with breathing effect */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {isConnected ? 'LIVE CONNECTED' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* Recent Ticks Scrollable Feed with Smooth Scrolling */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400">RECENT TICKS (LAST 50)</div>
          <div className="text-xs text-[#F4CB4B] font-mono">
            {ticksPerSecond} ticks/sec
          </div>
        </div>
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {recentTicks.map((tick, idx) => {
            const isLatest = idx === 0;
            const changeDir = tick.change >= 0 ? 'up' : 'down';
            return (
              <div
                key={`${tick.epoch}-${tick.quote}-${idx}`}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-center whitespace-nowrap transition-all duration-200 transform ${
                  isLatest
                    ? 'bg-[#1a3a1a] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.4)] ring-2 ring-[#F4CB4B] scale-100'
                    : `bg-[#111] border-[rgba(212,175,55,0.2)] hover:scale-105 ${
                        changeDir === 'up'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`
                }`}
              >
                <div className="text-xs text-gray-400">#{tick.digit}</div>
                <div className="text-sm font-mono font-bold">
                  {tick.quote.toFixed(5)}
                </div>
                <div className="text-xs">
                  {changeDir === 'up' ? '↑' : '↓'} {Math.abs(tick.change).toFixed(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tick Statistics with Performance Metrics */}
      {ticks.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[rgba(212,175,55,0.1)]">
          <div className="text-center">
            <div className="text-xs text-gray-400">TOTAL TICKS</div>
            <div className="text-lg font-mono font-bold text-[#F4CB4B]">
              {ticks.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">SYMBOL</div>
            <div className="text-sm font-mono text-white">
              {latestTick?.symbol}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">LATENCY</div>
            <div className="text-sm font-mono text-white">
              {latestTick?.latencyMs}ms
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">FLOW RATE</div>
            <div className="text-sm font-mono text-[#22c55e]">
              {ticksPerSecond} Hz
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
