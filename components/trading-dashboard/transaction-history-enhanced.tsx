'use client';

import { RefreshCw } from 'lucide-react';

export interface Trade {
  id: string;
  contractType: string;
  entryPrice: number;
  exitPrice: number;
  stake: number;
  pnl: number;
  timestamp: number;
  status: 'win' | 'loss';
}

interface TransactionHistoryEnhancedProps {
  trades: Trade[];
  onRefresh: () => void;
}

export function TransactionHistoryEnhanced({
  trades,
  onRefresh,
}: TransactionHistoryEnhancedProps) {
  // Get last 9 trades
  const lastNTrades = trades.slice(-9);

  // Calculate total P&L
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winCount = trades.filter((t) => t.status === 'win').length;
  const lossCount = trades.filter((t) => t.status === 'loss').length;
  const winRate = trades.length > 0 ? ((winCount / trades.length) * 100).toFixed(1) : '0';

  return (
    <div className="w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5 mb-6">
      {/* Header with title and refresh */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-[rgb(255,193,7)] text-sm font-bold">TRANSACTION HISTORY</p>
          <span className="text-gray-500 text-xs">({lastNTrades.length})</span>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-[rgb(255,193,7)] text-xs font-semibold rounded-lg transition-all border border-[rgb(255,193,7,0.3)]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-black/30 rounded p-2">
          <p className="text-gray-400 text-xs">Total P&L</p>
          <p className={`font-bold text-sm ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${totalPnl.toFixed(2)}
          </p>
        </div>
        <div className="bg-black/30 rounded p-2">
          <p className="text-gray-400 text-xs">Wins</p>
          <p className="font-bold text-sm text-emerald-400">{winCount}</p>
        </div>
        <div className="bg-black/30 rounded p-2">
          <p className="text-gray-400 text-xs">Losses</p>
          <p className="font-bold text-sm text-red-400">{lossCount}</p>
        </div>
        <div className="bg-black/30 rounded p-2">
          <p className="text-gray-400 text-xs">Win Rate</p>
          <p className="font-bold text-sm text-yellow-400">{winRate}%</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgb(255,193,7,0.3)]">
              <th className="px-3 py-2 text-left text-[rgb(255,152,0)] font-semibold">Type</th>
              <th className="px-3 py-2 text-left text-[rgb(255,152,0)] font-semibold">Entry</th>
              <th className="px-3 py-2 text-left text-[rgb(255,152,0)] font-semibold">Exit</th>
              <th className="px-3 py-2 text-left text-[rgb(255,152,0)] font-semibold">Stake</th>
              <th className="px-3 py-2 text-right text-[rgb(255,152,0)] font-semibold">P/L</th>
            </tr>
          </thead>
          <tbody>
            {lastNTrades.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-400">
                  No trades yet
                </td>
              </tr>
            ) : (
              lastNTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-[rgb(255,255,255,0.05)] hover:bg-[rgb(40,46,57,0.5)] transition-colors"
                >
                  <td className="px-3 py-2 text-white font-semibold text-xs">
                    {trade.contractType}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    ${trade.entryPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    ${trade.exitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    ${trade.stake.toFixed(2)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-bold ${
                      trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {trades.length === 0 && (
        <p className="text-gray-500 text-xs text-center mt-4">
          Start trading to see your history here
        </p>
      )}
    </div>
  );
}
