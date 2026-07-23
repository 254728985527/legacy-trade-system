'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AuthState, DerivAccount } from '@deriv/core';

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
}: HeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const logoLetter = (appName ?? process.env.NEXT_PUBLIC_DERIV_APP_NAME ?? 'Deriv Trading')
    .trim()
    .charAt(0)
    .toUpperCase() || 'D';
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const isAuthenticated = authState === 'authenticated';
  const isAuthenticating = authState === 'authenticating';

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid rgb(255, 215, 0)',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
    }} className="flex items-center justify-between px-4 py-3">
      {/* Left section: DIRECT/PROXY buttons and title */}
      <div className="flex items-center gap-4">
        {/* DIRECT/PROXY buttons */}
        <div className="flex gap-2">
          <button style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '2px solid rgb(255, 215, 0)',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            color: 'rgb(255, 215, 0)',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>DIRECT</button>
          <button style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid rgb(51, 51, 51)',
            backgroundColor: 'transparent',
            color: 'rgb(180, 180, 180)',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>PROXY</button>
        </div>

        {/* Title */}
        <div className="text-center hidden sm:block">
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}>
            👑 LAST DIGIT PREDICTION 👑
          </div>
          <div style={{ fontSize: '10px', color: 'rgb(255, 215, 0)', letterSpacing: '1px', marginTop: '2px' }}>
            REAL-TIME AI ANALYSIS
          </div>
        </div>
      </div>

      {/* Center section: Legend */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgb(0, 150, 255)' }} />
          <span style={{ color: 'rgb(180, 180, 180)' }}>LIVE / CURRENT DIGIT</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgb(0, 255, 0)' }} />
          <span style={{ color: 'rgb(180, 180, 180)' }}>HIGHEST %</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgb(255, 215, 0)' }} />
          <span style={{ color: 'rgb(180, 180, 180)' }}>2ND HIGHEST %</span>
        </div>
      </div>

      {/* Right section: LIVE indicator and auth */}
      <div className="flex items-center gap-3">
        {/* LIVE indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '4px',
          border: '2px solid rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgb(0, 255, 0)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgb(0, 255, 0)' }}>LIVE</span>
        </div>

        {actions}

        {/* Account section */}
        {isAuthenticated && activeAccount && (
          <Popover open={accountSwitcherOpen} onOpenChange={setAccountSwitcherOpen}>
            <PopoverTrigger asChild>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid rgb(51, 51, 51)',
                backgroundColor: 'rgba(51, 51, 51, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.5)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.3)';
              }}>
                <div className="text-left hidden sm:block">
                  <AccountLabel type={activeAccount.account_type} />
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgb(255, 255, 255)' }}>
                    {formatBalance(activeAccount.balance)} {activeAccount.currency}
                  </p>
                </div>
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    accountSwitcherOpen && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: 'rgb(180, 180, 180)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2" style={{ backgroundColor: 'rgb(26, 26, 26)', border: '1px solid rgb(51, 51, 51)' }}>
              <div className="space-y-1">
                {accounts.map((account) => (
                  <button
                    key={account.account_id}
                    onClick={() => {
                      onSwitchAccount(account.account_id);
                      setAccountSwitcherOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      backgroundColor: account.account_id === activeAccount.account_id ? 'rgba(51, 51, 51, 0.5)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (account.account_id !== activeAccount.account_id) {
                        e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = account.account_id === activeAccount.account_id ? 'rgba(51, 51, 51, 0.5)' : 'transparent';
                    }}
                  >
                    <AccountLabel type={account.account_type} />
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgb(255, 255, 255)' }}>
                      {formatBalance(account.balance)} {account.currency}
                    </p>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {isAuthenticated ? (
          <Button variant="destructive" onClick={onLogout} size="sm" style={{ backgroundColor: 'rgb(255, 51, 51)' }}>
            Logout
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onLogin} disabled={isAuthenticating} style={{ borderColor: 'rgb(255, 215, 0)', color: 'rgb(255, 215, 0)' }}>
              {isAuthenticating ? 'Logging in...' : 'Log in'}
            </Button>
            {onSignUp && (
              <Button size="sm" onClick={onSignUp} disabled={isAuthenticating} style={{ backgroundColor: 'rgb(0, 255, 0)', color: 'rgb(10, 10, 10)' }}>
                Sign up
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
