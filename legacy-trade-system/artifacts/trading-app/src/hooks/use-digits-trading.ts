import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  useProposal,
  useBuy,
} from '@deriv/core';
import type {
  ActiveSymbol,
  Tick,
  ProposalInfo,
  ProposalParams,
  DurationLimits,
  BuyResult,
} from '@deriv/core';
import { useBaseTrading } from '@/hooks/use-base-trading';
import type { UseBaseTradingParams } from '@/hooks/use-base-trading';
import { computeDigitStats, getLastDigit } from '../lib/digit-stats';
import type { ContractMode, TradeType, DigitStats, OpenPosition, ClosedPosition } from '../lib/types';

const CONTRACT_TYPES = ['DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD', 'CALL', 'PUT'];

interface UseDigitsTradingReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  liveBalances: Record<string, string>;
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
  prices: number[];
  tradeType: TradeType;
  setTradeType: (type: TradeType) => void;
  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;
  selectedDigit: number;
  setSelectedDigit: (digit: number) => void;
  contractsAvailable: boolean;
  pipSize: number;
  stake: string;
  setStake: (value: string) => void;
  martingale: string;
  setMartingale: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  durationLimits: DurationLimits;
  defaultStake: number;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  buyContract: () => Promise<void>;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  clearBuyResult: () => void;
  openPositions: OpenPosition[];
  closedPositions: ClosedPosition[];
  sellContract: (contractId: number, bidPrice: string) => Promise<void>;
  sellingId: number | null;
  sellError: string | null;
  clearSellError: () => void;
}

export type UseDigitsTradingParams = Pick<UseBaseTradingParams, 'ws' | 'isConnected' | 'isExhausted' | 'isAuthenticated' | 'onAuthWSFailed'>;

export function useDigitsTrading({ ws, isConnected, isExhausted, isAuthenticated, onAuthWSFailed }: UseDigitsTradingParams): UseDigitsTradingReturn {
  const {
    ws: tradingWs,
    isConnected: tradingIsConnected,
    isLoading,
    error,
    symbols,
    activeSymbol,
    selectSymbol,
    currentTick,
    prices,
    pipSize,
    contractsAvailable,
    durationLimits,
    defaultStake,
    openPositions,
    closedPositions,
    sellContract,
    sellingId,
    sellError,
    clearSellError,
  } = useBaseTrading({ ws, isConnected, isExhausted, isAuthenticated, onAuthWSFailed, contractTypes: CONTRACT_TYPES });

  const [liveBalances, setLiveBalances] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tradingWs || !tradingIsConnected || !isAuthenticated) return;
    tradingWs.send({ balance: 1, subscribe: 1, account: 'all' });
    return tradingWs.onMessage((data: Record<string, unknown>) => {
      if (data.msg_type !== 'balance') return;
      const bal = data.balance as { loginid?: string; balance?: number } | undefined;
      if (!bal?.loginid || bal.balance === undefined) return;
      setLiveBalances(prev => ({ ...prev, [bal.loginid!]: bal.balance!.toFixed(2) }));
    });
  }, [tradingWs, tradingIsConnected, isAuthenticated]);

  const [tradeType, setTradeTypeRaw] = useState<TradeType>('matches-differs');
  const [contractMode, setContractMode] = useState<ContractMode>('DIGITMATCH');
  const [selectedDigit, setSelectedDigit] = useState<number>(5);
  const [stake, setStake] = useState<string>('10');
  const [martingale, setMartingale] = useState<string>('1');
  const [duration, setDuration] = useState<number>(5);

  const setTradeType = useCallback((type: TradeType) => {
    setTradeTypeRaw(type);
    switch (type) {
      case 'matches-differs': setContractMode('DIGITMATCH'); break;
      case 'over-under':      setContractMode('DIGITOVER');  break;
      case 'even-odd':        setContractMode('DIGITEVEN');  break;
      case 'rise-fall':       setContractMode('CALL');       break;
    }
  }, []);

  const digitStats: DigitStats = useMemo(
    () => computeDigitStats(prices, pipSize),
    [prices, pipSize]
  );

  const lastDigit = useMemo(() => {
    if (currentTick) return getLastDigit(currentTick.quote, pipSize);
    if (prices.length > 0) return getLastDigit(prices[prices.length - 1], pipSize);
    return null;
  }, [currentTick, prices, pipSize]);

  const {
    buyContract: buyWithProposal,
    isBuying,
    buyResult,
    buyError,
    clearBuyResult,
  } = useBuy(tradingWs, tradingIsConnected);

  const isRiseFall = contractMode === 'CALL' || contractMode === 'PUT';
  const needsBarrier = !isRiseFall && contractMode !== 'DIGITEVEN' && contractMode !== 'DIGITODD';

  const proposalParams: ProposalParams | null = useMemo(() => {
    if (isBuying || !activeSymbol) return null;
    const stakeNum = parseFloat(stake);
    if (!stakeNum || stakeNum <= 0) return null;

    return {
      contractType: contractMode,
      symbol: activeSymbol.underlying_symbol,
      amount: stakeNum,
      duration,
      durationUnit: 't',
      basis: 'stake' as const,
      currency: 'USD',
      ...(needsBarrier ? { barrier: selectedDigit } : {}),
    };
  }, [activeSymbol, contractMode, stake, duration, selectedDigit, isBuying, needsBarrier]);

  const { proposal } = useProposal(tradingWs, tradingIsConnected, proposalParams);

  const buyContract = useCallback(async () => {
    if (!proposal) return;
    await buyWithProposal(proposal);
  }, [proposal, buyWithProposal]);

  return {
    isConnected,
    isLoading,
    error,
    liveBalances,
    symbols,
    activeSymbol,
    selectSymbol,
    currentTick,
    lastDigit,
    digitStats,
    prices,
    tradeType,
    setTradeType,
    contractMode,
    setContractMode,
    selectedDigit,
    setSelectedDigit,
    contractsAvailable,
    pipSize,
    stake,
    setStake,
    martingale,
    setMartingale,
    duration,
    setDuration,
    durationLimits,
    defaultStake,
    proposal,
    isProposalLoading: isConnected && proposalParams !== null && proposal === null,
    buyContract,
    isBuying,
    buyResult,
    buyError,
    clearBuyResult,
    openPositions,
    closedPositions,
    sellContract,
    sellingId,
    sellError,
    clearSellError,
  };
}
