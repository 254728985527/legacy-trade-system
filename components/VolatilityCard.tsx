'use client';
import React, { useState, useRef, useEffect } from 'react';
import { DERIV_SYMBOLS, DerivSymbol } from '@/types';
import { Activity, ChevronDown, Check } from 'lucide-react';

interface VolatilityCardProps {
  selectedSymbol: DerivSymbol;
  onSymbolChange: (symbol: DerivSymbol) => void;
  latestTick?: {
    quote: number;
    change: number;
    digit: number;
    epoch: number;
    timestamp: string;
  } | null;
}

function getSymbolBadges(s: DerivSymbol) {
  const is1s = s.symbol.startsWith('1HZ') || s.display_name.includes('(1s)');
  let num = '';
  const match = s.display_name.match(/\b(100|75|50|25|10)\b/);
  if (match) {
    num = match[1];
  } else if (s.symbol.includes('100')) num = '100';
  else if (s.symbol.includes('75')) num = '75';
  else if (s.symbol.includes('50')) num = '50';
  else if (s.symbol.includes('25')) num = '25';
  else if (s.symbol.includes('10')) num = '10';

  return { is1s, num };
}

const CandlestickIconWithBadge: React.FC<{ is1s: boolean; num: string }> = ({ is1s, num }) => {
  return (
    <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#151515] rounded border border-gray-800/80">
      {/* Candlestick graphic */}
      <div className="flex items-end gap-[2px] opacity-75">
        <div className="w-[2px] h-2.5 bg-[#8bb4a8] rounded-sm"></div>
        <div className="w-[2px] h-4 bg-[#8bb4a8] rounded-sm"></div>
        <div className="w-[2px] h-3 bg-[#8bb4a8] rounded-sm"></div>
        <div className="w-[2px] h-5 bg-[#8bb4a8] rounded-sm"></div>
      </div>
      {/* Black box number */}
      {num && (
        <span className="absolute -top-1.5 -left-1 bg-black text-white text-[9px] font-extrabold px-1 rounded border border-gray-600 leading-tight shadow-sm">
          {num}
        </span>
      )}
      {/* Red 1s circle tag */}
      {is1s && (
        <span className="absolute -top-1.5 -right-1 bg-[#ef4444] text-white text-[8px] font-extrabold px-1 py-0.2 rounded-full leading-tight shadow-sm">
          1s
        </span>
      )}
    </div>
  );
};

export const VolatilityCard: React.FC<VolatilityCardProps> = ({
  selectedSymbol,
  onSymbolChange,
  latestTick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedBadges = getSymbolBadges(selectedSymbol);

  const price = latestTick ? latestTick.quote : null;
  const change = latestTick ? latestTick.change : 0;
  const isUp = change >= 0;
  const pctChange = price && price > 0 ? (change / price) * 100 : 0;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)] relative">
      <div className="flex items-center justify-between mb-3 text-[12.5px] font-extrabold tracking-wider text-[#F4CB4B] uppercase">
        <span className="flex items-center gap-1.5">
          <Activity size={14} className="text-[#D4AF37]" />
          VOLATILITY INDEX
        </span>
        <span className="text-[10px] text-gray-400 font-normal border border-gray-800 rounded px-1.5 py-0.5">
          DERIV WS
        </span>
      </div>

      {/* Custom Dropdown Trigger */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          id="volatility-custom-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#111] border border-[rgba(212,175,55,0.4)] hover:border-[#F4CB4B] text-[#eaeaea] p-2.5 rounded-lg font-mono text-sm flex items-center justify-between cursor-pointer transition-colors shadow-inner"
        >
          <div className="flex items-center gap-3">
            <CandlestickIconWithBadge is1s={selectedBadges.is1s} num={selectedBadges.num} />
            <div className="text-left">
              <div className="font-extrabold text-sm text-white">{selectedSymbol.display_name}</div>
              {price !== null ? (
                <div
                  className={`text-[11px] font-mono font-extrabold flex items-center gap-1 mt-0.5 tracking-tight ${
                    isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  }`}
                >
                  <span>{price.toFixed(selectedSymbol.pip_size)}</span>
                  <span>{isUp ? '+' : '-'}{Math.abs(change).toFixed(selectedSymbol.pip_size)}</span>
                  <span>({pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%)</span>
                  <span className="text-[9px]">{isUp ? '▲' : '▼'}</span>
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 font-normal uppercase mt-0.5">
                  {selectedSymbol.category} ({selectedSymbol.symbol})
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-[#D4AF37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu Overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.9)] z-50 max-h-[360px] overflow-y-auto divide-y divide-gray-900/60 p-1.5 scrollbar-thin">
            {['Continuous Indices', 'Jump Indices', 'Daily Land Indices'].map((cat) => {
              const categorySymbols = DERIV_SYMBOLS.filter((s) => s.category === cat);
              if (categorySymbols.length === 0) return null;

              return (
                <div key={cat} className="py-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]/80 font-mono">
                    {cat}
                  </div>
                  {categorySymbols.map((s) => {
                    const badges = getSymbolBadges(s);
                    const isSelected = s.symbol === selectedSymbol.symbol;

                    return (
                      <button
                        key={s.symbol}
                        type="button"
                        onClick={() => {
                          onSymbolChange(s);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors font-mono cursor-pointer my-0.5 ${
                          isSelected
                            ? 'bg-[rgba(212,175,55,0.15)] border border-[#D4AF37]/50 text-white'
                            : 'hover:bg-[#1a1a1a] text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CandlestickIconWithBadge is1s={badges.is1s} num={badges.num} />
                          <div>
                            <div className="font-medium text-xs text-white">{s.display_name}</div>
                            <div className="text-[10px] text-gray-500">{s.symbol}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="text-[#F4CB4B] mr-1" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden Native Select for testing accessibility */}
      <select
        id="volatility-select"
        value={selectedSymbol.symbol}
        onChange={(e) => {
          const found = DERIV_SYMBOLS.find((s) => s.symbol === e.target.value);
          if (found) onSymbolChange(found);
        }}
        className="sr-only"
      >
        {DERIV_SYMBOLS.map((s) => (
          <option key={s.symbol} value={s.symbol}>
            {s.display_name}
          </option>
        ))}
      </select>
    </div>
  );
};
