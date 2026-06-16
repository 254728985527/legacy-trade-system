'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  const isAuthenticated = authState === 'authenticated';
  const isAuthenticating = authState === 'authenticating';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-[rgb(255,255,255,0.08)] bg-[rgb(20,24,31)]/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {!logoSrc || logoError ? (
          <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-base">
            {logoLetter}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- next/image is avoided here intentionally: it errors in the optimizer when /logo.png is absent locally; a plain img with onError gives the same silent fallback behaviour
          <img
            src={logoSrc}
            alt="App Logo"
            className="h-10 w-auto object-contain"
            onError={() => setLogoError(true)}
          />
        )}
        <div>
          <p className="text-[rgb(255,193,7)] text-xs font-medium">Demo account</p>
          <p className="text-white font-bold">10,958.18 USD</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        {isAuthenticated ? (
          <Button variant="destructive" onClick={onLogout} size="sm">
            Logout
          </Button>
        ) : (
          <Button 
            onClick={onLogin} 
            disabled={isAuthenticating}
            className="bg-[rgb(70,70,70)] hover:bg-[rgb(85,85,85)] text-[rgb(255,193,7)] font-bold px-6 text-sm rounded-lg"
          >
            {isAuthenticating ? 'Logging in...' : 'LOGIN'}
          </Button>
        )}
      </div>
    </header>
  );
}
