'use client';

import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { NeonDigitDisplay } from './neon-digit-display';
import { VolatilityGauge } from './volatility-gauge';
import { IncomingTickGauge } from './incoming-tick-gauge';
import { CursorTracker } from './cursor-tracker';
import { AIEngineWorkflow } from './ai-engine-workflow';
import { KeyDigitsPanel } from './key-digits-panel';
import { DigitStrengthChart } from './digit-strength-chart';
import { OverUnderGauge } from './over-under-gauge';
import { AIEndpointCard } from './ai-endpoint-card';
import { TradeControls } from './trade-controls';
import { TradeTypeChips } from '@/components/custom/trade-type-chips';
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
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
  pipSize: number;
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
  logoSrc,
  appName,
}: DigitsViewProps) {
  if (error) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgb(10, 10, 10)', alignItems: 'center', justifyContent: 'center', padding: '16px', minHeight: '100dvh' }}>
        <div style={{ maxWidth: '448px', width: '100%', padding: '24px', borderRadius: '12px', border: '1px solid rgb(51, 51, 51)' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgb(255, 51, 51)', marginBottom: '16px' }}>Connection Error</h1>
          <p style={{ fontSize: '14px', color: 'rgb(180, 180, 180)' }}>{error}</p>
        </div>
      </main>
    );
  }

  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);
  
  // Calculate Under/Over totals
  const underTotal = digitStats.percentages.slice(0, 5).reduce((a, b) => a + b, 0);
  const overTotal = digitStats.percentages.slice(5, 10).reduce((a, b) => a + b, 0);

  // Get key digits (highest, 2nd highest, lowest)
  const sortedDigits = digitStats.percentages.map((pct, idx) => ({ digit: idx, pct })).sort((a, b) => b.pct - a.pct);
  const keyDigits = [
    { digit: sortedDigits[0].digit, percentage: sortedDigits[0].pct, rank: 'HIGHEST' as const },
    { digit: sortedDigits[1].digit, percentage: sortedDigits[1].pct, rank: '2ND HIGHEST' as const },
    { digit: sortedDigits[9].digit, percentage: sortedDigits[9].pct, rank: 'LOWEST' as const },
  ];

  const livePrice = currentTick ? currentTick.quote : 0;

  return (
    <main style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgb(10, 10, 10)', minHeight: '100dvh', maxHeight: '100dvh', overflow: 'hidden' }}>
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

      {/* Header spacer */}
      <div style={{ height: authState === 'authenticated' ? '76px' : '66px', flexShrink: 0 }} />

      {/* Scrollable main content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', maxWidth: 'none', marginX: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLoading ? (
            <div>
              <Skeleton className="h-8 w-64 rounded-full mb-4" />
              <Skeleton className="w-full h-96 rounded-xl" />
            </div>
          ) : (
            <>
              {/* Trade type selector */}
              <div style={{ overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="[&::-webkit-scrollbar]:hidden">
                <TradeTypeChips
                  value={tradeType}
                  options={DIGIT_TRADE_TYPE_OPTIONS}
                  onValueChange={setTradeType}
                />
              </div>

              {/* Main 3-column grid layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {/* LEFT COLUMN: Sidebar with gauges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
                  {/* Live Price Display */}
                  <div style={{ padding: '16px', borderRadius: '8px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.05)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgb(255, 215, 0)', marginBottom: '8px', letterSpacing: '1px' }}>
                      📊 LIVE PRICE
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', fontFamily: "'Courier New', monospace", marginBottom: '4px' }}>
                      {livePrice.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgb(180, 180, 180)', fontFamily: "'Courier New', monospace" }}>
                      {activeSymbol?.symbol || 'VOL 75 (1S) INDEX'}
                    </div>
                  </div>

                  {/* Volatility Index */}
                  <VolatilityGauge volatility={75} label="VOLATILITY INDEX" />

                  {/* Incoming Tick */}
                  <IncomingTickGauge currentTick={32} totalTicks={1000} />

                  {/* Cursor Tracker */}
                  <CursorTracker current={1} target={4} remaining={3} nextDigits={[1, 2, 3, 4]} />
                </div>

                {/* MIDDLE-LEFT COLUMN: Digit 0-4 */}
                <div style={{ padding: '16px', borderRadius: '8px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgb(0, 255, 0)', marginBottom: '16px', letterSpacing: '1px' }}>
                    🎯 DIGIT 0 TO 4
                  </div>

                  {/* Digit circles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {[0, 1, 2, 3, 4].map((digit) => (
                      <div key={digit} onClick={() => setSelectedDigit(digit)} style={{ cursor: 'pointer' }}>
                        <NeonDigitDisplay
                          digit={digit}
                          percentage={digitStats.percentages[digit]}
                          isHighest={digitStats.percentages[digit] === maxPct && digit < 5}
                          isLowest={digitStats.percentages[digit] === minPct}
                          isSelected={selectedDigit === digit}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Over/Under analysis */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: 'rgba(0, 255, 0, 0.05)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'rgb(0, 255, 0)', marginBottom: '4px' }}>OVER (Above 6.4%)</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
                        {digitStats.percentages.slice(0, 5).filter(p => p > 6.4).length} Digits
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
                        {underTotal.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'rgb(255, 51, 51)', marginBottom: '4px' }}>UNDER (Below 6.4%) 📉</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace" }}>
                        0 - 1 Digit
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
                        {(100 - underTotal).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* MIDDLE-RIGHT COLUMN: Digit 5-9 */}
                <div style={{ padding: '16px', borderRadius: '8px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgb(0, 255, 0)', marginBottom: '16px', letterSpacing: '1px' }}>
                    🎯 DIGIT 5 TO 9
                  </div>

                  {/* Digit circles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {[5, 6, 7, 8, 9].map((digit) => (
                      <div key={digit} onClick={() => setSelectedDigit(digit)} style={{ cursor: 'pointer' }}>
                        <NeonDigitDisplay
                          digit={digit}
                          percentage={digitStats.percentages[digit]}
                          isHighest={digitStats.percentages[digit] === maxPct && digit >= 5}
                          isLowest={digitStats.percentages[digit] === minPct}
                          isSelected={selectedDigit === digit}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Over/Under analysis */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: 'rgba(0, 255, 0, 0.05)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'rgb(0, 255, 0)', marginBottom: '4px' }}>OVER (Above 6.4%)</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
                        {digitStats.percentages.slice(5, 10).filter(p => p > 6.4).length} Digits
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
                        {overTotal.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'rgb(255, 51, 51)', marginBottom: '4px' }}>UNDER (Below 6.4%) 📉</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace" }}>
                        7 - 8 + 9
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
                        {(100 - overTotal).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: AI Engine & Analytics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
                  {/* Key Digits Panel */}
                  <KeyDigitsPanel digits={keyDigits} />

                  {/* Trade Controls - compact view */}
                  <div style={{ padding: '16px', borderRadius: '8px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)', backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
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

              {/* Bottom full-width sections */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '8px' }}>
                {/* AI Engine Workflow */}
                <div style={{ gridColumn: 'span 1' }}>
                  <AIEngineWorkflow
                    currentStep={2}
                    entryPoint={4}
                    liveCursor={0}
                    confirmationDigit={3}
                    tradeStatus="EXECUTING"
                    confidence={84.4}
                  />
                </div>

                {/* Over/Under Gauge */}
                <div>
                  <OverUnderGauge underPercentage={underTotal} overPercentage={overTotal} />
                </div>

                {/* AI Endpoint Card */}
                <div>
                  <AIEndpointCard
                    underEndpoint={4}
                    underConfidence={84.4}
                    underStrongest={4}
                    underWeakest={2}
                    overEndpoint={6}
                    overConfidence={15.6}
                    overStrongest={6}
                    overWeakest={8}
                    activeDirection="UNDER"
                    recommendation="TAKE TRADE"
                  />
                </div>
              </div>

              {/* Digit Strength Chart */}
              <div style={{ marginTop: '8px' }}>
                <DigitStrengthChart percentages={digitStats.percentages} />
              </div>

              {/* Bottom spacer for footer */}
              <div style={{ height: '80px', flexShrink: 0 }} />
            </>
          )}
        </div>
      </div>

      {/* Fixed footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
        <Footer />
      </div>
    </main>
  );
}
