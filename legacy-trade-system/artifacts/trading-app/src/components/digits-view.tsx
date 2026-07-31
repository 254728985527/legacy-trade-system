import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { CandlestickChart, buildCandles } from './candlestick-chart';
import { getLastDigit } from '@/lib/digit-stats';
import { LDPSection } from './ldp-section';
import { TrendSection } from './trend-section';
import { VolSection } from './vol-section';
import { SignalOverlay } from './signal-overlay';
import { Footer } from '@/components/custom/footer';
import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  Tick,
  ProposalInfo,
  DurationLimits,
  BuyResult,
} from '@deriv/core';
import type { ContractMode, TradeType, DigitStats, ClosedPosition } from '../lib/types';

const TRADE_TABS: { value: TradeType; short: string }[] = [
  { value: 'over-under',      short: 'O/U'  },
  { value: 'even-odd',        short: 'E/O'  },
  { value: 'matches-differs', short: 'M/D'  },
  { value: 'rise-fall',       short: 'R/F'  },
];

const CONTRACT_LABELS: Record<TradeType, [string, string]> = {
  'over-under':      ['Over',    'Under'],
  'even-odd':        ['Even',    'Odd'],
  'matches-differs': ['Match',   'Differ'],
  'rise-fall':       ['Rise',    'Fall'],
};

