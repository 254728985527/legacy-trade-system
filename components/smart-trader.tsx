'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Circle, Globe2, Play, Settings2, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ActiveSymbol, DerivAccount, Tick } from '@deriv/core';

const REFERENCE_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%2027%2C%202026%2C%2007_44_46%20PM-Ww1hdeE87YSlSp5SeSV7ze661h65L9.png';
const fallbackMarkets = [
  { symbol: '1HZ10V', label: 'Volatility 10 (1s) Index' },
  { symbol: '1HZ50V', label: 'Volatility 50 (1s) Index' },
  { symbol: '1HZ75V', label: 'Volatility 75 (1s) Index' },
  { symbol: '1HZ100V', label: 'Volatility 100 (1s) Index' },
];

interface SmartTraderProps {
  symbols: ActiveSymbol[]; activeSymbol: ActiveSymbol | null; currentTick: Tick | null; isConnected: boolean;
  activeAccount: DerivAccount | null; selectSymbol: (symbol: string) => void; onRun: () => Promise<void>;
  isBuying: boolean; buyError: string | null;
  tradeType: import('@/lib/types').TradeType; setTradeType: (type: import('@/lib/types').TradeType) => void;
  contractMode: import('@/lib/types').ContractMode; setContractMode: (mode: import('@/lib/types').ContractMode) => void;
  stake: string; setStake: (value: string) => void; durationValue: number; setDurationValue: (value: number) => void;
}

