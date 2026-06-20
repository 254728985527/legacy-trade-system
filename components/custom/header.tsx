'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AuthState, DerivAccount, ActiveSymbol } from '@deriv/core';

interface HeaderProps {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;
  /** When provided, a Sign up button is rendered to the right of the Log in button. */
  onSignUp?: () => Promise<void>;
  /** Logo source URL or data URL. When omitted, a placeholder badge is shown until
   *  the user provides a logo via the app builder (passed as a data URL via PREVIEW_BRANDING). */
  logoSrc?: string;
  /** App name used to derive the fallback logo letter when no logoSrc is provided.
   *  Falls back to NEXT_PUBLIC_DERIV_APP_NAME env var, then 'Deriv Trading'. */
  appName?: string;
  /** Optional controls rendered to the left of the login/logout button (e.g. a theme toggle). */
  actions?: React.ReactNode;
  /** Active symbol for display */
  activeSymbol?: ActiveSymbol | null;
  /** Current price/tick for display */
  currentPrice?: number | null;
  /** Available symbols for dropdown */
  symbols?: ActiveSymbol[];
  /** Callback for symbol selection */
  onSymbolChange?: (symbol: string) => void;
  /** Last digit for display */
  lastDigit?: number | null;
}

function formatBalance(balance: string): string {
  return Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AccountLabel({ type }: { type: 'demo' | 'real' }) {
  return (
    <span
      className={cn(
        'text-sm font-medium',
        type === 'demo' ? 'text-orange-500' : 'text-emerald-600'
      )}
    >
      {type === 'demo' ? 'Demo account' : 'Real account'}
    </span>
  );
}

export function Header({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onLogout,
  onSwitchAccount,
  onSignUp,
  logoSrc,
  appName,
  actions,
  activeSymbol,
  currentPrice,
  symbols,
  onSymbolChange,
  lastDigit,
}: HeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const [symbolDropdownOpen, setSymbolDropdownOpen] = useState(false);
  const logoLetter = (appName ?? process.env.NEXT_PUBLIC_DERIV_APP_NAME ?? 'Deriv Trading')
    .trim()
    .charAt(0)
    .toUpperCase() || 'D';
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const isAuthenticated = authState === 'authenticated';
  const isAuthenticating = authState === 'authenticating';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        {!logoSrc || logoError ? (
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {logoLetter}
          </div>
        ) : (
          <img
            src={logoSrc}
            alt="App Logo"
            className="h-8 w-auto object-contain"
            onError={() => setLogoError(true)}
          />
        )}
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">
          {process.env.NEXT_PUBLIC_DERIV_APP_NAME ?? 'Deriv Trading'}
        </h1>
      </div>

      {/* Center: Symbol selector and Price display */}
      <div className="flex flex-1 items-center justify-center gap-6">
        {symbols && onSymbolChange && (
          <Popover open={symbolDropdownOpen} onOpenChange={setSymbolDropdownOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium text-foreground">
                  {activeSymbol?.display_name ?? 'Select Symbol'}
                </span>
                <svg
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform',
                    symbolDropdownOpen && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-72 p-2">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {symbols.map((symbol) => (
                  <button
                    key={symbol.symbol}
                    onClick={() => {
                      onSymbolChange(symbol.symbol);
                      setSymbolDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full text-left rounded-lg px-3 py-2.5 transition-colors',
                      symbol.symbol === activeSymbol?.symbol
                        ? 'bg-primary/10'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{symbol.display_name}</p>
                    <p className="text-xs text-muted-foreground">{symbol.symbol}</p>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Current price display */}
        {currentPrice !== null && currentPrice !== undefined && (
          <div className="text-center">
            <div className="text-5xl font-bold text-foreground tracking-tight tabular-nums">
              {currentPrice.toFixed(2)}
            </div>
            {lastDigit !== null && lastDigit !== undefined && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Last Digit: <span className="inline-flex w-5 h-5 rounded-full bg-primary text-white items-center justify-center text-xs font-bold">{lastDigit}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Theme toggle, account switcher, auth buttons */}
      <div className="flex items-center gap-3">
        {actions}
        {isAuthenticated && activeAccount && (
          <Popover open={accountSwitcherOpen} onOpenChange={setAccountSwitcherOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border px-3 hover:bg-muted/50 transition-colors">
                <div className="text-left">
                  <AccountLabel type={activeAccount.account_type} />
                  <p className="text-base font-bold text-foreground">
                    {formatBalance(activeAccount.balance)} {activeAccount.currency}
                  </p>
                </div>
                <svg
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform',
                    accountSwitcherOpen && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="space-y-1">
                {accounts.map((account) => (
                  <button
                    key={account.account_id}
                    onClick={() => {
                      onSwitchAccount(account.account_id);
                      setAccountSwitcherOpen(false);
                    }}
                    className={cn(
                      'w-full text-left rounded-lg px-3 py-2.5 transition-colors',
                      account.account_id === activeAccount.account_id
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <AccountLabel type={account.account_type} />
                    <p className="text-base font-bold text-foreground">
                      {formatBalance(account.balance)} {account.currency}
                    </p>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {isAuthenticated ? (
          <Button variant="destructive" size="sm" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onLogin} disabled={isAuthenticating}>
              {isAuthenticating ? 'Logging in...' : 'Log in'}
            </Button>
            {onSignUp && (
              <Button size="sm" onClick={onSignUp} disabled={isAuthenticating}>
                Sign up
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