const CONTRACT_MODES: Record<TradeType, [ContractMode, ContractMode]> = {
  'over-under':      ['DIGITOVER',   'DIGITUNDER'],
  'even-odd':        ['DIGITEVEN',   'DIGITODD'],
  'matches-differs': ['DIGITMATCH',  'DIGITDIFF'],
  'rise-fall':       ['CALL',        'PUT'],
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function WsStatusBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded text-[0.6rem] font-bold uppercase"
      style={{
        background: isConnected ? 'var(--green-dim)' : 'var(--red-dim)',
        color: isConnected ? 'var(--green)' : 'var(--red)',
        border: `1px solid ${isConnected ? 'var(--green)' : 'var(--red)'}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isConnected ? 'var(--green)' : 'var(--red)' }} />
      {isConnected ? 'Live' : 'Offline'}
    </div>
  );
}

function MobileHeader({
  authState, accounts, activeAccount, onLogin, onLogout, onSwitchAccount, isConnected, liveBalances,
}: {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (id: string) => Promise<void>;
  isConnected: boolean;
  liveBalances: Record<string, string>;
}) {
  const [acctOpen, setAcctOpen] = useState(false);
  const isAuth = authState === 'authenticated';
  const rawBal = activeAccount
    ? (liveBalances[activeAccount.account_id] ?? activeAccount.balance)
    : null;
  const balance = rawBal
    ? Number(rawBal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '--';
  const initials = (import.meta.env.VITE_DERIV_APP_NAME ?? 'DT').slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-3.5 py-2.5"
      style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}
    >
      <div className="relative flex items-center gap-2.5">
        <button
          onClick={() => isAuth && setAcctOpen(o => !o)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black text-white"
          style={{ background: 'linear-gradient(135deg, var(--red), #da3633)' }}
        >
          {initials}
        </button>
        {isAuth && activeAccount ? (
          <div>
            <div className="text-[0.65rem] font-bold uppercase" style={{ color: activeAccount.account_type === 'demo' ? 'var(--gold)' : 'var(--green)' }}>
              {activeAccount.account_type === 'demo' ? 'Demo' : 'Real'}
            </div>
            <div className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
              {balance} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.65rem' }}>{activeAccount.currency}</span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            {authState === 'authenticating' ? 'Connecting…' : 'Not logged in'}
          </div>
        )}
        {acctOpen && accounts.length > 1 && (
          <div
            className="absolute top-full left-0 mt-1 rounded-lg shadow-xl overflow-hidden z-50 animate-slide-down min-w-[180px]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)' }}
          >
            {accounts.map(acc => (
              <button
                key={acc.account_id}
                className="w-full text-left px-3 py-2.5 flex flex-col gap-0.5 transition-colors"
                style={{ borderBottom: '1px solid var(--border-col)' }}
                onClick={() => { onSwitchAccount(acc.account_id); setAcctOpen(false); }}
              >
                <span className="text-[0.65rem] font-bold uppercase" style={{ color: acc.account_type === 'demo' ? 'var(--gold)' : 'var(--green)' }}>
                  {acc.account_type === 'demo' ? 'Demo' : 'Real'} · {acc.account_id}
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {Number(liveBalances[acc.account_id] ?? acc.balance).toFixed(2)} {acc.currency}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <WsStatusBadge isConnected={isConnected} />
        {isAuth ? (
          <button
            className="text-xs px-3 py-1.5 rounded font-bold"
            style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)' }}
            onClick={onLogout}
          >
            Exit
          </button>
        ) : (
          <button
            className="text-xs px-3 py-1.5 rounded font-bold"
            style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid var(--blue)' }}
            onClick={onLogin}
            disabled={authState === 'authenticating'}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

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
  prices: number[];
  tradeType: TradeType;
  setTradeType: (type: TradeType) => void;
  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;
  selectedDigit: number;
  setSelectedDigit: (digit: number) => void;
  stake: string;
  setStake: (value: string) => void;
  martingale: string;
  setMartingale: (v: string) => void;
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
  closedPositions: ClosedPosition[];
  liveBalances?: Record<string, string>;
  logoSrc?: string;
  appName?: string;
}

export function DigitsView({
  authState, accounts, activeAccount, onLogin, onLogout, onSwitchAccount,
  isConnected, isLoading, error,
  symbols, activeSymbol, selectSymbol,
  currentTick, lastDigit, digitStats, pipSize, prices,
  tradeType, setTradeType, contractMode, setContractMode,
  selectedDigit, setSelectedDigit,
  stake, setStake, martingale, setMartingale,
  duration, setDuration, durationLimits,
  proposal, isProposalLoading, buyContract, isBuying,
  buyResult, buyError, clearBuyResult,
  closedPositions,
  liveBalances = {},
}: DigitsViewProps) {
  const [autoRunning, setAutoRunning] = useState(false);
  const [showSignal, setShowSignal] = useState(false);
  const [signalDigit, setSignalDigit] = useState<number | null>(null);
  const [showEvenOdd, setShowEvenOdd] = useState(false);
  const [evenOddSignal, setEvenOddSignal] = useState<'even' | 'odd' | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [autoSwitchVol, setAutoSwitchVol] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const candles = useMemo(() => buildCandles(prices, 60), [prices]);
  const recentDigits = useMemo(
    () => prices.slice(-10).map(p => getLastDigit(p, pipSize)),
    [prices, pipSize]
  );
  const candleDirections = useMemo(
    () => candles.filter(c => c.isComplete).slice(-3).map(c => (c.close >= c.open ? 'up' : 'down') as 'up' | 'down'),
    [candles]
  );

  const modes = CONTRACT_MODES[tradeType];
  const labels = CONTRACT_LABELS[tradeType];
  const needsBarrier = tradeType !== 'even-odd' && tradeType !== 'rise-fall';

  useEffect(() => {
    if (buyError) { toast.error('Purchase failed', { description: buyError }); clearBuyResult(); }
  }, [buyError, clearBuyResult]);

  useEffect(() => {
    if (buyResult) {
      toast.success('Contract purchased!', {
        description: `Buy: ${buyResult.buyPrice.toFixed(2)} · Payout: ${buyResult.payout.toFixed(2)} USD`,
      });
      clearBuyResult();
    }
  }, [buyResult, clearBuyResult]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = null;
    setAutoRunning(false);
  }, []);

  const toggleAuto = useCallback(() => {
    if (autoRunning) { stopAuto(); toast.info('Auto trading stopped'); return; }
    if (authState !== 'authenticated') { toast.warning('Please log in first'); onLogin(); return; }
    setAutoRunning(true);
    toast.success('Auto trading started');
    autoRef.current = setInterval(() => { buyContract(); }, 2200);
  }, [autoRunning, authState, buyContract, onLogin, stopAuto]);

  useEffect(() => { if (!isConnected && autoRunning) stopAuto(); }, [isConnected, autoRunning, stopAuto]);
  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current); }, []);

  useEffect(() => {
    if (digitStats.totalTicks < 20) return;
    const pcts = digitStats.percentages;
    const minPct = Math.min(...pcts);
    const minDigit = pcts.indexOf(minPct);
    if (10 - minPct > 4.5) { setSignalDigit(minDigit); setShowSignal(true); }
  }, [digitStats]);

  const priceStr = currentTick ? currentTick.quote.toFixed(pipSize) : null;
  const priceWithoutLast = priceStr ? priceStr.slice(0, -1) : null;
  const lastDigitChar = priceStr ? priceStr.slice(-1) : null;

  const totalPL = (closedPositions ?? []).reduce((sum, p) => sum + (p.sell_price - p.buy_price), 0);
  const plColor = totalPL > 0 ? 'var(--green)' : totalPL < 0 ? 'var(--red)' : 'var(--text-secondary)';

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-dvh px-4">
        <div className="rounded-xl p-6 text-center max-w-xs" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-col)' }}>
          <div className="text-2xl mb-3">⚠️</div>
          <div className="font-bold mb-1">Connection Error</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-dvh max-w-md mx-auto" style={{ background: 'var(--bg-deep)' }}>
      <MobileHeader
        authState={authState} accounts={accounts} activeAccount={activeAccount}
        onLogin={onLogin} onLogout={onLogout} onSwitchAccount={onSwitchAccount}
        isConnected={isConnected} liveBalances={liveBalances}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {[80, 180, 60, 60, 120].map((h, i) => (
            <div key={i} className="rounded-lg animate-pulse" style={{ height: h, background: 'var(--bg-card)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Vol selector */}
          <VolSection symbols={symbols} activeSymbol={activeSymbol} onSymbolChange={selectSymbol} />

          {/* LDP */}
          <LDPSection
            digitStats={digitStats}
            selectedDigit={selectedDigit}
            onDigitSelect={setSelectedDigit}
            recentDigits={recentDigits}
            candleDirections={candleDirections}
            onEvenOddSignal={(sig) => { setEvenOddSignal(sig); setShowEvenOdd(true); }}
          />

          {/* Chart */}
          <div className="relative" style={{ height: 160, background: 'var(--bg-deep)', borderBottom: '1px solid var(--border-col)' }}>
            <CandlestickChart prices={prices} pipSize={pipSize} height={160} />
            {priceStr && (
              <div className="absolute left-2 top-2 flex items-baseline gap-0.5 pointer-events-none">
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)', textShadow: '0 1px 4px #070b14' }}>{priceWithoutLast}</span>
                <span className="text-lg font-mono font-black" style={{ color: 'var(--blue)', textShadow: '0 1px 6px #070b14' }}>{lastDigitChar}</span>
              </div>
            )}
            {candles.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
                {isConnected ? 'Building candles…' : 'Connecting…'}
              </div>
            )}
            <SignalOverlay visible={showSignal} digit={signalDigit} onDismiss={() => setShowSignal(false)} />
            <SignalOverlay
              visible={showEvenOdd}
              onDismiss={() => setShowEvenOdd(false)}
              signalType="even-odd"
              evenOddSignal={evenOddSignal}
            />
          </div>

          {/* Trend */}
          <TrendSection prices={prices} />

          {/* Contract type */}
          <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
            <div className="flex overflow-x-auto px-3.5 pt-2.5 gap-1.5">
              {TRADE_TABS.map(tab => {
                const active = tradeType === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setTradeType(tab.value)}
                    className="shrink-0 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: active ? 'var(--bg-card)' : 'transparent',
                      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                      border: active ? '1px solid var(--border-light)' : '1px solid transparent',
                    }}
                  >
                    {tab.short}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 px-3.5 py-2.5">
              {modes.map((mode, idx) => {
                const active = contractMode === mode;
                const col = idx === 0 ? 'var(--green)' : 'var(--red)';
                return (
                  <button
                    key={mode}
                    onClick={() => setContractMode(mode)}
                    className="flex-1 py-2.5 rounded text-sm font-bold transition-all"
                    style={{
                      background: active ? col : 'var(--bg-card)',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${active ? col : 'var(--border-col)'}`,
                      boxShadow: active ? `0 0 12px ${idx === 0 ? 'var(--green-dim)' : 'var(--red-dim)'}` : 'none',
                    }}
                  >
                    {labels[idx]}
                  </button>
                );
              })}
            </div>

            {/* Barrier grid */}
            {needsBarrier && (
              <div className="px-3.5 pb-3">
                <div className="text-[0.65rem] uppercase tracking-wider mb-2 font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Prediction Barrier (0–9)
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {DIGITS.map(d => {
                    const pct = digitStats.percentages[d];
                    const isSelected = d === selectedDigit;
                    const maxPct = Math.max(...digitStats.percentages);
                    const minPct = Math.min(...digitStats.percentages);
                    const isHot = digitStats.totalTicks > 0 && pct === maxPct;
                    const isCold = digitStats.totalTicks > 0 && pct === minPct;
                    return (
                      <button
                        key={d}
                        onClick={() => setSelectedDigit(d)}
                        className="flex flex-col items-center py-2.5 rounded transition-all"
                        style={{
                          background: isSelected ? 'var(--blue)' : 'var(--bg-card)',
                          border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border-col)'}`,
                          boxShadow: isSelected ? '0 0 10px var(--blue-dim)' : 'none',
                        }}
                      >
                        <span className="text-sm font-black" style={{ color: isSelected ? '#fff' : 'var(--text-primary)' }}>{d}</span>
                        {digitStats.totalTicks > 0 && (
                          <span className="text-[0.55rem] font-bold mt-0.5" style={{
                            color: isHot ? 'var(--green)' : isCold ? 'var(--red)' : 'var(--text-muted)',
                          }}>
                            {pct.toFixed(1)}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="px-3.5 py-3" style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center justify-between rounded px-3 py-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)' }}>
                <label className="text-[0.65rem] font-bold uppercase" style={{ color: 'var(--gold)' }}>STAKE</label>
                <input
                  type="number" value={stake} onChange={e => setStake(e.target.value)}
                  min={0} step="0.01"
                  className="w-14 bg-transparent text-right font-black text-sm outline-none"
                  style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
              <div className="flex items-center justify-between rounded px-3 py-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)' }}>
                <label className="text-[0.65rem] font-bold uppercase" style={{ color: 'var(--gold)' }}>Martingale</label>
                <input
                  type="number" value={martingale} onChange={e => setMartingale(e.target.value)}
                  min={1} max={5} step="0.1"
                  className="w-10 bg-transparent text-right font-black text-sm outline-none"
                  style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded px-3 py-2 mb-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)' }}>
              <label className="text-[0.65rem] font-bold uppercase" style={{ color: 'var(--gold)' }}>Duration (Ticks)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setDuration(Math.max(durationLimits.min, duration - 1))}
                  className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>−</button>
                <span className="font-black text-sm w-6 text-center" style={{ color: 'var(--text-primary)' }}>{duration}</span>
                <button onClick={() => setDuration(Math.min(durationLimits.max, duration + 1))}
                  className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>+</button>
              </div>
            </div>

            {(proposal || isProposalLoading) && (
              <div className="rounded px-3 py-2 flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)' }}>
                <div>
                  <div className="text-[0.65rem] uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>Prediction</div>
                  <div className="text-xs mt-0.5">
                    {tradeType === 'rise-fall'
                      ? `Price will ${contractMode === 'CALL' ? 'Rise' : 'Fall'}`
                      : `Last digit will ${contractMode.replace('DIGIT', '').toLowerCase()}${needsBarrier ? ` ${selectedDigit}` : ''}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[0.65rem] uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>Payout</div>
                  {isProposalLoading
                    ? <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>…</div>
                    : <div className="text-sm font-black mt-0.5" style={{ color: 'var(--green)' }}>{proposal!.payout.toFixed(2)} USD</div>}
                </div>
              </div>
            )}
          </div>

          {/* Auto Switch Vol toggle */}
          <div className="flex items-center justify-between px-3.5 py-2.5" style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
            <span className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Auto Switch Vol</span>
            <button
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{ background: autoSwitchVol ? 'var(--blue)' : 'var(--bg-card)', border: `1px solid ${autoSwitchVol ? 'var(--blue)' : 'var(--border-col)'}` }}
              onClick={() => setAutoSwitchVol(v => !v)}
            >
              <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: '#fff', left: autoSwitchVol ? 'calc(100% - 1.1rem)' : '2px' }} />
            </button>
          </div>

          {/* Action buttons — sticky so they stay visible while scrolling */}
          <div className="sticky bottom-0 z-20 flex gap-2 px-3.5 py-3" style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border-col)', borderBottom: '1px solid var(--border-col)' }}>
            <button
              className="flex-1 py-3.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,var(--green),#2ea043)', color: '#fff', boxShadow: '0 4px 12px var(--green-dim)' }}
              disabled={!isConnected || !proposal || isBuying || autoRunning}
              onClick={buyContract}
            >
              {isBuying ? 'Buying…' : proposal ? `Buy @ ${proposal.askPrice.toFixed(2)}` : 'Buy'}
            </button>
            <button
              className="flex-1 py-3.5 rounded-lg text-sm font-black uppercase tracking-wider transition-all"
              style={{
                background: autoRunning ? 'linear-gradient(135deg,var(--red),#b91c1c)' : 'var(--bg-card)',
                color: autoRunning ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${autoRunning ? 'var(--red)' : 'var(--border-col)'}`,
                boxShadow: autoRunning ? '0 4px 12px var(--red-dim)' : 'none',
              }}
              onClick={toggleAuto}
            >
              {autoRunning ? 'Stop' : 'Run Auto'}
            </button>
          </div>

          {/* Transaction History */}
          <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
            <div className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer" onClick={() => setHistoryOpen(o => !o)}>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Transaction History</span>
              <div className="flex items-center gap-3">
                {(closedPositions ?? []).length > 0 && (
                  <span className="text-xs font-bold" style={{ color: plColor }}>
                    P/L: {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(2)}
                  </span>
                )}
                <span className="text-xs inline-block transition-transform duration-300" style={{ color: 'var(--text-muted)', transform: historyOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
              </div>
            </div>
            {historyOpen && (
              <div className="animate-slide-down overflow-x-auto">
                {(closedPositions ?? []).length === 0 ? (
                  <div className="px-3.5 pb-3 text-xs" style={{ color: 'var(--text-muted)' }}>No closed positions yet.</div>
                ) : (
                  <table className="w-full text-[0.65rem]">
                    <thead>
                      <tr style={{ background: 'var(--bg-deep)' }}>
                        {['Cont.', 'Vol', 'Entry', 'Exit', 'Stake', 'P/L'].map(h => (
                          <th key={h} className="px-2 py-1.5 text-left font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(closedPositions ?? []).slice(0, 30).map((pos, i) => {
                        const pl = (pos.sell_price ?? 0) - (pos.buy_price ?? 0);
                        const plC = pl >= 0 ? 'var(--green)' : 'var(--red)';
                        return (
                          <tr key={pos.contract_id ?? i} style={{ borderBottom: '1px solid var(--border-col)' }}>
                            <td className="px-2 py-2" style={{ color: 'var(--text-secondary)' }}>{pos.shortcode?.split('_')[0] ?? '–'}</td>
                            <td className="px-2 py-2 truncate max-w-[60px]" style={{ color: 'var(--text-secondary)' }}>{pos.underlying_symbol ?? '–'}</td>
                            <td className="px-2 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{pos.buy_price?.toFixed(2) ?? '–'}</td>
                            <td className="px-2 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{pos.sell_price?.toFixed(2) ?? '–'}</td>
                            <td className="px-2 py-2" style={{ color: 'var(--text-secondary)' }}>{pos.buy_price?.toFixed(2) ?? '–'}</td>
                            <td className="px-2 py-2 font-bold" style={{ color: plC }}>{pl >= 0 ? '+' : ''}{pl.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <div className="py-3 text-center">
            <Footer />
          </div>
        </>
      )}
    </main>
  );
}
