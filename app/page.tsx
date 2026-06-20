'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDigitsTrading } from '../hooks/use-digits-trading';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { DigitsView } from '../components/digits-view';
import { Card, CardContent } from '@/components/ui/card';

export default function DigitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount, error: authError } = auth;
  const [isInitializing, setIsInitializing] = useState(true);

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      console.log('[v0] OAuth callback code detected, processing...');
      // The useAuth hook in DerivWSProvider will handle this automatically
      // Just wait for auth state to change
    }

    // Mark initialization complete after short delay to allow auth to process
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      console.error('[v0] Auth error:', authError);
    }
  }, [authError]);

  // Show loading state during OAuth callback processing
  if (isInitializing && authState === 'authenticating') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-75" />
                <div className="absolute inset-0 bg-primary rounded-full animate-spin opacity-50" 
                     style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">Authenticating</h2>
              <p className="text-sm text-muted-foreground">Processing authorization...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle auth error state
  if (authState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-500 mb-2">Authentication Error</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {authError || 'Failed to authenticate. Please try again.'}
              </p>
              <button
                onClick={() => login()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trading = useDigitsTrading({ ws, isConnected, isExhausted, isAuthenticated: !!auth.wsUrl, onAuthWSFailed: logout });

  return (
    <DigitsView
      authState={authState}
      accounts={accounts}
      activeAccount={activeAccount}
      onLogin={login}
      onSignUp={signUp}
      onLogout={logout}
      onSwitchAccount={switchAccount}
      logoSrc={logoSrc}
      isConnected={trading.isConnected}
      isLoading={trading.isLoading}
      error={trading.error}
      symbols={trading.symbols}
      activeSymbol={trading.activeSymbol}
      selectSymbol={trading.selectSymbol}
      currentTick={trading.currentTick}
      lastDigit={trading.lastDigit}
      digitStats={trading.digitStats}
      pipSize={trading.pipSize}
      tradeType={trading.tradeType}
      setTradeType={trading.setTradeType}
      contractMode={trading.contractMode}
      setContractMode={trading.setContractMode}
      selectedDigit={trading.selectedDigit}
      setSelectedDigit={trading.setSelectedDigit}
      stake={trading.stake}
      setStake={trading.setStake}
      duration={trading.duration}
      setDuration={trading.setDuration}
      durationLimits={trading.durationLimits}
      proposal={trading.proposal}
      isProposalLoading={trading.isProposalLoading}
      buyContract={trading.buyContract}
      isBuying={trading.isBuying}
      buyResult={trading.buyResult}
      buyError={trading.buyError}
      clearBuyResult={trading.clearBuyResult}
      turboMode={trading.turboMode}
      setTurboMode={trading.setTurboMode}
      candleData={trading.candleData}
      incomingTicks={trading.incomingTicks}
      lastTenDigits={trading.lastTenDigits}
    />
  );
}
