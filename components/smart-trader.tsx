'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { ActiveSymbol, DerivAccount, Tick } from '@deriv/core';

const REFERENCE_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lO51BntFF0n9m1wt80gaRSXhtadAno.png';

interface SmartTraderProps {
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  currentTick: Tick | null;
  isConnected: boolean;
  activeAccount: DerivAccount | null;
  selectSymbol: (symbol: string) => void;
  onRun: () => Promise<void>;
  isBuying: boolean;
  buyError: string | null;
}

const fallbackMarkets = [
  { symbol: '1HZ10V', label: 'Volatility 10 (1s) Index' },
  { symbol: '1HZ50V', label: 'Volatility 50 (1s) Index' },
  { symbol: '1HZ75V', label: 'Volatility 75 (1s) Index' },
  { symbol: '1HZ100V', label: 'Volatility 100 (1s) Index' },
];

export function SmartTrader({ symbols, activeSymbol, currentTick, isConnected, activeAccount, selectSymbol, onRun, isBuying, buyError }: SmartTraderProps) {
  const [marketOpen, setMarketOpen] = useState(false);
  const [tradeType, setTradeType] = useState('Rise/Fall');
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
    const live = symbols.filter(symbol => symbol.submarket === 'volidx').map(symbol => ({ symbol: symbol.underlying_symbol || '', label: symbol.underlying_symbol_name || symbol.underlying_symbol || '' })).filter(market => market.symbol);
    return live.length > 0 ? live : fallbackMarkets;
  }, [symbols]);
  const selectedMarket = markets.find(market => market.symbol === activeSymbol?.underlying_symbol) || markets[2];
  const livePrice = currentTick?.ask ?? currentTick?.quote;
  const balance = activeAccount ? `${Number(activeAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${activeAccount.currency}` : 'Connect account';
  const payout = (Number(stakeOne || 0) * 1.923).toFixed(2);
  const isHedgingTrade = tradeType === 'Hedging Trade';
  const showRise = tradeType === 'Rise/Fall' || isHedgingTrade;
  const showFall = tradeType === 'Rise/Fall' || isHedgingTrade;

  return (
    <section className="min-h-dvh bg-slate-50 text-slate-900 px-4 pb-10 pt-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Smart execution workspace</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Trade with a clearer edge</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live quote</p>
              <p className="text-xl font-bold text-emerald-600">{livePrice ? Number(livePrice).toFixed(2) : '—'}</p>
            </div>
            <div className="rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{activeAccount ? 'Account balance' : 'Account'}</p>
              <p className="text-sm font-bold text-slate-800">{balance}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                <label className="text-xs font-semibold text-slate-500">Market</label>
                <button type="button" onClick={() => setMarketOpen(!marketOpen)} className="mt-1 flex w-full items-center justify-between text-left text-base font-semibold text-slate-800">
                  {selectedMarket.label}<span aria-hidden="true">⌄</span>
                </button>
                {marketOpen && <div className="absolute left-3 right-3 top-16 z-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                  {markets.map(market => <button type="button" key={market.symbol} onClick={() => { selectSymbol(market.symbol); setMarketOpen(false); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">{market.label}</button>)}
                </div>}
              </div>
              <label className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="text-xs font-semibold text-slate-500">Trade types</span><select value={tradeType} onChange={event => setTradeType(event.target.value)} className="mt-1 block w-full bg-transparent text-base font-semibold outline-none"><option>Rise/Fall</option><option>Hedging Trade</option><option>Over/Under</option><option>Matches/Differs</option></select></label>
            </div>

            <div className={`grid gap-4 ${showRise && showFall ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
              {showRise && <TradeCard tone="emerald" title="Rise" arrow="↗" stake={stakeOne} payout={payout} onStakeChange={setStakeOne} onBuy={onRun} disabled={!isConnected || isBuying} />}
              {showFall && <TradeCard tone="rose" title="Fall" arrow="↘" stake={stakeTwo} payout={(Number(stakeTwo || 0) * 1.923).toFixed(2)} onStakeChange={setStakeTwo} onBuy={onRun} disabled={!isConnected || isBuying} />}
            </div>
          </div>

          <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-0"><img src={REFERENCE_IMAGE} alt="Smart Trader Rise and Fall trading workspace reference" className="h-full min-h-56 w-full object-cover object-center" /></CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="flex flex-col gap-5 p-5">
            <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr]">
              <label className="rounded-lg border border-slate-200 p-3"><span className="text-xs font-semibold text-slate-500">Duration</span><div className="mt-1 flex gap-2"><Input value={duration} onChange={event => setDuration(event.target.value)} className="h-9 border-0 p-0 text-base font-semibold shadow-none" /><select value={durationUnit} onChange={event => setDurationUnit(event.target.value)} className="bg-transparent text-sm font-semibold outline-none"><option>ticks</option><option>seconds</option><option>minutes</option></select></div></label>
              <DigitSelect label="Over digit" value={overDigit} onChange={setOverDigit} />
              <DigitSelect label="Under digit" value={underDigit} onChange={setUnderDigit} />
            </div>
            <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-sm">
              <label className="flex items-center gap-2 font-medium"><input type="checkbox" checked={allowEquals} onChange={event => setAllowEquals(event.target.checked)} /> Allow equals</label>
              <label className="flex items-center gap-2"><span className="font-semibold">Martingale</span><Input value={martingale} onChange={event => setMartingale(event.target.value)} className="h-9 w-20" /></label>
              <label className="flex items-center gap-2"><span className="font-semibold">Stop Loss</span><Input value={stopLoss} onChange={event => setStopLoss(event.target.value)} className="h-9 w-20" /></label>
              <label className="flex items-center gap-2"><span className="font-semibold">Take Profit</span><Input value={takeProfit} onChange={event => setTakeProfit(event.target.value)} className="h-9 w-20" /></label>
            </div>
            {buyError && <p role="alert" className="text-sm font-medium text-rose-600">{buyError}</p>}
            <div className="flex flex-col gap-3 rounded-xl bg-slate-950 p-3 text-white sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Button onClick={() => void onRun()} disabled={!isConnected || isBuying} className="bg-emerald-500 text-white hover:bg-emerald-600">{isBuying ? 'Running…' : 'Run strategy'}</Button><span className="text-sm text-slate-300">Execution <strong className="text-white">{isConnected ? 'LIVE' : 'OFFLINE'}</strong></span></div><span className="text-xs text-slate-400">{selectedMarket.label} · {overDigit} over / {underDigit} under</span></div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function TradeCard({ tone, title, arrow, stake, payout, onStakeChange, onBuy, disabled }: { tone: 'emerald' | 'rose'; title: string; arrow: string; stake: string; payout: string; onStakeChange: (value: string) => void; onBuy: () => Promise<void>; disabled: boolean }) {
  const isEmerald = tone === 'emerald';
  return <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-200"><CardContent className="p-5"><div className="flex items-center justify-between"><span className={isEmerald ? 'text-3xl text-emerald-500' : 'text-3xl text-rose-500'}>{arrow}</span><div className="grid grid-cols-2 gap-8 text-center"><div><p className="text-xs text-slate-500">Stake:</p><p className="font-bold">{Number(stake || 0).toFixed(2)} USD</p></div><div><p className="text-xs text-slate-500">Payout:</p><p className="font-bold">{payout} USD</p></div></div></div><p className="mt-4 font-semibold">{title} <span className="text-xs font-normal text-slate-500">· separate stake</span></p><label className="mt-3 block text-xs font-semibold text-slate-500">Stake amount<Input aria-label={`${title} stake`} value={stake} onChange={event => onStakeChange(event.target.value)} inputMode="decimal" className="mt-1 h-9" /></label><Button onClick={() => void onBuy()} disabled={disabled} className={`mt-2 w-full ${isEmerald ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'} text-white`}>{disabled ? 'Connecting…' : 'Purchase'}</Button><p className="mt-3 text-center text-xs text-slate-500">Net profit: {(Number(payout) - Number(stake || 0)).toFixed(2)} USD | Return 92.3%</p></CardContent></Card>;
}

function DigitSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="rounded-lg border border-slate-200 p-3"><span className="text-xs font-semibold text-slate-500">{label}</span><select value={value} onChange={event => onChange(event.target.value)} className="mt-1 block w-full bg-transparent text-base font-semibold outline-none">{Array.from({ length: 10 }, (_, digit) => <option key={digit} value={digit}>{digit}</option>)}</select></label>;
}

export default SmartTrader;
