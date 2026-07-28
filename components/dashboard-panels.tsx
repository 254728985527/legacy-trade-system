'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { Tick } from '../lib/types';
import type { ActiveSymbol } from '../lib/types';
import type { DigitStats } from '../lib/types';

// Fallback volatility indices from Deriv
const FALLBACK_VOLATILITY_INDICES = [
  { symbol: '1HZ10V', label: 'Volatility 10', display: 'Volatility 10 Index' },
  { symbol: '1HZ25V', label: 'Volatility 25', display: 'Volatility 25 Index' },
  { symbol: '1HZ50V', label: 'Volatility 50', display: 'Volatility 50 Index' },
  { symbol: '1HZ75V', label: 'Volatility 75', display: 'Volatility 75 Index' },
  { symbol: '1HZ100V', label: 'Volatility 100', display: 'Volatility 100 Index' },
  { symbol: '1HZ150V', label: 'Volatility 150', display: 'Volatility 150 Index' },
  { symbol: '1HZ200V', label: 'Volatility 200', display: 'Volatility 200 Index' },
  { symbol: '1HZ250V', label: 'Volatility 250', display: 'Volatility 250 Index' },
  { symbol: '1HZ300V', label: 'Volatility 300', display: 'Volatility 300 Index' },
  { symbol: '1HZ10IV', label: 'Volatility 10 Index', display: 'Volatility 10 Index' },
  { symbol: '1HZ25IV', label: 'Volatility 25 Index', display: 'Volatility 25 Index' },
  { symbol: '1HZ50IV', label: 'Volatility 50 Index', display: 'Volatility 50 Index' },
  { symbol: '1HZ75IV', label: 'Volatility 75 Index', display: 'Volatility 75 Index' },
  { symbol: '1HZ100IV', label: 'Volatility 100 Index', display: 'Volatility 100 Index' },
  { symbol: '1HZ150IV', label: 'Volatility 150 Index', display: 'Volatility 150 Index' },
  { symbol: '1HZ200IV', label: 'Volatility 200 Index', display: 'Volatility 200 Index' },
];

// Helper to extract all volatility indices from Deriv symbols
function extractVolatilityIndices(symbols: ActiveSymbol[]): Array<{ symbol: string; label: string; display: string }> {
  const fromSymbols = symbols
    .filter(s => s.submarket === 'volidx')
    .sort((a, b) => {
      const aNum = parseInt(a.underlying_symbol?.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.underlying_symbol?.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    })
    .map(s => ({
      symbol: s.underlying_symbol || '',
      label: s.underlying_symbol_name || s.underlying_symbol || '',
      display: s.underlying_symbol_name || s.underlying_symbol || '',
    }));
  
  // Use real symbols if available, otherwise fallback to predefined list
  return fromSymbols.length > 0 ? fromSymbols : FALLBACK_VOLATILITY_INDICES;
}

export interface VolatilityIndexPanelProps {
  selectedVolatility: string;
  onSelectVolatility: (symbol: string) => void;
  symbols: ActiveSymbol[];
  currentTick: Tick | null;
  isLoading?: boolean;
}

export function VolatilityIndexPanel({ selectedVolatility, onSelectVolatility, symbols, currentTick, isLoading = false }: VolatilityIndexPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const volatilityIndices = extractVolatilityIndices(symbols);
  const selected = volatilityIndices.find(v => v.symbol === selectedVolatility) || volatilityIndices[0] || FALLBACK_VOLATILITY_INDICES[3];

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📈</span>
        <span className="panel-header-title">VOLATILITY INDEX</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-primary/25 bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all"
          >
            <span className="text-base font-bold text-foreground">{selected.label}</span>
            <span className={`text-primary text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 border border-primary/25 bg-card rounded-lg shadow-lg overflow-y-auto max-h-64">
              {volatilityIndices.map((vol) => (
                <button
                  key={vol.symbol}
                  onClick={() => {
                    onSelectVolatility(vol.symbol);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-all ${
                    selectedVolatility === vol.symbol
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'text-foreground hover:bg-primary/10'
                  }`}
                >
                  {vol.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* INDEX PRICE Section with Gold Bar */}
        <div>
          <div className="text-xs text-muted-foreground mb-2 tracking-wider">INDEX PRICE</div>
          {/* Gold bar separator */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40 rounded-full mb-3"></div>
          
          {currentTick?.ask ? (
            <div className="text-2xl font-black text-primary">
              {currentTick.ask.toFixed(2)}
            </div>
          ) : (
            <div className="text-2xl font-black text-primary/50">—</div>
          )}
          
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">{selected.display}</div>
        </div>
      </div>
    </Card>
  );
}

export interface LivePricePanelProps {
  selectedVolatility: string;
  currentTick: Tick | null;
  symbols: ActiveSymbol[];
  isLoading?: boolean;
}

export function LivePricePanel({ selectedVolatility, currentTick, symbols, isLoading = false }: LivePricePanelProps) {
  const volatilityIndices = extractVolatilityIndices(symbols);
  const selected = volatilityIndices.find(v => v.symbol === selectedVolatility) || volatilityIndices[0] || FALLBACK_VOLATILITY_INDICES[3];

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📊</span>
        <span className="panel-header-title">LIVE PRICE</span>
      </div>
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : currentTick?.ask ? (
          <>
            <div className="text-center">
              <div className="price-large text-white">
                {currentTick.ask.toFixed(2)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-primary font-black text-lg">
                {selected.label}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {selected.label}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Select a volatility index</div>
          </div>
        )}
      </div>
    </Card>
  );
}

