'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Play, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ActiveSymbol, DerivAccount, Tick } from '@deriv/core';
import type { ContractMode, TradeType } from '@/lib/types';

interface SmartTraderProps {
  symbols: ActiveSymbol[]; activeSymbol: ActiveSymbol | null; currentTick: Tick | null; isConnected: boolean;
  activeAccount: DerivAccount | null; selectSymbol: (symbol: string) => void; onRun: () => Promise<void>;
  isBuying: boolean; buyError: string | null; tradeType: TradeType; setTradeType: (type: TradeType) => void;
  contractMode: ContractMode; setContractMode: (mode: ContractMode) => void; stake: string; setStake: (value: string) => void;
  durationValue: number; setDurationValue: (value: number) => void; digitStats?: { percentages: number[]; counts: number[]; totalTicks: number };
  selectedDigit?: number; setSelectedDigit?: (digit: number) => void; lastDigit?: number | null;
}

const TYPE_OPTIONS: { label: string; value: TradeType }[] = [
  { label: 'Rise/Fall', value: 'only-up' }, { label: 'Matches/Diff', value: 'matches-differs' },
  { label: 'Even/Odd', value: 'even-odd' }, { label: 'Over/Under', value: 'over-under' },
  { label: '0/U Hedging', value: 'up-down-hedging' }, { label: 'Higher/Lower', value: 'over-under' },
  { label: 'Touch/No Touch', value: 'matches-differs' }, { label: 'High/Low', value: 'over-under' },
  { label: 'Ends In/Out', value: 'matches-differs' }, { label: 'Stay In/Out', value: 'matches-differs' },
];

