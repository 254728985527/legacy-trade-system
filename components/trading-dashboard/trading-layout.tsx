'use client';

import { CandleStickChart } from './candle-stick-chart';
import { BettingTypeButtons } from './betting-type-buttons';
import { TransactionHistoryTable } from './transaction-table';
import { SettingsPanel } from './settings-panel';
import type { ActiveSymbol, Tick, ProposalInfo } from '@deriv/core';

interface TradingLayoutProps {
  // Market data
  activeSymbol: ActiveSymbol | null;
  currentTick: Tick | null;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;

  // Buy action
  onBuy: () => Promise<void>;
  isBuying: boolean;
  buyError?: string | null;

  // Additional UI props
  children?: React.ReactNode;
}

export function TradingLayout({
  activeSymbol,
  currentTick,
  proposal,
  isProposalLoading,
  onBuy,
  isBuying,
  buyError,
  children,
}: TradingLayoutProps) {
  const currentPrice = currentTick?.quote || 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* VOL Section */}
      <div className="w-full">
        <p className="text-[rgb(255,193,7)] text-sm font-bold mb-4">VOL</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgb(0,255,136)] rounded-full flex items-center justify-center text-[rgb(20,24,31)] text-xs font-bold">10</div>
            <button className="text-white hover:text-[rgb(255,193,7)] flex items-center gap-2 text-sm font-medium">
              {activeSymbol?.display_name || 'Jump 10 Index'} <span className="text-gray-400">▼</span>
            </button>
          </div>
          <span className="text-white font-bold text-lg">{currentPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Betting Type Buttons */}
      <BettingTypeButtons />

      {/* Candlestick Chart */}
      <CandleStickChart currentPrice={currentPrice} symbol={activeSymbol?.display_name} />

      {/* Transaction History */}
      <TransactionHistoryTable />

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Error Message */}
      {buyError && (
        <div className="w-full bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
          {buyError}
        </div>
      )}

      {/* Buy Button */}
      <button
        onClick={onBuy}
        disabled={isBuying || isProposalLoading}
        className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
          isBuying || isProposalLoading
            ? 'bg-gray-600 text-white opacity-50 cursor-not-allowed'
            : 'bg-[rgb(0,195,144)] text-white hover:bg-[rgb(0,175,124)] shadow-lg hover:shadow-xl'
        }`}
      >
        {isBuying ? 'Processing...' : 'Buy'}
      </button>

      {/* Children content (other components) */}
      {children}
    </div>
  );
}