export interface IncomingTickPanelProps {
  lastDigit: number | null;
  tickCount: number;
  totalTicks: number;
}

export function IncomingTickPanel({ lastDigit, tickCount = 0, totalTicks = 1000 }: IncomingTickPanelProps) {
  const progress = (tickCount / totalTicks) * 100;

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📡</span>
        <span className="panel-header-title">INCOMING TICK</span>
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="incoming-tick-container">
          <div className="incoming-tick-stars">⭐⭐⭐⭐⭐</div>
          <div className="incoming-tick-number">{lastDigit ?? '-'}</div>
        </div>
        <div className="text-xs text-muted-foreground mt-4">TICKS: {tickCount}/{totalTicks}</div>
        <div className="w-full bg-muted rounded-full h-1 mt-2">
          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </Card>
  );
}

export function LiveCursorTrackerPanel({ selectedDigit }: { selectedDigit: number }) {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📍</span>
        <span className="panel-header-title">LIVE CURSOR TRACKER</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-muted-foreground">CURRENT</span>
          <span className="text-muted-foreground">TARGET</span>
          <span className="text-muted-foreground">REMAINING</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <div className="digit-circle neutral">1</div>
          <span className="text-primary">→</span>
          <div className="digit-circle active">4</div>
          <span className="text-primary font-bold">3</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="digit-circle neutral w-8 h-8 text-sm">1</div>
          <div className="digit-circle neutral w-8 h-8 text-sm">2</div>
          <div className="digit-circle neutral w-8 h-8 text-sm">3</div>
          <div className="digit-circle active w-8 h-8 text-sm">4</div>
        </div>
      </div>
    </Card>
  );
}

export interface DigitPanelProps {
  rangeStart: number;
  rangeEnd: number;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
}

