'use client';

import { useDigitsTrading } from '../hooks/use-digits-trading';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { useLogoSrc } from '@/components/custom/logo-src-provider';
import { DigitsView } from '../components/digits-view';

export default function DigitsPage() {
  const logoSrc = useLogoSrc();
  const { ws, isConnected, isExhausted, auth } = useDerivWSContext();
  const { authState, accounts, activeAccount, login, signUp, logout, switchAccount } = auth;

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
      isLoading={trading.isLoading}
      error={trading.error}
      activeSymbol={trading.activeSymbol}
      currentTick={trading.currentTick}
      proposal={trading.proposal}
      isProposalLoading={trading.isProposalLoading}
      buyContract={trading.buyContract}
      isBuying={trading.isBuying}
      buyError={trading.buyError}
    />
  );
}
