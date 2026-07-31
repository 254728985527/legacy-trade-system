import React, { useState, useEffect, useRef } from 'react';
import { TickData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ContinuousTickFeedProps {
  ticks: TickData[];
  isConnected: boolean;
}

export function ContinuousTickFeed({ ticks, isConnected }: ContinuousTickFeedProps) {
  const [displayedPrice, setDisplayedPrice] = useState<number | null>(null);
  const [displayedDigit, setDisplayedDigit] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isUp, setIsUp] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update displayed values on every tick with zero delay
  useEffect(() => {
    if (ticks.length === 0) return;

    const latestTick = ticks[ticks.length - 1];
    
    // Instant price update
    setDisplayedPrice(latestTick.quote);
    setDisplayedDigit(latestTick.digit);
    setPriceChange(latestTick.change);
    setIsUp(latestTick.change >= 0);

    // Auto-scroll to latest tick
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [ticks]);

  const latestTick = ticks.length > 0 ? ticks[ticks.length - 1] : null;
  const recentTicks = [...ticks].reverse().slice(0, 20);

  return (
    <div className="space-y-4 p-4 bg-[#0a0a0a] rounded-lg border border-[rgba(212,175,55,0.2)]">
      {/* Current Live Price Display */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-400">CONTINUOUS LIVE TICK STREAM</div>
        <div className="flex items-center justify-center gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">PRICE</div>
            <div className="text-4xl font-mono font-bold text-white">
              {displayedPrice?.toFixed(5) || '---'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">DIGIT</div>
            <div className="text-4xl font-mono font-bold text-[#F4CB4B]">
              {displayedDigit !== null ? displayedDigit : '-'}
            </div>
          </div>
        </div>

        {/* Price Change Indicator */}
        {latestTick && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {isUp ? (
              <>
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-green-500 font-mono">
                  +{Math.abs(priceChange).toFixed(5)}
                </span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className="text-red-500" />
                <span className="text-red-500 font-mono">
                  {priceChange.toFixed(5)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {isConnected ? 'LIVE CONNECTED' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* Recent Ticks Scrollable Feed */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2">RECENT TICKS (INSTANT)</div>
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          {recentTicks.map((tick, idx) => {
            const isLatest = idx === 0;
            const changeDir = tick.change >= 0 ? 'up' : 'down';
            return (
              <div
                key={`${tick.epoch}-${tick.quote}-${idx}`}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-center whitespace-nowrap ${
                  isLatest
                    ? 'bg-[#1a3a1a] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.4)] ring-2 ring-[#F4CB4B]'
                    : `bg-[#111] border-[rgba(212,175,55,0.2)] ${
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

      {/* Tick Statistics */}
      {ticks.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[rgba(212,175,55,0.1)]">
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
        </div>
      )}
    </div>
  );
}
