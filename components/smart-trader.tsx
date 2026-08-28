'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ActiveSymbol, DerivAccount, Tick } from '@deriv/core';
import type { ContractMode, TradeType } from '@/lib/types';
import { SYMBOL_DISPLAY_NAMES } from '@/lib/active-symbols-display-names';

interface SmartTraderProps {
  symbols: ActiveSymbol[]; activeSymbol: ActiveSymbol | null; currentTick: Tick | null; isConnected: boolean;
  activeAccount: DerivAccount | null; selectSymbol: (symbol: string) => void; onRun: () => Promise<void>;
  isBuying: boolean; buyError: string | null; tradeType: TradeType; setTradeType: (type: TradeType) => void;
  contractMode: ContractMode; setContractMode: (mode: ContractMode) => void; stake: string; setStake: (value: string) => void;
  durationValue: number; setDurationValue: (value: number) => void; digitStats?: { percentages: number[]; counts: number[]; totalTicks: number };
  selectedDigit?: number; setSelectedDigit?: (digit: number) => void; lastDigit?: number | null;
}

const TYPES: { label: string; value: TradeType; contract: ContractMode }[] = [
  { label: 'Rise/Fall', value: 'only-up', contract: 'CALL' },
  { label: 'Only Up', value: 'only-up', contract: 'CALL' },
  { label: 'Only Down', value: 'only-down', contract: 'PUT' },
  { label: 'Up + Down Hedging', value: 'up-down-hedging', contract: 'CALL' },
  { label: 'Over / Under', value: 'over-under', contract: 'DIGITOVER' },
  { label: 'Matches / Differs', value: 'matches-differs', contract: 'DIGITMATCH' },
  { label: 'Even / Odd', value: 'even-odd', contract: 'DIGITEVEN' },
];

