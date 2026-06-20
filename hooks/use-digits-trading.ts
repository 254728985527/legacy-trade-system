'use client';

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
import type { OHLC, IncomingTick } from '@/components/candlestick-chart';

const CONTRACT_TYPES = ['DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD'];

interface UseDigitsTradingReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
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
  // TURBO mode
  turboMode: boolean;
  setTurboMode: (enabled: boolean) => void;
  // Chart data
  candleData: OHLC[];
  incomingTicks: IncomingTick[];
  prices: number[];
  lastTenDigits: { digit: number; direction: 'up' | 'down'; price: number }[];
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

  // Digits-specific trade state
  const [tradeType, setTradeTypeRaw] = useState<TradeType>('matches-differs');
  const [contractMode, setContractMode] = useState<ContractMode>('DIGITMATCH');
  const [selectedDigit, setSelectedDigit] = useState<number>(5);
  const [stake, setStake] = useState<string>('10');
  const [duration, setDuration] = useState<number>(5);
  const [turboMode, setTurboMode] = useState<boolean>(false);
  const [incomingTicks, setIncomingTicks] = useState<IncomingTick[]>([]);
  const [candleData, setCandleData] = useState<OHLC[]>([]);
  const [lastTenDigits, setLastTenDigits] = useState<{ digit: number; direction: 'up' | 'down'; price: number }[]>([]);

  // Reset contract mode to the first option of the selected trade type
  const setTradeType = useCallback((type: TradeType) => {
    setTradeTypeRaw(type);
    switch (type) {
      case 'matches-differs':
        setContractMode('DIGITMATCH');
        break;
      case 'over-under':
        setContractMode('DIGITOVER');
        break;
      case 'even-odd':
        setContractMode('DIGITEVEN');
        break;
    }
  }, []);

  const digitStats: DigitStats = useMemo(
    () => computeDigitStats(prices, pipSize),
    [prices, pipSize]
  );

  const lastDigit = useMemo(() => {
    if (currentTick) {
      return getLastDigit(currentTick.quote, pipSize);
    }
    if (prices.length > 0) {
      return getLastDigit(prices[prices.length - 1], pipSize);
    }
    return null;
  }, [currentTick, prices, pipSize]);

  const {
    buyContract: buyWithProposal,
    isBuying,
    buyResult,
    buyError,
    clearBuyResult,
  } = useBuy(tradingWs, tradingIsConnected);

  // Null out params while a buy is in-flight — forces useProposal to unsubscribe
  // the consumed proposal ID. When isBuying flips back to false, the memo returns
  // real params and useProposal re-subscribes to get a fresh proposal.
  const proposalParams: ProposalParams | null = useMemo(() => {
    if (isBuying || !activeSymbol) return null;
    const stakeNum = parseFloat(stake);
    if (!stakeNum || stakeNum <= 0) return null;

    const needsBarrier = contractMode !== 'DIGITEVEN' && contractMode !== 'DIGITODD';

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
  }, [activeSymbol, contractMode, stake, duration, selectedDigit, isBuying]);

  const { proposal } = useProposal(tradingWs, tradingIsConnected, proposalParams);

  const buyContract = useCallback(async () => {
    if (proposal) {
      await buyWithProposal(proposal);
    }
  }, [proposal, buyWithProposal]);

  // Track incoming ticks and update candlestick data
  useEffect(() => {
    if (!currentTick || prices.length < 2) return;

    const lastPrice = prices[prices.length - 1];
    const prevPrice = prices[prices.length - 2];

    // Determine direction
    const direction: 'up' | 'down' = currentTick.quote >= lastPrice ? 'up' : 'down';

    // Add incoming tick
    const newTick: IncomingTick = {
      price: currentTick.quote,
      direction,
      timestamp: Date.now(),
    };

    setIncomingTicks(prev => [...prev.slice(-2), newTick]); // Keep last 3 ticks
    
    // Track last 10 incoming digits with direction
    const currentDigit = getLastDigit(currentTick.quote, pipSize);
    setLastTenDigits(prev => [
      ...prev.slice(-9),
      { digit: currentDigit, direction, price: currentTick.quote }
    ]);

    // Update candlestick data (aggregate every 5 ticks or 60 seconds)
    setCandleData(prev => {
      const now = Date.now();
      let updatedCandles = [...prev];

      if (updatedCandles.length === 0) {
        // Create first candle
        updatedCandles = [{
          timestamp: now,
          open: currentTick.quote,
          high: currentTick.quote,
          low: currentTick.quote,
          close: currentTick.quote,
        }];
      } else {
        const lastCandle = updatedCandles[updatedCandles.length - 1];

        // Update last candle
        lastCandle.high = Math.max(lastCandle.high, currentTick.quote);
        lastCandle.low = Math.min(lastCandle.low, currentTick.quote);
        lastCandle.close = currentTick.quote;

        // Create new candle every 5 ticks
        if ((updatedCandles[updatedCandles.length - 1].close !== currentTick.quote &&
             prices.filter(p => p === currentTick.quote).length % 5 === 0) ||
            (now - lastCandle.timestamp > 60000)) {
          updatedCandles.push({
            timestamp: now,
            open: currentTick.quote,
            high: currentTick.quote,
            low: currentTick.quote,
            close: currentTick.quote,
          });
        }
      }

      // Keep last 20 candles
      return updatedCandles.slice(-20);
    });

    // TURBO mode: auto-buy on matching digits
    if (turboMode && proposal && !isBuying) {
      const currentDigit = getLastDigit(currentTick.quote, pipSize);

      if (contractMode === 'DIGITUNDER' && currentDigit < selectedDigit) {
        buyWithProposal(proposal).catch(err => console.error('[v0] TURBO buy failed:', err));
      } else if (contractMode === 'DIGITOVER' && currentDigit > selectedDigit) {
        buyWithProposal(proposal).catch(err => console.error('[v0] TURBO buy failed:', err));
      } else if (contractMode === 'DIGITMATCH' && currentDigit === selectedDigit) {
        buyWithProposal(proposal).catch(err => console.error('[v0] TURBO buy failed:', err));
      } else if (contractMode === 'DIGITEVEN' && currentDigit % 2 === 0) {
        buyWithProposal(proposal).catch(err => console.error('[v0] TURBO buy failed:', err));
      } else if (contractMode === 'DIGITODD' && currentDigit % 2 !== 0) {
        buyWithProposal(proposal).catch(err => console.error('[v0] TURBO buy failed:', err));
      }
    }
  }, [currentTick, prices, pipSize, turboMode, proposal, isBuying, contractMode, selectedDigit, buyWithProposal]);

  return {
    isConnected,
    isLoading,
    error,
    symbols,
    activeSymbol,
    selectSymbol,
    currentTick,
    lastDigit,
    digitStats,
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
    turboMode,
    setTurboMode,
    candleData,
    incomingTicks,
    prices,
    lastTenDigits,
  };
}
