'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrentTickDisplay } from './current-tick-display';
import { DigitStatsBar } from './digit-stats-bar';
import { TradeControls } from './trade-controls';
import { TradeTypeChips } from '@/components/custom/trade-type-chips';
import { SymbolSelector } from '@/components/custom/symbol-selector';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import {
  VolatilityIndexPanel,
  LivePricePanel,
  IncomingTickPanel,
  LiveCursorTrackerPanel,
  DigitPanel,
  AIEngineWorkflowPanel,
  DigitStrengthRankingPanel,
  KeyDigitsPanel,
  SignalPanel,
  TotalPercentagePanel,
  AIEndpointPanel,
} from './dashboard-panels';
import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  Tick,
  ProposalInfo,
  DurationLimits,
  BuyResult,
} from '@deriv/core';
import type { ContractMode, TradeType, DigitStats } from '../lib/types';

const DIGIT_TRADE_TYPE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'matches-differs', label: 'Matches/Differs' },
  { value: 'over-under', label: 'Over/Under' },
  { value: 'even-odd', label: 'Even/Odd' },
];

export interface DigitsViewProps {
  // Auth
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;

  // Connection / loading
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // Market data
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
  pipSize: number;
  selectedVolatility?: string;
  onSelectVolatility?: (symbol: string) => void;
  tickCount?: number;
  totalTicks?: number;

  // Trade controls
  tradeType: TradeType;
  setTradeType: (type: TradeType) => void;
  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;
  selectedDigit: number;
  setSelectedDigit: (digit: number) => void;
  stake: string;
  setStake: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  durationLimits: DurationLimits;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  buyContract: () => Promise<void>;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  clearBuyResult: () => void;
  // Branding (used by preview route; no-op in the real app)
  logoSrc?: string;
  appName?: string;
}

export function DigitsView({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onSignUp,
  onLogout,
  onSwitchAccount,
  isConnected,
  isLoading,
  error,
  symbols,
  activeSymbol,
  selectSymbol,
  currentTick,
  lastDigit,
  digitStats,
  pipSize,
  selectedVolatility = '1HZ75V',
  onSelectVolatility,
  tickCount = 0,
  totalTicks = 1000,
  tradeType,
  setTradeType,
  contractMode,
  setContractMode,
  selectedDigit,
  setSelectedDigit,
  stake,
  setStake,
  duration,
  setDuration,
  durationLimits,
  proposal,
  isProposalLoading,
  buyContract,
  isBuying,
  buyResult,
  buyError,
  clearBuyResult,
  logoSrc,
  appName,
}: DigitsViewProps) {
  if (error) {
    return (
      <main className="flex flex-col bg-background items-center justify-center px-4 min-h-dvh">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="dashboard-container">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onLogout={onLogout}
        onSwitchAccount={onSwitchAccount}
        logoSrc={logoSrc}
        appName={appName}
        actions={<ThemeToggle />}
      />
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      {isLoading ? (
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      ) : (
        <div className="w-full overflow-x-hidden overflow-y-auto pb-24">
          {/* Header Section */}
          <div className="border-b border-primary/20 px-4 py-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-primary font-bold text-xs uppercase tracking-wider">Direct</span>
              </div>
              <h1 className="header-title">
                <span>👑</span> LAST DIGIT PREDICTION <span>👑</span>
              </h1>
              <p className="header-subtitle mt-2">REAL-TIME AI ANALYSIS</p>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> LIVE / CURRENT DIGIT
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> HIGHEST %
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> 2ND HIGHEST %
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> LOWEST %
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <VolatilityIndexPanel 
                selectedVolatility={selectedVolatility}
                onSelectVolatility={onSelectVolatility || (() => {})}
                isLoading={isLoading}
              />
              <LivePricePanel 
                selectedVolatility={selectedVolatility}
                currentTick={currentTick}
                isLoading={isLoading}
              />
              <IncomingTickPanel 
                lastDigit={lastDigit}
                tickCount={tickCount}
                totalTicks={totalTicks}
              />
              <LiveCursorTrackerPanel selectedDigit={selectedDigit} />
            </div>

            {/* Center Main Content */}
            <div className="lg:col-span-8 space-y-4">
              {/* Digit Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DigitPanel rangeStart={0} rangeEnd={4} currentTick={currentTick} />
                <DigitPanel rangeStart={5} rangeEnd={9} currentTick={currentTick} />
              </div>

              {/* AI Engine Workflow */}
              <AIEngineWorkflowPanel />

              {/* Digit Strength Ranking */}
              <DigitStrengthRankingPanel digitStats={digitStats} />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <KeyDigitsPanel digitStats={digitStats} />
              <SignalPanel selectedDigit={selectedDigit} />
              <TotalPercentagePanel digitStats={digitStats} />
              <AIEndpointPanel selectedDigit={selectedDigit} />
            </div>
          </div>

          {/* Trade Controls Section */}
          <div className="border-t border-primary/20 px-4 py-6 mt-6">
            <div className="max-w-7xl mx-auto">
              <TradeControls
                tradeType={tradeType}
                contractMode={contractMode}
                onContractModeChange={setContractMode}
                selectedDigit={selectedDigit}
                isConnected={isConnected}
                stake={stake}
                onStakeChange={setStake}
                duration={duration}
                onDurationChange={setDuration}
                durationLimits={durationLimits}
                proposal={proposal}
                isProposalLoading={isProposalLoading}
                onBuy={buyContract}
                isBuying={isBuying}
                buyResult={buyResult}
                buyError={buyError}
                onClearBuyResult={clearBuyResult}
                isAuthenticated={authState === 'authenticated'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-primary/20 bg-background/95 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