export function SmartTrader({ symbols, activeSymbol, currentTick, isConnected, activeAccount, selectSymbol, onRun, isBuying, buyError, tradeType, setTradeType, setContractMode, stake, setStake, durationValue, setDurationValue, digitStats, selectedDigit = 5, setSelectedDigit, lastDigit }: SmartTraderProps) {
  const [typeOpen, setTypeOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [selectedTypeLabel, setSelectedTypeLabel] = useState('Rise/Fall');
  const [durationUnit, setDurationUnit] = useState('ticks');
  const [stakeTwo, setStakeTwo] = useState(stake || '10');
  const [allowEquals, setAllowEquals] = useState(false);
  const [martingale, setMartingale] = useState('2.1');
  const [stopLoss, setStopLoss] = useState('50');
  const [takeProfit, setTakeProfit] = useState('100');
  const markets = useMemo(() => symbols.filter(s => s.underlying_symbol), [symbols]);
  const marketGroups = useMemo(() => {
    const fallbackCodes = ['R_10','R_25','R_50','R_75','R_100','1HZ10V','1HZ25V','1HZ50V','1HZ75V','1HZ100V','1HZ150V','1HZ200V','1HZ250V','1HZ300V','BOOM250','BOOM300N','BOOM500','BOOM600','BOOM900','BOOM1000','CRASH250','CRASH300N','CRASH500','CRASH600','CRASH900','CRASH1000','JD10','JD25','JD50','JD75','JD100','JD200','JD300','stpRNG','stpRNG2','stpRNG3','stpRNG4','stpRNG5','RDBEAR','RDBULL','RDBEAR10','RDBULL10','RDBEAR25','RDBULL25'];
    const liveByCode = new Map(markets.map(symbol => [symbol.underlying_symbol, symbol]));
    const options = fallbackCodes.map(code => liveByCode.get(code) || ({ underlying_symbol: code, underlying_symbol_name: SYMBOL_DISPLAY_NAMES[code] || code } as ActiveSymbol));
    const groups: Record<string, ActiveSymbol[]> = { 'Volatility Indices': [], 'Boom & Crash': [], 'Jump Indices': [], 'Step Indices': [], 'Daily Reset Indices': [], 'Other Synthetic': [] };
    options.forEach(symbol => {
      const name = `${symbol.underlying_symbol_name || ''} ${symbol.underlying_symbol || ''}`.toLowerCase();
      const group = name.includes('volatility') ? 'Volatility Indices' : name.includes('boom') || name.includes('crash') ? 'Boom & Crash' : name.includes('jump') ? 'Jump Indices' : name.includes('step') ? 'Step Indices' : name.includes('daily') || name.includes('reset') || name.includes('bear market') || name.includes('bull market') ? 'Daily Reset Indices' : 'Other Synthetic';
      groups[group].push(symbol);
    });
    return Object.entries(groups).filter(([, items]) => items.length);
  }, [markets]);
  const selected = activeSymbol?.underlying_symbol_name || activeSymbol?.underlying_symbol || 'Volatility 100 (1s) Index';
  const price = currentTick?.quote ?? currentTick?.ask;
  const percentages = digitStats?.percentages?.length === 10 ? digitStats.percentages : Array(10).fill(10);
  const payout = (Number(stake || 0) * 1.923).toFixed(2);
  useEffect(() => {
    if (tradeType === 'matches-differs') {
      setTradeType('only-up');
      setContractMode('CALL');
    }
  }, [tradeType, setTradeType, setContractMode]);
  const chooseType = (item: typeof TYPES[number]) => { setSelectedTypeLabel(item.label); setTradeType(item.value); setContractMode(item.contract); setTypeOpen(false); };

  return <section className="min-h-dvh bg-[#f6f7f9] text-[#30343b]">
    <div className="min-h-dvh">
      <main className="w-full px-4 py-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative"><SelectBox label="Market" value={selected} onClick={() => { setMarketOpen(!marketOpen); setTypeOpen(false); }} />{marketOpen && <div className="absolute left-0 top-full z-30 mt-2 max-h-[min(70vh,520px)] w-[min(360px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-[#e2e5ea] bg-white p-2 shadow-2xl">{marketGroups.length ? marketGroups.map(([group, items]) => <div key={group} className="mb-2 last:mb-0"><div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#7a8491]">{group}</div>{items.map(m => <button type="button" key={m.underlying_symbol} onClick={() => { selectSymbol(m.underlying_symbol); setMarketOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f1f4f8] ${m.underlying_symbol === activeSymbol?.underlying_symbol ? 'bg-[#eefaf6] font-semibold text-[#008d6b]' : 'text-[#30343b]'}`}>{m.underlying_symbol_name || m.underlying_symbol}</button>)}</div>) : <div className="px-3 py-4 text-sm text-muted-foreground">Loading synthetic markets…</div>}</div>}</div>
              <div className="relative"><SelectBox label="Trade types" value={selectedTypeLabel} onClick={() => setTypeOpen(!typeOpen)}><span>{selectedTypeLabel}</span></SelectBox>{typeOpen && <div className="absolute z-10 mt-2 w-64 rounded-xl border border-[#e2e5ea] bg-white p-2 shadow-xl">{TYPES.map(item => <button key={item.label} onClick={() => chooseType(item)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f1f4f8]">{item.label}</button>)}</div>}</div>
            </div>
            <div className="flex items-center gap-4"><div><div className="text-xs text-muted-foreground">Live quote</div><div className="rounded-md bg-[#00ad84] px-3 py-1 text-lg font-bold text-white">{price ? Number(price).toFixed(2) : '—'}</div></div><div className="text-right"><div className="flex items-center gap-2 text-sm text-[#ec941d]">Demo account <ChevronDown /></div><strong>{activeAccount?.balance ? `${Number(activeAccount.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${activeAccount.currency || 'USD'}` : '—'}</strong></div><Button className="rounded-full bg-[#f53145] px-5 hover:bg-[#db2035]">Deposit</Button></div>
          </header>
          <div className="grid gap-5 lg:grid-cols-2">
            <TradeCard title="Rise" arrow="↗" tone="up" stake={stake} payout={payout} onStake={setStake} onRun={onRun} disabled={!isConnected || isBuying} />
            <TradeCard title="Fall" arrow="↘" tone="down" stake={stakeTwo} payout={(Number(stakeTwo || 0) * 1.923).toFixed(2)} onStake={setStakeTwo} onRun={onRun} disabled={!isConnected || isBuying} />
          </div>
          <div className="mx-auto mt-5 flex max-w-[560px] flex-wrap justify-center gap-3"><SelectBox label="Duration" value=""><Input aria-label="Duration" type="number" value={durationValue} onChange={e => setDurationValue(Number(e.target.value))} className="h-7 border-0 bg-transparent p-0 text-base text-[#30343b] shadow-none" /></SelectBox><SelectBox label="Unit" value="" onClick={() => setDurationUnit(durationUnit === 'ticks' ? 'seconds' : 'ticks')}><span>{durationUnit}</span></SelectBox></div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2"><StakeField label="Stake 1" value={stake} onChange={setStake} /><StakeField label="Stake 2" value={stakeTwo} onChange={setStakeTwo} /></div>
          <label className="mx-auto mt-4 flex w-fit items-center gap-2 text-sm"><input type="checkbox" checked={allowEquals} onChange={e => setAllowEquals(e.target.checked)} /> Allow equals <Circle className="size-4 text-muted-foreground" /></label>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 border-b border-[#c9ccd1] pb-4 text-sm font-semibold"><RiskField label="Martingale" value={martingale} setValue={setMartingale} /><RiskField label="Stop Loss" value={stopLoss} setValue={setStopLoss} /><RiskField label="Take Profit" value={takeProfit} setValue={setTakeProfit} /></div>
          <div className="mt-4 flex items-center overflow-hidden rounded-lg border-8 border-[#20232b] bg-white shadow-lg"><Button onClick={() => void onRun()} disabled={!isConnected || isBuying} className="h-16 rounded-none bg-[#00b889] px-7 text-xl font-bold hover:bg-[#009f78]"><Play className="mr-2 fill-current" />{isBuying ? 'Running' : 'Run'}</Button><div className="flex-1 px-6"><div className="text-xs text-muted-foreground">Execution</div><strong>FAST</strong>{buyError && <div className="text-xs text-destructive">{buyError}</div>}</div><div className={`mr-4 size-7 rounded-full p-1 ${isConnected ? 'bg-[#00b889]' : 'bg-muted'}`}><div className="size-5 rounded-full bg-white" /></div></div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[#e4e7eb] bg-white p-3"><span className="mr-2 text-sm font-semibold">Prediction digit</span>{percentages.map((value, digit) => <button key={digit} onClick={() => setSelectedDigit?.(digit)} className={`grid size-9 place-items-center rounded-md border text-sm font-bold ${selectedDigit === digit ? 'border-[#f14c5b] bg-[#fff0f1] text-[#dd3445]' : 'border-[#e3e6eb] bg-[#fafbfc]'}`} title={`${value.toFixed(0)}% frequency`}>{digit}</button>)}<span className="text-xs text-muted-foreground">Last: {lastDigit ?? '—'}</span></div>
        </div>
      </main>
    </div>
  </section>;
}

function SelectBox({ label, value, children, onClick }: { label: string; value: string; children?: ReactNode; onClick?: () => void }) { return <button type="button" onClick={onClick} className="min-w-40 rounded-xl border border-[#e2e5ea] bg-white px-4 py-2 text-left shadow-sm"><span className="block text-xs text-muted-foreground">{label}</span><span className="flex items-center justify-between gap-3">{children}<ChevronDown className="size-4 shrink-0" /></span></button>; }
function TradeCard({ title, arrow, tone, stake, payout, onStake, onRun, disabled }: { title: string; arrow: string; tone: 'up' | 'down'; stake: string; payout: string; onStake: (value: string) => void; onRun: () => Promise<void>; disabled: boolean }) { return <Card className="overflow-hidden rounded-2xl border-[#e7e9ed] bg-white shadow-sm"><CardContent className="p-0"><div className="grid min-h-[140px] grid-cols-[90px_1fr_1fr] items-center gap-3 px-7 py-6"><div className={`text-4xl ${tone === 'up' ? 'text-[#ff344c]' : 'text-[#ff344c]'}`}>{arrow}<div className="mt-2 text-lg font-bold text-[#30343b]">{title}</div></div><Stat label="Stake" value={`${stake || '0.00'} USD`} /><Stat label="Payout" value={`${payout} USD`} /></div><div className="flex min-h-[72px] items-center gap-3 border-t border-[#edf0f3] bg-[#fafbfc] px-7 py-3"><Input aria-label={`${title} stake`} value={stake} onChange={e => onStake(e.target.value)} className="max-w-32 bg-white" /><Button onClick={() => void onRun()} disabled={disabled} className={`flex-1 ${tone === 'up' ? 'bg-[#06b889] hover:bg-[#009f78]' : 'bg-[#ec0936] hover:bg-[#cf0630]'}`}>Purchase</Button></div><div className="bg-[#f0f1f3] py-2 text-center text-xs">Net profit: {(Number(stake || 0) * .923).toFixed(2)} USD | Return 92.3%</div></CardContent></Card>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="text-center"><div className="text-sm">{label}:</div><strong className="text-lg">{value}</strong></div>; }
function StakeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-center text-sm font-semibold">{label}<Input value={value} onChange={e => onChange(e.target.value)} className="mt-2 bg-white text-center" /></label>; }
function RiskField({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) { return <label className="flex items-center gap-2">{label}<Input value={value} onChange={e => setValue(e.target.value)} className="w-20 bg-white text-center" /></label>; }
export default SmartTrader;
