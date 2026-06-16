'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { TradingLayout } from './trading-dashboard/trading-layout';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  Tick,
  ProposalInfo,
} from '@deriv/core';

export interface DigitsViewProps {
  // Auth
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;

  // Connection / loading
  isLoading: boolean;
  error: string | null;

  // Market data
  activeSymbol: ActiveSymbol | null;
  currentTick: Tick | null;

  // Trading
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  buyContract: () => Promise<void>;
  isBuying: boolean;
  buyError: string | null;
  
  // Branding (used by preview route; no-op in the real app)
  logoSrc?: string;
  appName?: string;
}

export function DigitsView({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onSignUp,
  onLogout,
  onSwitchAccount,
  isLoading,
  error,
  activeSymbol,
  currentTick,
  proposal,
  isProposalLoading,
  buyContract,
  isBuying,
  buyError,
  logoSrc,
  appName,
}: DigitsViewProps) {
  if (error) {
    return (
      <main className="flex flex-col bg-background items-center justify-center px-4 min-h-dvh">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col bg-background min-h-dvh">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onLogout={onLogout}
        onSwitchAccount={onSwitchAccount}
        logoSrc={logoSrc}
        appName={appName}
        actions={<ThemeToggle />}
      />
      {/* Spacer for fixed header */}
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      {/* Main trading dashboard content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-4">
            <Skeleton className="h-8 w-64 rounded-full" />
            <Skeleton className="w-full h-[300px] rounded-lg" />
            <Skeleton className="w-full h-[200px] rounded-lg" />
          </div>
        ) : (
          <TradingLayout
            activeSymbol={activeSymbol}
            currentTick={currentTick}
            proposal={proposal}
            isProposalLoading={isProposalLoading}
            onBuy={buyContract}
            isBuying={isBuying}
            buyError={buyError}
          />
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm border-t border-[rgb(255,255,255,0.08)]">
        <Footer />
      </div>
    </main>
  );
}
