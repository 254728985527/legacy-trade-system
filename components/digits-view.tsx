'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { DigitStatsBar } from './digit-stats-bar';
import { TradeControls } from './trade-controls';
import { TradeTypeChips } from '@/components/custom/trade-type-chips';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { CandlestickChart } from './candlestick-chart';
import type { OHLC, IncomingTick } from './candlestick-chart';
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
  // TURBO mode
  turboMode: boolean;
  setTurboMode: (enabled: boolean) => void;
  // Chart data
  candleData: OHLC[];
  incomingTicks: IncomingTick[];
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
  turboMode,
  setTurboMode,
  candleData,
  incomingTicks,
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
    <main className="flex flex-col bg-background max-lg:h-dvh max-lg:overflow-y-auto lg:overflow-visible">
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
        activeSymbol={activeSymbol}
        currentPrice={currentTick?.quote}
        symbols={symbols}
        onSymbolChange={selectSymbol}
        lastDigit={lastDigit}
      />
      {/* Spacer to push content below fixed header */}
      <div className="h-[72px] shrink-0" />

      {/* Main content area */}
      <div className="flex-1 w-full max-w-full mx-auto px-3 py-3 sm:px-4 sm:py-4 gap-3 lg:flex lg:overflow-visible pb-12">
        {isLoading ? (
          <Skeleton className="w-full h-[500px] rounded-lg" />
        ) : (
          <div className="w-full space-y-3">
            {/* Trade type tabs - hidden on desktop, shown on mobile */}
            <div className="lg:hidden shrink-0 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <TradeTypeChips
                value={tradeType}
                options={DIGIT_TRADE_TYPE_OPTIONS}
                onValueChange={setTradeType}
              />
            </div>

            {/* Main 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              {/* Left Column: Chart/LDP */}
              <Card className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4 h-full">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">LDP</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {incomingTicks.slice(0, 9).map((tick, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-8 h-8 rounded flex items-center justify-center text-xs font-bold',
                              tick.direction === 'up'
                                ? 'bg-[#00C390]/20 border border-[#00C390] text-[#00C390]'
                                : 'bg-[#DE0040]/20 border border-[#DE0040] text-[#DE0040]'
                            )}
                          >
                            {Math.floor(Math.random() * 10)}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Candlestick chart */}
                    <div className="flex-1">
                      <CandlestickChart
                        candleData={candleData}
                        incomingTicks={incomingTicks}
                        width={320}
                        height={220}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Middle Column: Digit stats + Prediction */}
              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-4">
                  {tradeType !== 'even-odd' && (
                    <DigitStatsBar
                      digitStats={digitStats}
                      selectedDigit={selectedDigit}
                      onDigitSelect={setSelectedDigit}
                    />
                  )}

                  {/* Contract modes - Over/Under, Matches/Differs, Even/Odd */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">CONTRACT TYPE</p>
                    <div className="flex gap-2 bg-muted/30 p-1.5 rounded-full">
                      <Button
                        variant="ghost"
                        onClick={() => setContractMode('DIGITMATCH')}
                        className={cn(
                          'flex-1 text-sm h-8 rounded-full transition-all',
                          contractMode === 'DIGITMATCH'
                            ? 'bg-white text-black hover:bg-white'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Matches/Differs
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setContractMode('DIGITUNDER')}
                        className={cn(
                          'flex-1 text-sm h-8 rounded-full transition-all',
                          contractMode === 'DIGITUNDER'
                            ? 'bg-white text-black hover:bg-white'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Over/Under
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setContractMode('DIGITEVEN')}
                        className={cn(
                          'flex-1 text-sm h-8 rounded-full transition-all',
                          contractMode === 'DIGITEVEN'
                            ? 'bg-white text-black hover:bg-white'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Even/Odd
                      </Button>
                    </div>
                  </div>

                  {/* Prediction section */}
                  <div className="rounded-lg border border-border p-3 bg-muted/10 space-y-2">
                    <p className="text-xs text-muted-foreground">Prediction</p>
                    <p className="text-sm font-medium">
                      Last digit of the price will{' '}
                      <span className="text-primary font-bold">be under</span>{' '}
                      <span className="inline-flex w-5 h-5 rounded-full bg-primary text-white items-center justify-center text-xs font-bold">
                        {selectedDigit}
                      </span>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">Payout</span>
                      <span className="text-sm font-bold text-foreground">
                        {proposal?.payout.toFixed(2) ?? '0.00'} USD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column: Trade controls */}
              <Card className="border shadow-sm">
                <CardContent className="p-4">
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
                    turboMode={turboMode}
                    onTurboModeChange={setTurboMode}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm border-t border-border">
        <Footer />
      </div>
    </main>
  );
}
