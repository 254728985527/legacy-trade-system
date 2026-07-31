import React, { useEffect, useState } from 'react';
import { TickData } from '../types';
import { Activity, TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';

interface LiveDataStreamProps {
  ticks: TickData[];
  isConnected: boolean;
}

export const LiveDataStream: React.FC<LiveDataStreamProps> = ({ ticks, isConnected }) => {
  const [animatingTicks, setAnimatingTicks] = useState<Map<string, boolean>>(new Map());
  const [priceHistory, setPriceHistory] = useState<Array<{ price: number; time: number }>>([]);
  const [ticksPerSecond, setTicksPerSecond] = useState<number>(0);

  const latestTick = ticks.length > 0 ? ticks[ticks.length - 1] : null;
  const previousTick = ticks.length > 1 ? ticks[ticks.length - 2] : null;

  // Calculate ticks per second (update more frequently for immediate feedback)
  useEffect(() => {
    if (ticks.length < 1) return;
    
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    
    const recentTicks = ticks.filter(t => t.epoch * 1000 > oneSecondAgo);
    setTicksPerSecond(recentTicks.length);
    
    // Poll every 100ms for real-time tick rate updates
    const interval = setInterval(() => {
      const currentNow = Date.now();
      const currentOneSecondAgo = currentNow - 1000;
      const currentRecentTicks = ticks.filter(t => t.epoch * 1000 > currentOneSecondAgo);
      setTicksPerSecond(currentRecentTicks.length);
    }, 100);
    
    return () => clearInterval(interval);
  }, [ticks]);

  // Track price history for consistency check
  useEffect(() => {
    if (!latestTick) return;
    
    setPriceHistory(prev => {
      const newHistory = [...prev, { price: latestTick.quote, time: Date.now() }];
      // Keep last 60 entries (roughly 1 minute at typical tick rates)
      return newHistory.slice(-60);
    });

    // Instant tick display (0ms animation for immediate updates)
    const tickKey = `${latestTick.epoch}-${latestTick.quote}`;
    setAnimatingTicks(prev => {
      const updated = new Map(prev);
      updated.set(tickKey, true);
      // Immediately remove animation state for instant display
      setAnimatingTicks(p => {
        const m = new Map(p);
        m.delete(tickKey);
        return m;
      });
      return updated;
    });
  }, [latestTick?.epoch, latestTick?.quote]);

  // Calculate price consistency metrics
  const priceChange = latestTick && previousTick ? latestTick.quote - previousTick.quote : 0;
  const isUpTick = priceChange >= 0;
  const avgPriceChange = priceHistory.length > 1
    ? (priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory.length
    : 0;
  const priceVolatility = priceHistory.length > 1
    ? Math.max(...priceHistory.map(p => p.price)) - Math.min(...priceHistory.map(p => p.price))
    : 0;

  // Show more recent ticks and ensure latest tick is always visible
  const recentTicks = [...ticks].reverse().slice(0, 15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Live Tick Feed */}
      <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-5 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className={isConnected ? 'text-[#22c55e] animate-pulse' : 'text-gray-500'} />
          <h3 className="font-extrabold text-sm text-[#F4CB4B] tracking-wider uppercase">
            Live Tick Feed
          </h3>
          <span className="ml-auto text-xs text-gray-400 font-mono">
            {ticksPerSecond} ticks/sec
          </span>
        </div>

        {/* Live ticker display */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {recentTicks.length > 0 ? (
            recentTicks.map((tick, idx) => {
              const tickKey = `${tick.epoch}-${tick.quote}`;
              const isAnimating = animatingTicks.has(tickKey);
              const isDigitUp = tick.digit >= 5;
              const isBold = idx === 0;

              return (
                <div
                  key={`${tickKey}-${idx}`}
                  className={`p-3 rounded-lg border ${
                    isAnimating
                      ? 'bg-[#1a3a1a] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.4)] scale-105'
                      : 'bg-[#111] border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.35)] scale-100'
                  } ${isBold ? 'ring-2 ring-[#F4CB4B]' : ''}`}
                >
                  <div className="flex items-center justify-between text-sm font-mono">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-gray-500 w-20">
                        {new Date(tick.epoch * 1000).toLocaleTimeString()}
                      </span>
                      <span className={`font-extrabold px-2 py-1 rounded text-xs border ${
                        isDigitUp 
                          ? 'bg-amber-950 text-amber-300 border-amber-800' 
                          : 'bg-green-950 text-green-300 border-green-800'
                      }`}>
                        Digit: {tick.digit}
                      </span>
                    </div>
                    <span className="text-white font-extrabold">
                      {tick.quote.toFixed(5)}
                    </span>
                    <span className={`flex items-center gap-1 font-bold text-xs ml-3 ${
                      tick.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}>
                      {tick.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(tick.change).toFixed(5)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Waiting for live ticks...
            </div>
          )}
        </div>
      </div>

      {/* Price Consistency Metrics */}
      <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-5 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-[#F4CB4B]" />
          <h3 className="font-extrabold text-sm text-[#F4CB4B] tracking-wider uppercase">
            Price Flow Consistency
          </h3>
        </div>

        <div className="space-y-4">
          {/* Current Price Direction */}
          <div className="bg-[#111] rounded-lg p-3 border border-[rgba(212,175,55,0.2)]">
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Current Tick Direction</div>
            <div className="flex items-center gap-3">
              {isUpTick ? (
                <div className="flex items-center gap-1 text-[#22c55e] font-bold text-sm">
                  <TrendingUp size={18} />
                  UP TREND
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[#ef4444] font-bold text-sm">
                  <TrendingDown size={18} />
                  DOWN TREND
                </div>
              )}
              <span className="ml-auto text-white font-mono font-bold">
                {priceChange > 0 ? '+' : ''}{priceChange.toFixed(5)}
              </span>
            </div>
          </div>

          {/* Price Volatility */}
          <div className="bg-[#111] rounded-lg p-3 border border-[rgba(212,175,55,0.2)]">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
              <span>Price Volatility (60-tick window)</span>
              {priceVolatility > 0.05 ? <span className="text-red-400 text-xs">HIGH</span> : <span className="text-green-400 text-xs">STABLE</span>}
            </div>
            <div className="relative bg-black rounded h-6 border border-gray-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 flex items-center justify-center text-white font-mono text-xs font-bold ${
                  priceVolatility > 0.05 ? 'bg-gradient-to-r from-red-900 to-red-700' : 'bg-gradient-to-r from-green-900 to-green-700'
                }`}
                style={{ width: `${Math.min((priceVolatility * 1000), 100)}%` }}
              >
                {priceVolatility > 0.01 && <span>{priceVolatility.toFixed(5)}</span>}
              </div>
            </div>
          </div>

          {/* Tick Consistency Rate */}
          <div className="bg-[#111] rounded-lg p-3 border border-[rgba(212,175,55,0.2)]">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Real-time Tick Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#F4CB4B]">{ticksPerSecond}</span>
              <span className="text-sm text-gray-400">ticks/second</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {priceHistory.length > 0 && `${priceHistory.length} prices tracked`}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-[#111] rounded-lg p-3 border border-[rgba(212,175,55,0.2)]">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
              <Clock size={12} className="inline mr-1" />
              Recent Price Range
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <div className="text-gray-500 text-[10px]">High</div>
                <div className="text-green-400 font-bold">
                  {priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.price)).toFixed(5) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-[10px]">Current</div>
                <div className="text-white font-bold">
                  {latestTick ? latestTick.quote.toFixed(5) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-[10px]">Low</div>
                <div className="text-red-400 font-bold">
                  {priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.price)).toFixed(5) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