export function SmartTrader({ symbols, activeSymbol, currentTick, isConnected, activeAccount, selectSymbol, onRun, isBuying, buyError, setTradeType: setEngineTradeType }: SmartTraderProps) {
  const [marketOpen, setMarketOpen] = useState(false);
  const [tradeTypeLabel, setTradeTypeLabel] = useState('Rise/Fall');
  const [stakeOne, setStakeOne] = useState('10');
  const [stakeTwo, setStakeTwo] = useState('10');
  const [duration, setDuration] = useState('1');
  const [durationUnit, setDurationUnit] = useState('ticks');
  const [overDigit, setOverDigit] = useState('4');
  const [underDigit, setUnderDigit] = useState('5');
  const [allowEquals, setAllowEquals] = useState(false);
  const [martingale, setMartingale] = useState('2.1');
  const [stopLoss, setStopLoss] = useState('50');
  const [takeProfit, setTakeProfit] = useState('100');
  const markets = useMemo(() => {
    const live = symbols.filter(s => s.submarket === 'volidx').map(s => ({ symbol: s.underlying_symbol || '', label: s.underlying_symbol_name || s.underlying_symbol || '' })).filter(s => s.symbol);
    return live.length ? live : fallbackMarkets;
  }, [symbols]);
  const selectedMarket = markets.find(m => m.symbol === activeSymbol?.underlying_symbol) || markets[2];
  const livePrice = currentTick?.ask ?? currentTick?.quote;
  const balance = activeAccount ? `${Number(activeAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${activeAccount.currency}` : 'Connect account';
  const payout = (Number(stakeOne || 0) * 1.923).toFixed(2);
  const tradeType = tradeTypeLabel;
  const isOverUnder = tradeType === 'Over/Under';
  const handleTradeType = (label: string) => {
    setTradeTypeLabel(label);
    const map = { 'Only Up': 'only-up', 'Only Down': 'only-down', 'Up + Down Hedging': 'up-down-hedging', 'Rise/Fall': 'only-up', 'Over/Under': 'over-under', 'Digit Over': 'over-under', 'Digit Under': 'over-under', 'Matches/Differs': 'matches-differs' } as const;
    setEngineTradeType(map[label as keyof typeof map] || 'only-up');
  };
  const showRise = tradeType === 'Only Up' || tradeType === 'Up + Down Hedging';
  const showFall = tradeType === 'Only Down' || tradeType === 'Up + Down Hedging';

  return (
    <section className="min-h-dvh bg-slate-100 px-3 pb-8 pt-4 text-slate-800 sm:px-6 lg:pl-10 lg:pr-10">
      <div className="mx-auto flex max-w-[1280px] gap-6">
        <aside className="hidden w-16 shrink-0 flex-col items-center gap-5 rounded-2xl bg-white py-5 shadow-sm ring-1 ring-slate-200 lg:flex">
          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">ST</div>
          <div className="h-px w-10 bg-slate-200" />
          <SideIcon label="Home" active><WalletCards /></SideIcon><SideIcon label="Reports"><Settings2 /></SideIcon>
          <div className="mt-auto flex flex-col gap-5"><SideIcon label="Help"><Circle /></SideIcon><SideIcon label="Language"><Globe2 /></SideIcon><SideIcon label="Account"><ShieldCheck /></SideIcon></div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[610px]">
              <Selector label="Market" value={selectedMarket.label} open={marketOpen} onClick={() => setMarketOpen(v => !v)}>
                {marketOpen && <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">{markets.map(m => <button key={m.symbol} type="button" onClick={() => { selectSymbol(m.symbol); setMarketOpen(false); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">{m.label}</button>)}</div>}
              </Selector>
              <label className="rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200"><span className="text-xs text-slate-500">Trade types</span><span className="relative mt-1 flex items-center"><select value={tradeType} onChange={e => handleTradeType(e.target.value)} className="w-full appearance-none bg-transparent text-lg font-medium outline-none"><option>Only Up</option><option>Only Down</option><option>Up + Down Hedging</option><option>Over/Under</option><option>Digit Over</option><option>Digit Under</option><option>Matches/Differs</option></select><ChevronDown className="pointer-events-none absolute right-0 size-5" /></span></label>
            </div>
            <div className="flex items-center justify-between gap-5 xl:justify-end"><div className="flex flex-col items-center"><span className="text-xs text-slate-500">Live price</span><strong className="rounded-md bg-emerald-500 px-2 py-1 text-lg text-white">{livePrice ? Number(livePrice).toFixed(2) : '—'}</strong></div><div><p className="text-sm text-orange-500">{activeAccount ? `${activeAccount.account_type === 'demo' ? 'Demo' : 'Real'} account` : 'Account'}</p><p className="text-xl font-bold">{balance}</p></div><Button className="bg-rose-500 text-white hover:bg-rose-600">Deposit</Button></div>
          </div>
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            {showRise && <TradeCard title="Rise" tone="up" stake={stakeOne} setStake={setStakeOne} payout={payout} onBuy={onRun} disabled={!isConnected || isBuying} />}
            {showFall && <TradeCard title="Fall" tone="down" stake={stakeTwo} setStake={setStakeTwo} payout={(Number(stakeTwo || 0) * 1.923).toFixed(2)} onBuy={onRun} disabled={!isConnected || isBuying} />}
          </div>
          {isOverUnder && <div className="mt-5 grid gap-5 xl:grid-cols-2"><DigitSide title="Over" value={overDigit} onChange={setOverDigit} stake={stakeOne} setStake={setStakeOne} /><DigitSide title="Under" value={underDigit} onChange={setUnderDigit} stake={stakeTwo} setStake={setStakeTwo} /></div>}
          <Card className="mt-6 border-0 bg-white shadow-sm ring-1 ring-slate-200"><CardContent className="flex flex-col gap-5 p-5">
            <div className="mx-auto grid w-full max-w-[570px] gap-3 sm:grid-cols-[1.15fr_1fr_1fr]"><Field label="Duration"><Input value={duration} onChange={e => setDuration(e.target.value)} /><select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} className="absolute right-3 top-9 bg-transparent font-medium outline-none"><option>ticks</option><option>seconds</option><option>minutes</option></select></Field><Field label="Stake 1"><Input value={stakeOne} onChange={e => setStakeOne(e.target.value)} inputMode="decimal" /></Field><Field label="Stake 2"><Input value={stakeTwo} onChange={e => setStakeTwo(e.target.value)} inputMode="decimal" /></Field></div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-slate-100 pt-4"><label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={allowEquals} onChange={e => setAllowEquals(e.target.checked)} /> Allow equals <Circle className="size-4 text-slate-400" /></label><RiskField label="Martingale" value={martingale} onChange={setMartingale} /><RiskField label="Stop Loss" value={stopLoss} onChange={setStopLoss} /><RiskField label="Take Profit" value={takeProfit} onChange={setTakeProfit} /></div>
            {buyError && <p role="alert" className="text-center text-sm font-medium text-rose-600">{buyError}</p>}
            <div className="flex min-h-20 items-center overflow-hidden rounded-lg border-4 border-slate-900 bg-white"><Button onClick={() => void onRun()} disabled={!isConnected || isBuying} className="h-16 rounded-none bg-emerald-500 px-7 text-xl font-bold text-white hover:bg-emerald-600"><Play className="mr-2 fill-current" />{isBuying ? 'Running' : 'Run'}</Button><div className="px-6"><p className="text-xs text-slate-500">Execution</p><p className="text-lg font-bold">{isConnected ? 'FAST' : 'OFFLINE'}</p></div><div className="ml-auto mr-5 size-9 rounded-full bg-emerald-500 p-1"><div className="size-7 rounded-full bg-white" /></div></div>
          </CardContent></Card>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{selectedMarket.label}</span><span>{allowEquals ? 'Equals allowed' : 'Equals disabled'} · {overDigit} over / {underDigit} under</span></div>
        </div>
      </div>
      <img src={REFERENCE_IMAGE} alt="Smart Trader reference design" className="sr-only" />
    </section>
  );
}

