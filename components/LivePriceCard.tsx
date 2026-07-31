'use client';
import React from 'react';
import { DerivSymbol, TickData } from '@/types';
import { formatPriceParts } from '@/utils/digitAnalysis';
import { Radio, TrendingDown, TrendingUp } from 'lucide-react';

interface LivePriceCardProps {
  selectedSymbol: DerivSymbol;
  latestTick: TickData | null;
  onSubscribeLiveTicks?: () => void;
}

export const LivePriceCard: React.FC<LivePriceCardProps> = ({ selectedSymbol, latestTick, onSubscribeLiveTicks }) => {
  const isLive = latestTick !== null;
  const price = latestTick ? latestTick.quote : selectedSymbol.default_price;
  const change = latestTick?.change || 0;
  const isUp = change >= 0;
  const pctChange = price > 0 ? (change / price) * 100 : 0;
  const { intPart, decPart } = formatPriceParts(price, selectedSymbol.pip_size);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)] relative overflow-hidden">
      <div className="flex items-center justify-between mb-2 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Radio size={14} className={isLive ? "text-[#22c55e]" : "text-amber-500"} />
          {isLive ? 'LIVE DERIV TICK' : 'CONNECTING DERIV...'}
        </span>
        <div className="flex items-center gap-2">
          {onSubscribeLiveTicks && (
            <button
              onClick={onSubscribeLiveTicks}
              className="bg-[rgba(34,197,94,0.12)] hover:bg-[rgba(34,197,94,0.25)] text-[#22c55e] border border-[#22c55e]/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Click to subscribe or refresh live ticks stream"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              REFRESH TICK
            </button>
          )}
          <span className="flex items-center gap-1 font-mono text-[11px]">
            {isUp ? (
              <span className="text-[#22c55e] bg-[rgba(34,197,94,0.15)] px-2 py-0.5 rounded border border-[#22c55e]/30 flex items-center gap-1 font-extrabold">
                <TrendingUp size={13} /> +{Math.abs(change).toFixed(selectedSymbol.pip_size)} ({pctChange >= 0 ? '+' : ''}{pctChange.toFixed(3)}%)
              </span>
            ) : (
              <span className="text-[#ef4444] bg-[rgba(239,68,68,0.15)] px-2 py-0.5 rounded border border-[#ef4444]/30 flex items-center gap-1 font-extrabold">
                <TrendingDown size={13} /> -{Math.abs(change).toFixed(selectedSymbol.pip_size)} ({pctChange.toFixed(3)}%)
              </span>
            )}
          </span>
        </div>
      </div>

      <div id="live-price-val" className="font-mono font-extrabold text-3xl sm:text-4xl text-white tracking-tight flex items-baseline gap-2">
        <span>
          {intPart}
          <span className="text-[#F4CB4B]">.{decPart}</span>
        </span>
      </div>

      <div className="font-mono text-[11px] text-[#8b8b8b] mt-1.5 uppercase font-semibold flex items-center justify-between">
        <span>{selectedSymbol.display_name.toUpperCase()}</span>
        <div className="flex items-center gap-2 text-[10px] text-amber-500/80 font-mono">
          {latestTick && (
            <span className="text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded border border-[#22c55e]/30 font-bold font-mono">
              ⏱ {latestTick.timestampStr} {latestTick.latencyMs ? `(${latestTick.latencyMs}ms)` : ''}
            </span>
          )}
          <span>
            PIP: {selectedSymbol.pip_size} | DIGIT: <b className="text-white bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-gray-700">{latestTick ? latestTick.digit : 0}</b>
          </span>
        </div>
      </div>
    </div>
  );
};