export function DigitPanel({ rangeStart, rangeEnd, currentTick, lastDigit, digitStats }: DigitPanelProps) {
  const digits = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
  
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="panel-header-title">
          DIGIT {rangeStart} TO {rangeEnd}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          {digits.map((digit) => {
            const percentage = digitStats.percentages[digit] || 0;
            const isActive = lastDigit === digit;
            return (
              <div key={digit} className="flex flex-col items-center gap-1 relative">
                {isActive && (
                  <div className="absolute -top-6 text-xs font-bold text-secondary animate-pulse">
                    ↓ CURSOR
                  </div>
                )}
                <div className={`digit-circle ${isActive ? 'active' : percentage > 6.4 ? 'strong' : percentage < 6.4 ? 'weak' : 'neutral'} ${isActive ? 'ring-2 ring-secondary ring-offset-2' : ''}`}>
                  {digit}
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-secondary/30 p-3 bg-secondary/5">
            <div className="text-secondary text-xs font-bold uppercase mb-1">OVER (Above 6.4%)</div>
            <div className="text-sm text-muted-foreground">0 - 1 - 3 - 4</div>
            <div className="text-2xl font-bold text-secondary mt-2">56.3%</div>
            <div className="text-xs text-muted-foreground mt-1">4 Digits</div>
          </div>
          
          <div className="rounded-lg border border-destructive/30 p-3 bg-destructive/5">
            <div className="text-destructive text-xs font-bold uppercase mb-1">UNDER (Below 6.4%)</div>
            <div className="text-2xl font-bold text-destructive mt-6">3.1%</div>
            <div className="text-xs text-muted-foreground mt-2">1 Digit</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-primary uppercase">THRESHOLD</div>
              <div className="text-2xl font-bold text-primary mt-1">6.4%</div>
            </div>
            <div className="text-2xl font-bold text-primary opacity-50">32 ÷ 5</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AIEngineWorkflowPanel() {
  const steps = [
    { num: 1, label: 'AI Endpoint', desc: 'AI recommends trade UNDER (0 - 4)' },
    { num: 2, label: 'Cursor Touching', desc: 'Live cursor reaches the entry digit' },
    { num: 3, label: 'Confirmation Digit Check', desc: 'Engine checks next tick for confirmation (0 - 4)' },
    { num: 4, label: 'Execution Point', desc: 'All conditions met Executing trade...' },
    { num: 5, label: 'Trade Executed', desc: 'UNDER trade placed successfully' },
  ];

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-secondary">🧠</span>
        <span className="panel-header-title">AI ENGINE UNDER (0 - 4)</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center min-w-fit">
                <div className="workflow-step-number">{step.num}</div>
                <div className="workflow-step-label">{step.label}</div>
                <div className="text-xs text-muted-foreground mt-1 text-center max-w-24">{step.desc}</div>
              </div>
              {idx < steps.length - 1 && <span className="workflow-arrow mx-2">→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2 mt-4 text-center text-xs">
          <div className="p-2 rounded border border-secondary/30 bg-secondary/5">
            <div className="text-secondary font-bold uppercase">Entry Point</div>
            <div className="text-lg font-bold text-foreground mt-1">4</div>
          </div>
          <div className="p-2 rounded border border-secondary/30 bg-secondary/5">
            <div className="text-secondary font-bold uppercase">Live Cursor</div>
            <div className="text-lg font-bold text-foreground mt-1">0 1 2 3</div>
            <div className="text-secondary text-xs mt-1">✓ Touched</div>
          </div>
          <div className="p-2 rounded border border-secondary/30 bg-secondary/5">
            <div className="text-secondary font-bold uppercase">Confirmation</div>
            <div className="text-lg font-bold text-foreground mt-1">0 1 2 3 4</div>
            <div className="text-secondary text-xs mt-1">✓ Valid</div>
          </div>
          <div className="p-2 rounded border border-secondary/30 bg-secondary/5">
            <div className="text-secondary font-bold uppercase">Trade Status</div>
            <div className="text-lg font-bold text-foreground mt-1">Executing</div>
          </div>
          <div className="p-2 rounded border border-secondary/30 bg-secondary/5">
            <div className="text-secondary font-bold uppercase">Confidence</div>
            <div className="text-lg font-bold text-secondary mt-1">84.4%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DigitStrengthRankingPanel({ digitStats }: { digitStats: DigitStats }) {
  const strengths = [
    { digit: 0, value: 9.4, strength: 'weak' },
    { digit: 1, value: 15.6, strength: 'strong' },
    { digit: 2, value: 3.1, strength: 'weak' },
    { digit: 3, value: 12.5, strength: 'neutral' },
    { digit: 4, value: 18.8, strength: 'strong' },
    { digit: 5, value: 9.4, strength: 'weak' },
    { digit: 6, value: 15.6, strength: 'strong' },
    { digit: 7, value: 6.3, strength: 'weak' },
    { digit: 8, value: 3.1, strength: 'weak' },
    { digit: 9, value: 6.3, strength: 'weak' },
  ];

  const maxValue = Math.max(...strengths.map(s => s.value));

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📊</span>
        <span className="panel-header-title">DIGIT STRENGTH RANKING</span>
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between gap-2 h-40">
          {strengths.map((item) => (
            <div key={item.digit} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs font-bold text-muted-foreground">{item.digit}</div>
              <div className="flex-1 w-full bg-muted rounded-t-lg relative group">
                <div
                  className={`strength-bar ${item.strength} w-full absolute bottom-0 transition-all`}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs font-bold text-muted-foreground">{item.value}%</div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span className="text-muted-foreground">STRONG (&gt;6.4%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-muted-foreground">NEUTRAL (=6.4%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span className="text-muted-foreground">WEAK (&lt;6.4%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function KeyDigitsPanel({ digitStats }: { digitStats: DigitStats }) {
  const keyDigits = [
    { digit: 4, percentage: 18.8, rank: 'HIGHEST', label: '1' },
    { digit: 1, percentage: 15.6, rank: '2ND HIGHEST', label: '2' },
    { digit: 2, percentage: 3.1, rank: 'LOWEST', label: '3' },
  ];

  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">👑</span>
        <span className="panel-header-title">KEY DIGITS</span>
      </div>
      <div className="p-4 space-y-3">
        {keyDigits.map((item) => (
          <div key={item.digit} className="key-digits-item">
            <div className={`key-digit-number ${item.rank === 'HIGHEST' ? 'highest' : item.rank === '2ND HIGHEST' ? 'second-highest' : 'lowest'}`}>
              {item.digit}
            </div>
            <div className="flex-1 mx-3">
              <div className="text-xs font-bold text-primary uppercase">{item.rank}</div>
              <div className="text-lg font-bold text-foreground">{item.percentage}%</div>
            </div>
            <span className="top-label">TOP</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SignalPanel({ selectedDigit }: { selectedDigit: number }) {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-secondary">📡</span>
        <span className="panel-header-title">SIGNAL (TOP 3 DIGITS)</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="digit-circle strong">4</div>
          <span className="top-label">TOP</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="digit-circle neutral">1</div>
          <span className="top-label">TOP</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="digit-circle weak">2</div>
          <span className="top-label">TOP</span>
        </div>
      </div>
    </Card>
  );
}

export function TotalPercentagePanel({ digitStats }: { digitStats: DigitStats }) {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">⏱️</span>
        <span className="panel-header-title">TOTAL % ON OVER AND UNDER</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div className="text-secondary uppercase">UNDER (0 - 4)</div>
          <div className="text-primary uppercase">OVER (5 - 9)</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm font-bold">
          <div className="text-secondary">0 + 1 + 2 + 3 + 4</div>
          <div className="text-primary">5 + 6 + 7 + 8 + 9</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xl font-bold">
          <div className="text-secondary">59.4%</div>
          <div className="text-primary">40.6%</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="h-2 bg-secondary/20 rounded overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: '59.4%' }}></div>
          </div>
          <div className="h-2 bg-primary/20 rounded overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '40.6%' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold mt-2">
          <div className="text-secondary">UNDER 59.4%</div>
          <div className="text-primary">OVER 40.6%</div>
        </div>
      </div>
    </Card>
  );
}

export function AIEndpointPanel({ selectedDigit }: { selectedDigit: number }) {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-secondary">🚀</span>
        <span className="panel-header-title">AI ENDPOINT (TRADE SIGNAL)</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="ai-endpoint-container">
          <div className="text-secondary uppercase text-xs font-bold">UNDER SIDE (0 - 4)</div>
          <div className="ai-endpoint-value">AI ENDPOINT: 4</div>
          <div className="ai-endpoint-side">UNDER SIDE (0 - 4)</div>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">STRONGEST</span>
              <span className="text-foreground font-bold">4 (18.8%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">WEAKEST</span>
              <span className="text-destructive font-bold">2 (3.1%)</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/30 rounded p-3">
          <div className="uppercase text-xs font-bold text-primary mb-2">OVER SIDE (5 - 9)</div>
          <div className="text-xl font-bold text-primary">AI ENDPOINT: 6</div>
          <div className="text-primary text-sm mt-1">OVER SIDE (5 - 9)</div>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">STRONGEST</span>
              <span className="text-foreground font-bold">6 (15.6%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">WEAKEST</span>
              <span className="text-destructive font-bold">8 (3.1%)</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">VS</div>
        </div>

        <div className="flex items-center justify-between p-2 rounded border border-secondary/30 bg-secondary/5">
          <div className="text-center flex-1">
            <div className="text-secondary text-xs font-bold uppercase">DIRECTION</div>
            <div className="text-secondary text-2xl font-bold">↓ UNDER</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xs font-bold uppercase">AI CONFIDENCE</div>
            <div className="confidence-value">84.4%</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-secondary text-xs font-bold uppercase">RECOMMENDATION</div>
            <div className="text-secondary font-bold">TAKE TRADE</div>
            <div className="confidence-stars">⭐⭐⭐⭐✓</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
