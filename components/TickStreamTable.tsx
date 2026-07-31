'use client';
import React, { useMemo, memo } from 'react';
import { TickData } from '@/types';

interface TickStreamTableProps {
  ticks: TickData[];
}

export const TickStreamTable: React.FC<TickStreamTableProps> = memo(({ ticks }) => {
  const recentTicks = useMemo(() => [...ticks].reverse().slice(0, 50), [ticks.length]);

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.35)] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-sm text-[#F4CB4B] tracking-wider uppercase font-mono">
          📊 REAL-TIME TICK STREAM (LAST 50 TICKS)
        </h3>
        <span className="text-xs text-gray-400 font-mono">Total in buffer: {ticks.length}</span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left font-mono text-xs text-[#eaeaea]">
          <thead className="bg-[#111] text-[#F4CB4B] uppercase text-[10px] tracking-wider sticky top-0">
            <tr>
              <th className="py-2 px-3 border-b border-gray-800">Time</th>
              <th className="py-2 px-3 border-b border-gray-800">Symbol</th>
              <th className="py-2 px-3 border-b border-gray-800">Quote Price</th>
              <th className="py-2 px-3 border-b border-gray-800">Change</th>
              <th className="py-2 px-3 border-b border-gray-800 text-center">Digit</th>
              <th className="py-2 px-3 border-b border-gray-800 text-center">Type</th>
              <th className="py-2 px-3 border-b border-gray-800 text-center">Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {recentTicks.map((t, idx) => {
              const isUp = (t.change || 0) >= 0;
              const isEven = t.digit % 2 === 0;
              const isUnder = t.digit <= 4;

              return (
                <tr key={`${t.epoch}-${idx}`} className="hover:bg-[#141414] transition-colors">
                  <td className="py-2 px-3 text-gray-400 text-[11px]">{t.timestampStr || new Date(t.epoch * 1000).toLocaleTimeString()}</td>
                  <td className="py-2 px-3 font-bold text-gray-300">{t.symbol}</td>
                  <td className="py-2 px-3 font-extrabold text-white">
                    {t.quote.toFixed(t.pip_size)}
                  </td>
                  <td className={`py-2 px-3 font-semibold ${isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {isUp ? '+' : ''}{(t.change || 0).toFixed(t.pip_size)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-[#181818] border border-gray-700 font-extrabold text-white leading-6 text-center">
                      {t.digit}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isEven ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-purple-950 text-purple-400 border border-purple-800'}`}>
                      {isEven ? 'EVEN' : 'ODD'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isUnder ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                      {isUnder ? 'UNDER (0-4)' : 'OVER (5-9)'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
