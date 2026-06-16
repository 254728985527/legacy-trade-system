'use client';

import { useState, useEffect } from 'react';
import { CandleStickChart } from './candle-stick-chart';
import { LDPDisplay } from './ldp-display';
import { SignalCircles } from './signal-circles';
import { SignalPopup } from './signal-popup';
import { ContractControls } from './contract-controls';
import { TradeControlsPanel } from './trade-controls-panel';
import { TransactionHistoryEnhanced } from './transaction-history-enhanced';
import { AccountSwitcher } from './account-switcher';
import { VolSelector } from './vol-selector';
import { useFullTrading } from '@/hooks/use-full-trading';
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
}

export function TradingLayout({
  activeSymbol,
  currentTick,
  proposal,
  isProposalLoading,
  onBuy,
  isBuying,
  buyError,
}: TradingLayoutProps) {
  const trading = useFullTrading();
  const currentPrice = currentTick?.quote || trading.currentPrice || 0;
  const [visibleSignal, setVisibleSignal] = useState<any>(null);

  // Connect WebSocket on mount
  useEffect(() => {
    if (!trading.isConnected) {
      trading.connectWebSocket();
    }
  }, [trading]);

  // Show signal popup when strong signal detected
  useEffect(() => {
    if (trading.isStrongSignal && (trading.lastOverSignal || trading.lastUnderSignal)) {
      setVisibleSignal(trading.lastOverSignal || trading.lastUnderSignal);
    }
  }, [trading.isStrongSignal, trading.lastOverSignal, trading.lastUnderSignal]);

  // Handle signal circle firing - auto-trade when all same color
  const handleSignalFire = async (direction: 'UP' | 'DOWN') => {
    if (trading.autoTradeEnabled) {
      try {
        await onBuy();
      } catch (error) {
        console.error('Auto-trade error:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Account Switcher */}
      <AccountSwitcher
        accountType={trading.accountType}
        accountBalance={trading.accountBalance}
        onAccountTypeChange={trading.setAccountType}
      />

      {/* VOL Section */}
      <div className="w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5">
        <p className="text-[rgb(255,193,7)] text-sm font-bold mb-4">VOL</p>
        <VolSelector
          selectedId="jump-10"
          selectedPrice={currentPrice}
          onSelectionChange={(id, label) => {
            console.log('[v0] Selected index:', label);
          }}
        />
      </div>

      {/* LDP Display */}
      <LDPDisplay digitHistory={trading.digitHistory} />

      {/* Contract Controls */}
      <ContractControls
        selectedContract={trading.selectedContract as any}
        onContractChange={trading.setSelectedContract}
        selectedBarrier={trading.selectedBarrier}
        onBarrierChange={trading.setSelectedBarrier}
      />

      {/* Candlestick Chart with Signal Circles */}
      <CandleStickChart
        currentPrice={currentPrice}
        candles={trading.candles}
        symbol={activeSymbol?.display_name}
        isGlowingSignal={trading.isGlowingSignal}
        onSignalFire={handleSignalFire}
      />

      {/* Transaction History */}
      <TransactionHistoryEnhanced
        trades={trading.trades}
        onRefresh={() => {
          trading.clearTrades();
          trading.disconnectWebSocket();
          setTimeout(() => trading.connectWebSocket(), 500);
        }}
      />

      {/* Trade Controls */}
      <TradeControlsPanel
        baseStake={trading.baseStake}
        onStakeChange={trading.setBaseStake}
        martingaleEnabled={trading.martingaleEnabled}
        onMartingaleToggle={trading.setMartingaleEnabled}
        martingaleMultiplier={trading.martingaleMultiplier}
        onMultiplierChange={trading.setMartingaleMultiplier}
        martingaleDigit={trading.martingaleDigit}
        onMartingaleDigitChange={trading.setMartingaleDigit}
        autoTradeEnabled={trading.autoTradeEnabled}
        onAutoTradeToggle={trading.setAutoTradeEnabled}
        onBuyClick={onBuy}
      />

      {/* Error Message */}
      {buyError && (
        <div className="w-full bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
          {buyError}
        </div>
      )}

      {/* Signal Popup */}
      <SignalPopup
        signal={visibleSignal}
        onClose={() => setVisibleSignal(null)}
        autoClose={8000}
      />
    </div>
  );
}
