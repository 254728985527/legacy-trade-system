'use client';

import { useState, useEffect } from 'react';
import { useDigitsTrading } from '../hooks/use-digits-trading';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { DigitsView } from '../components/digits-view';

export default function DigitsPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;
  const [selectedVolatility, setSelectedVolatilityRaw] = useState('1HZ75V');
  const [tickCount, setTickCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'deriv' | 'smart'>('deriv');

  const trading = useDigitsTrading({ ws, isConnected, isExhausted, isAuthenticated: !!auth.wsUrl, onAuthWSFailed: logout });

  // When volatility index is selected, update the active symbol to get correct price data
  const setSelectedVolatility = (symbol: string) => {
    setSelectedVolatilityRaw(symbol);
    trading.selectSymbol(symbol);
  };

  // Initialize with default volatility on mount
  useEffect(() => {
    trading.selectSymbol('1HZ75V');
  }, []); // Only run once on mount

  // Sync selectedVolatility with activeSymbol when it changes
  useEffect(() => {
    if (trading.activeSymbol?.underlying_symbol) {
      setSelectedVolatilityRaw(trading.activeSymbol.underlying_symbol);
    }
  }, [trading.activeSymbol?.underlying_symbol]);

  return (
    <DigitsView
      authState={authState}
      accounts={accounts}
      activeAccount={activeAccount}
      onLogin={login}
      onSignUp={signUp}
      onLogout={logout}
      onSwitchAccount={switchAccount}
      logoSrc={logoSrc}
      isConnected={trading.isConnected}
      isLoading={trading.isLoading}
      error={trading.error}
      symbols={trading.symbols}
      activeSymbol={trading.activeSymbol}
      selectSymbol={trading.selectSymbol}
      currentTick={trading.currentTick}
      lastDigit={trading.lastDigit}
      digitStats={trading.digitStats}
      pipSize={trading.pipSize}
      selectedVolatility={selectedVolatility}
      onSelectVolatility={setSelectedVolatility}
      tickCount={tickCount}
      totalTicks={1000}
      tradeType={trading.tradeType}
      setTradeType={trading.setTradeType}
      contractMode={trading.contractMode}
      setContractMode={trading.setContractMode}
      selectedDigit={trading.selectedDigit}
      setSelectedDigit={trading.setSelectedDigit}
      stake={trading.stake}
      setStake={trading.setStake}
      duration={trading.duration}
      setDuration={trading.setDuration}
      durationLimits={trading.durationLimits}
      proposal={trading.proposal}
      isProposalLoading={trading.isProposalLoading}
      buyContract={trading.buyContract}
      isBuying={trading.isBuying}
      buyResult={trading.buyResult}
      buyError={trading.buyError}
      clearBuyResult={trading.clearBuyResult}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      smartTraderProps={{
        symbols: trading.symbols,
        activeSymbol: trading.activeSymbol,
        currentTick: trading.currentTick,
        isConnected: trading.isConnected,
        activeAccount,
        selectSymbol: trading.selectSymbol,
        onRun: trading.buyContract,
        isBuying: trading.isBuying,
        buyError: trading.buyError,
        tradeType: trading.tradeType,
        setTradeType: trading.setTradeType,
        contractMode: trading.contractMode,
        setContractMode: trading.setContractMode,
        stake: trading.stake,
        setStake: trading.setStake,
        durationValue: trading.duration,
        setDurationValue: trading.setDuration,
      }}
    />
  );
}
