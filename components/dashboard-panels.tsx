'use client';

import { Card } from '@/components/ui/card';
import type { Tick } from '../lib/types';
import type { ActiveSymbol } from '../lib/types';
import type { DigitStats } from '../lib/types';

export function VolatilityIndexPanel() {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📈</span>
        <span className="panel-header-title">VOLATILITY INDEX</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Vol 75 (1s) Index</span>
          <span className="text-sm text-primary">▼</span>
        </div>
        <div className="text-3xl font-bold text-foreground">6924.61</div>
        <div className="text-xs text-muted-foreground mt-2">VOL 75 (1S) INDEX</div>
      </div>
    </Card>
  );
}

export function LivePricePanel({ currentTick, activeSymbol }: { currentTick: Tick | null; activeSymbol: ActiveSymbol | null }) {
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="text-primary">📊</span>
        <span className="panel-header-title">LIVE PRICE</span>
      </div>
      <div className="p-4">
        <div className="price-large">
          {currentTick?.ask ? (
            <>
              <span>{currentTick.ask.toFixed(2)}</span>
              <span className="price-symbol"> Vol 75</span>
            </>
          ) : (
            'N/A'
          )}
        </div>
        <div className="index-label mt-2">VOL 75 (1S)</div>
      </div>
    </Card>
  );
}

export function IncomingTickPanel({ lastDigit }: { lastDigit: number | null }) {
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
        <div className="text-xs text-muted-foreground mt-4">TICKS: 32/1000</div>
        <div className="w-full bg-muted rounded-full h-1 mt-2">
          <div className="bg-primary h-full rounded-full" style={{ width: '3.2%' }}></div>
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

export function DigitPanel({ rangeStart, rangeEnd, currentTick }: { rangeStart: number; rangeEnd: number; currentTick: Tick | null }) {
  const digits = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
  const samplePercentages = [9.4, 15.6, 3.1, 12.5, 18.8, 9.4, 15.6, 6.3, 3.1, 6.3];
  
  return (
    <Card className="panel">
      <div className="panel-header">
        <span className="panel-header-title">
          DIGIT {rangeStart} TO {rangeEnd}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          {digits.map((digit) => (
            <div key={digit} className="flex flex-col items-center gap-1">
              <div className={`digit-circle ${digit % 2 === 0 ? 'strong' : 'weak'}`}>
                {digit}
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {samplePercentages[digit]}%
              </span>
            </div>
          ))}
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