function Selector({ label, value, open, onClick, children }: { label: string; value: string; open: boolean; onClick: () => void; children?: React.ReactNode }) { return <div className="relative rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200"><span className="text-xs text-slate-500">{label}</span><button type="button" onClick={onClick} className="mt-1 flex w-full items-center justify-between text-left text-lg font-medium">{value}<ChevronDown className="size-5" /></button>{children}</div>; }
function SideIcon({ label, active, children }: { label: string; active?: boolean; children: React.ReactNode }) { return <div className={`flex flex-col items-center gap-1 text-[10px] ${active ? 'text-slate-900' : 'text-slate-400'}`}>{children}<span>{label}</span></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="relative rounded-lg border border-slate-200 px-3 py-2"><span className="text-xs text-slate-500">{label}</span>{children}</label>; }
function RiskField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="flex items-center gap-2 font-semibold">{label}<Input value={value} onChange={e => onChange(e.target.value)} className="h-9 w-20 text-center" /></label>; }
function TradeCard({ title, tone, stake, setStake, payout, onBuy, disabled }: { title: string; tone: 'up' | 'down'; stake: string; setStake: (value: string) => void; payout: string; onBuy: () => Promise<void>; disabled: boolean }) { const up = tone === 'up'; return <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-200"><CardContent className="p-0"><div className="flex items-center gap-5 px-6 py-5"><div className={`text-5xl ${up ? 'text-emerald-500' : 'text-rose-500'}`}>{up ? <ArrowUpRight /> : <ArrowDownRight />}</div><div className="grid flex-1 grid-cols-2 text-center"><div><p className="text-sm text-slate-500">Stake:</p><p className="text-lg font-bold">{Number(stake || 0).toFixed(2)} USD</p></div><div><p className="text-sm text-slate-500">Payout:</p><p className="text-lg font-bold">{payout} USD</p></div></div></div><div className="flex items-center gap-4 px-6 pb-5"><strong className="text-lg">{title}</strong><Button onClick={() => void onBuy()} disabled={disabled} className={`h-14 flex-1 text-lg font-bold text-white ${up ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}>Purchase</Button></div><div className="flex items-center justify-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-3 text-sm"><span>Stake</span><Input value={stake} onChange={e => setStake(e.target.value)} className="h-9 w-24 bg-white" /><span>USD</span><span className="ml-3">Net profit: {(Number(payout) - Number(stake || 0)).toFixed(2)} USD | Return 92.3%</span></div></CardContent></Card>; }
function DigitSide({ title, value, onChange, stake, setStake }: { title: string; value: string; onChange: (value: string) => void; stake: string; setStake: (value: string) => void }) { return <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200"><CardContent className="p-5"><div className="flex items-center justify-between"><h3 className="text-xl font-bold">{title}</h3><div className="flex items-center gap-2"><span className="text-sm text-slate-500">Stake</span><Input value={stake} onChange={e => setStake(e.target.value)} className="w-24" /></div></div><p className="mt-4 text-sm text-slate-500">Prediction digit</p><div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: 10 }, (_, digit) => <button key={digit} type="button" onClick={() => onChange(String(digit))} className={`rounded-lg border py-2 font-bold ${value === String(digit) ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>{digit}</button>)}</div></CardContent></Card>; }

export default SmartTrader;
