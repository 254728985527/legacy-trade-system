import { useState, useMemo } from 'react';
import type { ActiveSymbol } from '@deriv/core';
import { getSubmarketDisplayName } from '@/lib/active-symbols-display-names';

interface VolSectionProps {
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  onSymbolChange: (s: string) => void;
}

function groupBySubmarket(symbols: ActiveSymbol[]) {
  const map = new Map<string, { label: string; symbols: ActiveSymbol[] }>();
  for (const s of symbols) {
    const key = s.submarket;
    const existing = map.get(key);
    if (existing) {
      existing.symbols.push(s);
    } else {
      map.set(key, {
        label: s.submarket_display_name ?? getSubmarketDisplayName(s.submarket),
        symbols: [s],
      });
    }
  }
  return map;
}

export function VolSection({ symbols, activeSymbol, onSymbolChange }: VolSectionProps) {
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => groupBySubmarket(symbols), [symbols]);

  const badgeLabel = activeSymbol?.underlying_symbol
    ?.replace('R_', '')
    ?.replace('1HZ', '')
    ?.replace('V', '')
    ?.replace('_', '')
    ?.slice(0, 5) ?? '?';

  return (
    <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}>
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-3.5 py-2.5 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight" style={{ color: 'var(--gold)', letterSpacing: '-1px' }}>VOL</span>
          <div
            className="w-7 h-7 flex items-center justify-center rounded text-[0.65rem] font-bold"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)', color: 'var(--text-secondary)' }}
          >
            {badgeLabel}
          </div>
          <span className="text-sm font-semibold truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>
            {activeSymbol?.underlying_symbol_name ?? 'Select…'}
          </span>
        </div>
        <span
          className="text-xs transition-transform duration-300"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {/* Collapsible list */}
      {open && (
        <div
          className="animate-slide-down overflow-y-auto"
          style={{ borderTop: '1px solid var(--border-col)', maxHeight: 400 }}
        >
          {Array.from(groups.entries()).map(([key, { label, symbols: group }]) => (
            <div key={key}>
              <div
                className="flex items-center gap-1.5 px-3.5 py-1.5"
                style={{
                  background: 'var(--bg-deep)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {label}
                <span
                  className="text-[0.6rem] px-1 rounded"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
                >
                  {group.length}
                </span>
              </div>
              {group.map(sym => {
                const isActive = sym.underlying_symbol === activeSymbol?.underlying_symbol;
                return (
                  <button
                    key={sym.underlying_symbol}
                    className="w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left"
                    style={{
                      background: isActive ? 'var(--bg-hover)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--blue)' : '2px solid transparent',
                    }}
                    onClick={() => { onSymbolChange(sym.underlying_symbol); setOpen(false); }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 700 : 400 }}
                    >
                      {sym.underlying_symbol_name}
                    </span>
                    {isActive && (
                      <span className="text-[0.6rem] font-bold" style={{ color: 'var(--blue)' }}>●</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
