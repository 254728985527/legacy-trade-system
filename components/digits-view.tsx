'use client';

import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/custom/theme-toggle';
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

  // Helper to get digit color
  const getDigitColor = (digit: number, percentage: number) => {
    if (percentage === maxPct) return 'rgb(0, 255, 0)'; // Green for highest
    if (percentage === minPct) return 'rgb(255, 51, 51)'; // Red for lowest
    return 'rgb(180, 180, 180)'; // Gray for others
  };

  // Helper to get digit border
  const getDigitBorder = (digit: number, percentage: number) => {
    if (percentage === maxPct) return '2px solid rgb(0, 255, 0)';
    if (digit === lastDigit) return '2px solid rgb(0, 150, 255)'; // Blue for current
    return '2px solid rgb(51, 51, 51)';
  };

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
        <div style={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

              {/* Main Grid Layout - 4 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 0.8fr) minmax(300px, 1fr) minmax(300px, 1fr) minmax(280px, 0.9fr)', gap: '12px', gridAutoRows: 'auto' }}>
                
                {/* LEFT COLUMN - Sidebar panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Live Price */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      📊 LIVE PRICE
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', fontFamily: "'Courier New', monospace", marginBottom: '2px' }}>
                      {livePrice.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)', fontFamily: "'Courier New', monospace" }}>
                      {activeSymbol?.symbol || 'VOL 75 (1S) INDEX'}
                    </div>
                  </div>

                  {/* Volatility Index */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                      🎚️ VOLATILITY INDEX
                    </div>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid rgb(255, 215, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)', marginBottom: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'rgb(255, 215, 0)' }}>75</div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)', textAlign: 'center' }}>Vol 75 (1s) Index</div>
                  </div>

                  {/* Incoming Tick */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '6px', letterSpacing: '0.5px' }}>
                      📶 INCOMING TICK
                    </div>
                    <div style={{ fontSize: '14px', letterSpacing: '2px', color: 'rgb(255, 215, 0)', marginBottom: '8px' }}>⭐ ⭐ ⭐ ⭐ ⭐</div>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid rgb(255, 215, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'rgb(255, 215, 0)' }}>32</div>
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgb(180, 180, 180)', marginTop: '6px' }}>TICKS: 32/1000</div>
                  </div>

                  {/* Live Cursor Tracker */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 51, 51)', boxShadow: '0 0 12px rgba(255, 51, 51, 0.3)' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgb(255, 51, 51)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                      🎯 LIVE CURSOR TRACKER
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgb(0, 150, 255)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(0, 150, 255)', fontWeight: 'bold' }}>1</div>
                      <div style={{ fontSize: '16px', color: 'rgb(0, 255, 0)' }}>→</div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgb(0, 255, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(0, 255, 0)', fontWeight: 'bold' }}>4</div>
                      <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)', marginLeft: 'auto' }}>REMAINING<br/>3</div>
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgb(180, 180, 180)', marginBottom: '8px' }}>Next Positions:</div>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid rgb(51, 51, 51)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgb(180, 180, 180)' }}>
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MIDDLE-LEFT COLUMN - Digit 0-4 */}
                <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 12px rgba(0, 255, 0, 0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    🎯 DIGIT 0 TO 4
                  </div>

                  {/* Digit circles */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '12px' }}>
                    {[0, 1, 2, 3, 4].map((digit) => (
                      <div key={digit} onClick={() => setSelectedDigit(digit)} style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          border: getDigitBorder(digit, digitStats.percentages[digit]),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: getDigitColor(digit, digitStats.percentages[digit]),
                          boxShadow: `0 0 10px ${getDigitColor(digit, digitStats.percentages[digit])}40`,
                        }}>
                          {digit}
                        </div>
                        <div style={{ fontSize: '9px', color: getDigitColor(digit, digitStats.percentages[digit]), fontFamily: "'Courier New', monospace", fontWeight: '600' }}>
                          {digitStats.percentages[digit].toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Over/Under section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'rgba(0, 255, 0, 0.08)', borderRadius: '4px', border: '1px solid rgb(0, 255, 0)' }}>
                      <div style={{ fontSize: '9px', color: 'rgb(0, 255, 0)', fontWeight: '600', marginBottom: '4px' }}>OVER (Above 6.4%)</div>
                      <div style={{ fontSize: '10px', color: 'rgb(0, 255, 0)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>5 Digits</div>
                      <div style={{ fontSize: '14px', color: 'rgb(0, 255, 0)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>{underTotal.toFixed(1)}%</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: 'rgba(255, 51, 51, 0.08)', borderRadius: '4px', border: '1px solid rgb(255, 51, 51)' }}>
                      <div style={{ fontSize: '9px', color: 'rgb(255, 51, 51)', fontWeight: '600', marginBottom: '4px' }}>UNDER (Below 6.4%) 📉</div>
                      <div style={{ fontSize: '10px', color: 'rgb(255, 51, 51)', fontWeight: 'bold' }}>0 - 1 Digit</div>
                      <div style={{ fontSize: '14px', color: 'rgb(255, 51, 51)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>{(100 - underTotal).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* MIDDLE-RIGHT COLUMN - Digit 5-9 */}
                <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 12px rgba(0, 255, 0, 0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    🎯 DIGIT 5 TO 9
                  </div>

                  {/* Digit circles */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '12px' }}>
                    {[5, 6, 7, 8, 9].map((digit) => (
                      <div key={digit} onClick={() => setSelectedDigit(digit)} style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          border: getDigitBorder(digit, digitStats.percentages[digit]),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: getDigitColor(digit, digitStats.percentages[digit]),
                          boxShadow: `0 0 10px ${getDigitColor(digit, digitStats.percentages[digit])}40`,
                        }}>
                          {digit}
                        </div>
                        <div style={{ fontSize: '9px', color: getDigitColor(digit, digitStats.percentages[digit]), fontFamily: "'Courier New', monospace", fontWeight: '600' }}>
                          {digitStats.percentages[digit].toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Over/Under section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'rgba(0, 255, 0, 0.08)', borderRadius: '4px', border: '1px solid rgb(0, 255, 0)' }}>
                      <div style={{ fontSize: '9px', color: 'rgb(0, 255, 0)', fontWeight: '600', marginBottom: '4px' }}>OVER (Above 6.4%)</div>
                      <div style={{ fontSize: '10px', color: 'rgb(0, 255, 0)', fontWeight: 'bold' }}>5 Digits</div>
                      <div style={{ fontSize: '14px', color: 'rgb(0, 255, 0)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>{overTotal.toFixed(1)}%</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: 'rgba(255, 51, 51, 0.08)', borderRadius: '4px', border: '1px solid rgb(255, 51, 51)' }}>
                      <div style={{ fontSize: '9px', color: 'rgb(255, 51, 51)', fontWeight: '600', marginBottom: '4px' }}>UNDER (Below 6.4%) 📉</div>
                      <div style={{ fontSize: '10px', color: 'rgb(255, 51, 51)', fontWeight: 'bold' }}>7 - 8 + 9</div>
                      <div style={{ fontSize: '14px', color: 'rgb(255, 51, 51)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>{(100 - overTotal).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Trade Controls & Key Digits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Key Digits */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 12px rgba(0, 255, 0, 0.3)' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '10px', letterSpacing: '0.5px' }}>
                      👑 KEY DIGITS
                    </div>
                    {keyDigits.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: idx < 2 ? '1px solid rgb(51, 51, 51)' : 'none' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgb(255, 215, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', flexShrink: 0 }}>
                          {item.digit}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '9px', color: 'rgb(180, 180, 180)', fontWeight: '600' }}>{item.rank}</div>
                          <div style={{ fontSize: '12px', color: 'rgb(0, 255, 0)', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>{item.percentage.toFixed(1)}%</div>
                        </div>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgb(255, 215, 0)', padding: '2px 6px', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderRadius: '3px' }}>
                          TOP
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trade Controls */}
                  <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)', backgroundColor: 'rgba(255, 215, 0, 0.02)' }}>
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

              {/* Bottom section - full width */}
              <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* AI Engine Workflow */}
                <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(0, 255, 0)', boxShadow: '0 0 12px rgba(0, 255, 0, 0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgb(0, 255, 0)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    🧠 AI ENGINE UNDER (0 - 4)
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgb(180, 180, 180)', marginBottom: '12px' }}>AI ENDPOINT TO EXECUTION WORKFLOW</div>
                  
                  {/* Workflow steps */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                    {[
                      { num: 1, label: 'AI ENDPOINT', detail: 'AI recommends\ntrend: UNDER\n(0 - 4)' },
                      { num: 2, label: 'CURSOR TOUCHING', detail: 'Live cursor reaches\nthe entry digit' },
                      { num: 3, label: 'CONFIRMATION', detail: 'Engine checks next tick\nfor confirmation (0 - 4)' },
                      { num: 4, label: 'EXECUTION POINT', detail: 'All conditions met\nExecuting trade...' },
                      { num: 5, label: 'TRADE EXECUTED', detail: 'UNDER trade placed\nsuccessfully' },
                    ].map((step, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgb(0, 255, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', marginBottom: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
                          {step.num}
                        </div>
                        <div style={{ fontSize: '8px', color: 'rgb(0, 255, 0)', fontWeight: '600', textAlign: 'center', lineHeight: '1.2' }}>{step.label}</div>
                        {idx < 4 && <div style={{ fontSize: '16px', color: 'rgb(0, 255, 0)', margin: '2px 0' }}>→</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digit Strength Chart */}
                <div style={{ padding: '12px', borderRadius: '6px', border: '2px solid rgb(255, 215, 0)', boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgb(255, 215, 0)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    📊 DIGIT STRENGTH RANKING
                  </div>
                  
                  {/* Chart bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '4px' }}>
                    {digitStats.percentages.map((pct, idx) => {
                      const color = pct > 6.4 ? 'rgb(0, 255, 0)' : pct === minPct ? 'rgb(255, 51, 51)' : 'rgb(255, 215, 0)';
                      const height = Math.max(10, (pct / maxPct) * 100);
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: '100%', height: `${height}%`, backgroundColor: color, borderRadius: '3px 3px 0 0', boxShadow: `0 0 8px ${color}60` }} />
                          <div style={{ fontSize: '9px', color: 'rgb(180, 180, 180)', marginTop: '4px' }}>{idx}</div>
                          <div style={{ fontSize: '8px', color: 'rgb(180, 180, 180)', fontFamily: "'Courier New', monospace" }}>{pct.toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '9px', paddingTop: '8px', borderTop: '1px solid rgb(51, 51, 51)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(0, 255, 0)', borderRadius: '2px' }} />
                      <span style={{ color: 'rgb(0, 255, 0)' }}>STRONG (&gt;6.4%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(255, 215, 0)', borderRadius: '2px' }} />
                      <span style={{ color: 'rgb(255, 215, 0)' }}>NEUTRAL (=6.4%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(255, 51, 51)', borderRadius: '2px' }} />
                      <span style={{ color: 'rgb(255, 51, 51)' }}>WEAK (&lt;6.4%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom spacer for footer */}
              <div style={{ height: '100px', flexShrink: 0 }} />
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