export function SmartTrader({ symbols, activeSymbol, currentTick, isConnected, activeAccount, selectSymbol, onRun, isBuying, buyError, setTradeType, stake, setStake, durationValue, setDurationValue, digitStats, selectedDigit = 5, setSelectedDigit, lastDigit }: SmartTraderProps) {
  const [activeType, setActiveType] = useState<TradeType>('over-under');
  const [activeTypeLabel, setActiveTypeLabel] = useState('Over/Under');
  const [marketOpen, setMarketOpen] = useState(false);
  const [selectedThreshold, setSelectedThreshold] = useState(15);
  const markets = useMemo(() => symbols.filter(s => s.underlying_symbol).slice(0, 8), [symbols]);
  const selected = activeSymbol?.underlying_symbol_name || activeSymbol?.underlying_symbol || 'Volatility 75 Index';
  const price = currentTick?.quote ?? currentTick?.ask;
  const percentages = digitStats?.percentages?.length === 10 ? digitStats.percentages : Array(10).fill(10);
  const totalTicks = digitStats?.totalTicks ?? 0;
  const max = Math.max(...percentages, 1);
  const chooseType = (type: TradeType, label: string) => { setActiveType(type); setActiveTypeLabel(label); setTradeType(type); };
  const chooseDigit = (digit: number) => setSelectedDigit?.(digit);

  return <section className="min-h-dvh bg-[#202332] px-3 pb-5 pt-3 text-slate-100 sm:px-5">
    <div className="mx-auto grid max-w-[1540px] gap-3 xl:grid-cols-[minmax(300px,1.08fr)_minmax(420px,1.55fr)_minmax(300px,.9fr)]">
      <aside className="space-y-3">
        <Panel title="TRADE CONTRACT TYPE" right={<span className="text-xs text-emerald-300">Market: {selected}</span>}>
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-3"><div><p className="font-bold">{activeTypeLabel}</p><p className="mt-1 text-[11px] text-slate-400">Predict whether the last decimal digit follows the selected contract.</p></div><Settings2 className="text-slate-400" /></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{TYPE_OPTIONS.map(item => <button key={item.label} type="button" onClick={() => chooseType(item.value, item.label)} className={`rounded-lg border px-2 py-2 text-xs font-semibold ${activeTypeLabel === item.label ? 'border-rose-300 bg-rose-500 text-white' : 'border-slate-600 bg-slate-700/70 text-slate-200 hover:bg-slate-600'}`}>{item.label}</button>)}</div>
        </Panel>
        <Panel title="LAST DIGIT STATISTICS (PREDICTION SELECTOR)" right={<Badge>Prediction: Digit {selectedDigit}</Badge>}>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">{percentages.map((value, digit) => <button key={digit} type="button" onClick={() => chooseDigit(digit)} className={`rounded-lg border p-2 ${selectedDigit === digit ? 'border-rose-400 bg-rose-500/20' : 'border-slate-600 bg-slate-800'}`}><span className="text-[10px] font-bold text-emerald-300">{value.toFixed(0)}%</span><span className="my-2 block h-8 rounded bg-emerald-400/80" style={{ opacity: .35 + value / max * .65 }} /><strong>{digit}</strong></button>)}</div>
        </Panel>
        <Panel title="CONTINUOUS TRADING POOL" right={<span className="text-emerald-300">All Markets</span>}><div className="grid grid-cols-5 gap-2">{['1 Market','2 Markets','3 Markets','4 Markets','All'].map((x, i) => <button key={x} className={`rounded-md border px-2 py-2 text-xs ${i === 4 ? 'border-orange-300 bg-orange-400 text-slate-900' : 'border-slate-600 bg-slate-700'}`}>{x}</button>)}</div></Panel>
        <Panel title="LIVE TICK STREAM" right={<span>{selected}</span>}><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-slate-400"><tr><th>Time</th><th>Price</th><th>Last Digit</th><th>Side Digit</th></tr></thead><tbody><tr className="border-t border-slate-700"><td>{new Date().toLocaleTimeString()}</td><td>{price ? Number(price).toFixed(4) : '—'}</td><td className="text-rose-300">{lastDigit ?? '—'}</td><td className="text-sky-300">—</td></tr></tbody></table></div></Panel>
      </aside>
      <main className="space-y-3">
        <Panel title="HIGHEST PERCENTAGE DETECTED" right={<Badge>DUAL CONTINUOUS: TOP 1 + TOP 2</Badge>}><div className="grid gap-2 md:grid-cols-3">{[markets[0], markets[1], activeSymbol].map((market, i) => <div key={i} className="rounded-lg border border-slate-600 bg-slate-800/80 p-3"><div className="flex justify-between text-xs text-slate-400"><span>{i === 0 ? 'HIGHEST MARKET' : i === 1 ? '2ND HIGHEST' : 'SELECTED MARKET'}</span><span className="text-emerald-300">{(21 - i * 5).toFixed(1)}%</span></div><p className="mt-4 font-bold text-emerald-200">{market?.underlying_symbol_name || market?.underlying_symbol || selected}</p><p className="mt-2 text-xs text-slate-400">Cadence: 1 tick / sec</p><p className="mt-3 text-[11px] text-emerald-300">● {i === 2 ? 'ACTIVE SELECTED' : 'CONTINUOUS ACTIVE'}</p></div>)}</div></Panel>
        <div className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-emerald-200">〽 FASTER EXECUTION STANDBY — LISTENING FOR HIGHEST DIGIT FREQUENCY</div>
        <Panel title="TARGET DIGIT SELECTION" right={<strong>Digit: {selectedDigit}</strong>}><div className="grid grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: 10 }, (_, digit) => <button key={digit} type="button" onClick={() => chooseDigit(digit)} className={`rounded-md border py-2 font-bold ${selectedDigit === digit ? 'border-emerald-300 bg-emerald-400 text-slate-900' : 'border-slate-600 bg-slate-700'}`}>{digit}</button>)}</div><div className="mt-4 flex items-center justify-between text-xs font-bold"><span>MIN QUALIFYING THRESHOLD (%)</span><span className="text-emerald-300">{selectedThreshold}%</span></div><div className="mt-2 grid grid-cols-5 gap-2">{[12,14,15,18,20].map(x => <button key={x} onClick={() => setSelectedThreshold(x)} className={`rounded-md border py-2 text-xs ${x === selectedThreshold ? 'border-emerald-300 bg-emerald-400 text-slate-900' : 'border-slate-600 bg-slate-700'}`}>{x}%</button>)}</div></Panel>
        <Panel title="SYNTHETIC SCREENER (BOOM, CRASH, JUMP, VOLATILITIES)" right={<Badge>{markets.length} ≥ {selectedThreshold}%</Badge>}><div className="flex items-center justify-between text-sm text-slate-300"><span>Live connected synthetic markets</span><button className="rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-xs">Show All Synthetics <ChevronDown className="ml-2 inline size-3" /></button></div></Panel>
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]"><Panel title="DIGIT DISTRIBUTION (LAST 150 TICKS)" right={<span>Total: {totalTicks}</span>}><div className="flex h-36 items-end gap-2">{percentages.map((value, digit) => <div key={digit} className="flex flex-1 flex-col items-center gap-1 text-[10px]"><span>{value.toFixed(0)}%</span><div className={`w-full rounded-t ${digit === selectedDigit ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ height: `${Math.max(12, value / max * 100)}%` }} /><span>{digit}</span></div>)}</div><p className="mt-3 text-xs text-slate-400">Total Ticks: {totalTicks}</p></Panel><Panel title="PATTERN DETECTION"><p className="font-bold text-emerald-300">{totalTicks > 4 ? 'PATTERN MONITORING' : 'WAITING FOR DATA'}</p><p className="mt-3 text-sm">Latest digit: <strong>{lastDigit ?? '—'}</strong></p><p className="mt-4 text-xs text-slate-400">Confidence is calculated from the connected tick stream.</p></Panel></div>
      </main>
      <aside className="space-y-3"><Panel title="Summary" right={<ChevronDown />}><div className="flex gap-5 border-b border-slate-700 pb-3 text-sm"><button className="border-b-2 border-rose-400 pb-2">Summary</button><button className="text-slate-400">Transactions</button><button className="text-slate-400">Journal</button></div><div className="mt-4 flex gap-2"><Button variant="secondary">Download</Button><Button variant="secondary">View Detail</Button></div><div className="mt-5 rounded-lg border border-slate-700 bg-slate-800/70 p-4 text-sm"><p className="text-slate-400">Current contract</p><p className="mt-2 font-bold">{selected}</p><p className="mt-3 text-slate-400">Live entry spot</p><p className="font-bold">{price ? Number(price).toFixed(4) : '—'}</p></div><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><Metric label="Total stake" value={`${stake || '0'} USD`} /><Metric label="Number of runs" value="0" /><Metric label="Contracts won" value="0" /><Metric label="Total profit/loss" value="0.00 USD" /></div></Panel>
        <Panel title="CONTRACT DIRECTION CHOICE"><div className="grid grid-cols-3 gap-2">{['AUTO (SMART)','OVER','UNDER'].map(x => <button key={x} className={`rounded-md border px-2 py-2 text-xs font-bold ${x === 'AUTO (SMART)' ? 'border-emerald-300 bg-emerald-400 text-slate-900' : 'border-slate-600 bg-slate-700'}`}>{x}</button>)}</div></Panel>
        <Card className="border-slate-600 bg-slate-800/90"><CardContent className="p-3"><Button onClick={() => void onRun()} disabled={!isConnected || isBuying} className="h-16 w-full bg-emerald-400 text-xl font-bold text-slate-900 hover:bg-emerald-300"><Play className="mr-2 fill-current" />{isBuying ? 'Running' : 'Run'}</Button><div className="mt-3 flex justify-between text-xs"><span>Bot is not running</span><span>{isConnected ? 'CONNECTED' : 'OFFLINE'}</span></div>{buyError && <p className="mt-2 text-xs text-rose-300">{buyError}</p>}</CardContent></Card></aside>
    </div>
    <div className="sr-only"><label>Market</label><select value={activeSymbol?.underlying_symbol || ''} onChange={e => selectSymbol(e.target.value)}><option value="">{selected}</option>{markets.map(m => <option key={m.underlying_symbol} value={m.underlying_symbol}>{m.underlying_symbol_name}</option>)}</select><label>Market menu</label><button onClick={() => setMarketOpen(!marketOpen)}>Toggle</button><Input aria-label="Duration" value={durationValue} onChange={e => setDurationValue(Number(e.target.value))} /><Input aria-label="Stake" value={stake} onChange={e => setStake(e.target.value)} /></div>
  </section>;
}

function Panel({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) { return <Card className="border-slate-600 bg-[#2b2e40] shadow-lg"><CardContent className="p-3"><div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold tracking-wide"><span>{title}</span><span className="text-slate-300">{right}</span></div>{children}</CardContent></Card>; }
function Badge({ children }: { children: ReactNode }) { return <span className="rounded border border-emerald-700 bg-emerald-950/40 px-2 py-1 text-[10px] text-emerald-300">{children}</span>; }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }

export default SmartTrader;
